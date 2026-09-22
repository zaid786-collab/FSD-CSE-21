import validator from 'validator';
import mongoose from 'mongoose';
import { Profile } from '../models/Profile.js';
import { Project } from '../models/Project.js';
import { Skill } from '../models/Skill.js';
import { Experience } from '../models/Experience.js';
import { Education } from '../models/Education.js';
import { Certification } from '../models/Certification.js';
import { Hackathon } from '../models/Hackathon.js';
import { Achievement } from '../models/Achievement.js';
import { ContactSubmission } from '../models/ContactSubmission.js';
import { emailService } from '../services/emailService.js';
import { getGithubData, getCpStats } from '../services/statsService.js';
import {
  verifiedProfile,
  verifiedSkills,
  verifiedProjects,
  verifiedExperience,
  verifiedHackathons,
  verifiedEducation,
  verifiedCertifications,
  verifiedAchievements
} from '../seeds/seedData.js';

export async function getPublicPortfolio(req, res, next) {
  try {
    let profile = null;
    let skills = [];
    let projects = [];
    let experience = [];
    let education = [];
    let certifications = [];
    let hackathons = [];
    let achievements = [];

    if (mongoose.connection.readyState === 1) {
      try {
        [profile, skills, projects, experience, education, certifications, hackathons, achievements] = await Promise.all([
          Profile.findOne({ status: 'published' }).lean(),
          Skill.find({ isDeleted: false, status: { $ne: 'draft' } }).sort({ order: 1 }).lean(),
          Project.find({ isDeleted: false, status: 'published' }).sort({ order: 1 }).lean(),
          Experience.find({ isDeleted: false, status: 'published' }).sort({ order: 1 }).lean(),
          Education.find({ isDeleted: false, status: { $ne: 'draft' } }).sort({ order: 1 }).lean(),
          Certification.find({ isDeleted: false, status: { $ne: 'draft' } }).sort({ order: 1 }).lean(),
          Hackathon.find({ isDeleted: false, status: { $ne: 'draft' } }).sort({ order: 1 }).lean(),
          Achievement.find({ isDeleted: false, status: 'published' }).sort({ order: 1 }).lean()
        ]);
      } catch (dbErr) {
        console.warn('Database query failed, returning verified static fallback:', dbErr.message);
      }
    }

    res.json({
      success: true,
      data: {
        profile: profile || verifiedProfile,
        skills: skills?.length ? skills : verifiedSkills,
        projects: projects?.length ? projects : verifiedProjects,
        experience: experience?.length ? experience : verifiedExperience,
        education: education?.length ? education : verifiedEducation,
        certifications: certifications?.length ? certifications : verifiedCertifications,
        hackathons: hackathons?.length ? hackathons : verifiedHackathons,
        achievements: achievements?.length ? achievements : verifiedAchievements
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function getProjectDetail(req, res, next) {
  try {
    const { slug } = req.params;
    let project = null;

    if (mongoose.connection.readyState === 1) {
      try {
        project = await Project.findOne({ slug: slug.toLowerCase(), isDeleted: false, status: 'published' }).lean();
      } catch (dbErr) {
        console.warn('DB query error on getProjectDetail:', dbErr.message);
      }
    }

    if (!project) {
      project = verifiedProjects.find(p => p.slug === slug.toLowerCase());
    }

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    res.json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
}

export async function getGithub(req, res, next) {
  try {
    const data = await getGithubData();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getCompetitiveProgramming(req, res, next) {
  try {
    const data = getCpStats();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function handleContactSubmission(req, res, next) {
  try {
    const { name, email, company, phone, purpose, subject, message } = req.body;

    // Strict validation
    if (!name || validator.isEmpty(name.trim())) {
      return res.status(400).json({ success: false, message: 'Name is required.' });
    }
    if (!email || !validator.isEmail(email.trim())) {
      return res.status(400).json({ success: false, message: 'A valid email address is required.' });
    }
    if (!subject || validator.isEmpty(subject.trim())) {
      return res.status(400).json({ success: false, message: 'Subject is required.' });
    }
    if (!message || validator.isEmpty(message.trim())) {
      return res.status(400).json({ success: false, message: 'Message content is required.' });
    }

    const validPurposes = [
      'Internship',
      'Full-time Opportunity',
      'Freelance',
      'Project Collaboration',
      'Hackathon or Open Source',
      'General Inquiry'
    ];
    const cleanPurpose = validPurposes.includes(purpose) ? purpose : 'General Inquiry';

    const submissionData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      company: (company || '').trim(),
      phone: (phone || '').trim(),
      purpose: cleanPurpose,
      subject: subject.trim(),
      message: message.trim(),
      ipAddress: req.ip || '',
      userAgent: req.headers['user-agent'] || ''
    };

    // 1. Persist to MongoDB
    let savedSubmission = null;
    let dbSaveSuccess = false;

    if (mongoose.connection.readyState === 1) {
      try {
        savedSubmission = new ContactSubmission(submissionData);
        await savedSubmission.save();
        dbSaveSuccess = true;
        submissionData.createdAt = savedSubmission.createdAt;
      } catch (dbErr) {
        console.error('[CONTACT DATABASE ERROR] Could not persist contact submission to MongoDB:', dbErr.message);
      }
    } else {
      console.warn('[CONTACT DATABASE WARNING] MongoDB not connected; running in fallback mode.');
    }

    // 2. Dispatch email notifications
    const emailResults = await Promise.allSettled([
      emailService.sendContactNotification(submissionData),
      emailService.sendSenderAutoReply(submissionData)
    ]);

    const ownerEmailResult = emailResults[0].status === 'fulfilled'
      ? emailResults[0].value
      : { sent: false, error: emailResults[0].reason?.message || 'Dispatch error' };

    const senderEmailResult = emailResults[1].status === 'fulfilled'
      ? emailResults[1].value
      : { sent: false, error: emailResults[1].reason?.message || 'Dispatch error' };

    const ownerEmailSent = Boolean(ownerEmailResult?.sent);
    const autoReplySent = Boolean(senderEmailResult?.sent);

    // 3. Update database record flags with true delivery results
    if (savedSubmission) {
      savedSubmission.emailNotificationSent = ownerEmailSent;
      savedSubmission.autoReplySent = autoReplySent;
      await savedSubmission.save().catch(err => {
        console.warn('[CONTACT WARNING] Could not update delivery flags in database:', err.message);
      });
    }

    // 4. Distinguish outcomes and provide transparent, safe logging and client responses
    if (dbSaveSuccess && ownerEmailSent) {
      console.log('[CONTACT SUCCESS] Submission saved to database and email notification sent to owner successfully.');
      return res.status(200).json({
        success: true,
        message: autoReplySent
          ? 'Thank you! Your message has been sent successfully. An automatic confirmation has been delivered to your email.'
          : 'Thank you! Your message has been sent successfully to the portfolio owner.',
        delivery: { database: true, email: true }
      });
    }

    if (dbSaveSuccess && !ownerEmailSent) {
      console.warn(`[CONTACT WARNING] Contact saved successfully in database, but email notification failed. (Reason: ${ownerEmailResult?.reason || ownerEmailResult?.error || 'unconfigured'})`);
      return res.status(200).json({
        success: true,
        message: 'Thank you! Your message has been received and saved. We will review your inquiry shortly.',
        delivery: { database: true, email: false }
      });
    }

    if (!dbSaveSuccess && ownerEmailSent) {
      console.warn('[CONTACT WARNING] Database persistence failed, but email notification was successfully delivered to owner.');
      return res.status(200).json({
        success: true,
        message: 'Thank you! Your message has been dispatched directly to the portfolio owner.',
        delivery: { database: false, email: true }
      });
    }

    // Both database storage and email delivery failed
    console.error('[CONTACT ERROR] Both database storage and email notification failed for submission from:', submissionData.email);
    return res.status(500).json({
      success: false,
      message: 'Unable to deliver or record your message at this time. Please reach out directly to the email listed above.',
      delivery: { database: false, email: false }
    });
  } catch (err) {
    next(err);
  }
}
