import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { AdminUser, AUTHORIZED_ADMIN_EMAIL } from '../models/AdminUser.js';
import { Project } from '../models/Project.js';
import { Profile } from '../models/Profile.js';
import { Skill } from '../models/Skill.js';
import { Experience } from '../models/Experience.js';
import { Education } from '../models/Education.js';
import { Certification } from '../models/Certification.js';
import { Hackathon } from '../models/Hackathon.js';
import { Achievement } from '../models/Achievement.js';
import { ContactSubmission } from '../models/ContactSubmission.js';
import { JWT_SECRET } from '../middleware/authMiddleware.js';
import { emailService, getEmailConfig } from '../services/emailService.js';
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

function setAuthCookie(res, token) {
  const isProduction = process.env.NODE_ENV === 'production';
  const sameSite = isProduction ? (process.env.COOKIE_SAME_SITE || 'none') : 'lax';
  const secure = isProduction;

  res.cookie('mzk_token', token, {
    httpOnly: true,
    secure,
    sameSite,
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
}

// -------------------------------------------------------------
// Authentication Controllers
// -------------------------------------------------------------
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    // Strict server-side check: Only the authorized email can authenticate
    if (email.trim().toLowerCase() !== AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
      return res.status(403).json({
        success: false,
        message: 'Access Denied: Only zaidkhan24082006@gmail.com has administrative privileges.'
      });
    }

    let user = null;
    if (mongoose.connection.readyState === 1) {
      try {
        user = await AdminUser.findOne({ email: AUTHORIZED_ADMIN_EMAIL.toLowerCase() });
      } catch (e) {}
    }

    const defaultPass = process.env.ADMIN_INITIAL_PASSWORD || 'ZaidKhanAdmin2026!';

    if (!user) {
      if (password === defaultPass) {
        user = {
          _id: 'authorized-admin-id',
          email: AUTHORIZED_ADMIN_EMAIL,
          role: 'admin',
          lastLogin: new Date()
        };
        if (mongoose.connection.readyState === 1) {
          try {
            const newUser = new AdminUser({
              email: AUTHORIZED_ADMIN_EMAIL,
              password: defaultPass
            });
            await newUser.save();
            user = newUser;
          } catch (e) {}
        }
      } else {
        return res.status(401).json({ success: false, message: 'Invalid administrative credentials.' });
      }
    } else {
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid administrative credentials.' });
      }
      user.lastLogin = new Date();
      if (typeof user.save === 'function') {
        await user.save();
      }
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    setAuthCookie(res, token);

    res.json({
      success: true,
      message: 'Authentication successful.',
      user: {
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function googleLogin(req, res, next) {
  try {
    const { credential, email, googleId } = req.body;

    let targetEmail = email;
    if (credential) {
      try {
        const parts = credential.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
          targetEmail = payload.email;
        }
      } catch (e) {
        return res.status(400).json({ success: false, message: 'Invalid Google OAuth credential.' });
      }
    }

    if (!targetEmail) {
      return res.status(400).json({ success: false, message: 'Email could not be identified from Google authentication.' });
    }

    // Strict authorization guard: must strictly match owner
    if (targetEmail.trim().toLowerCase() !== AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
      return res.status(403).json({
        success: false,
        message: 'Access Denied: Only zaidkhan24082006@gmail.com is authorized for administrative privileges.'
      });
    }

    let user = null;
    if (mongoose.connection.readyState === 1) {
      user = await AdminUser.findOne({ email: AUTHORIZED_ADMIN_EMAIL.toLowerCase() });
      if (!user) {
        user = new AdminUser({
          email: AUTHORIZED_ADMIN_EMAIL,
          googleId: googleId || 'google-oauth-owner'
        });
      } else if (googleId) {
        user.googleId = googleId;
      }
      user.lastLogin = new Date();
      await user.save();
    } else {
      user = {
        _id: 'authorized-admin-id',
        email: AUTHORIZED_ADMIN_EMAIL,
        role: 'admin',
        lastLogin: new Date()
      };
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    setAuthCookie(res, token);

    res.json({
      success: true,
      message: 'Google authentication successful.',
      user: {
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function logout(req, res) {
  const isProduction = process.env.NODE_ENV === 'production';
  const sameSite = isProduction ? (process.env.COOKIE_SAME_SITE || 'none') : 'lax';
  const secure = isProduction;

  res.clearCookie('mzk_token', {
    httpOnly: true,
    secure,
    sameSite
  });
  res.json({ success: true, message: 'Logged out successfully.' });
}

export async function checkAuth(req, res) {
  res.json({
    success: true,
    user: {
      email: req.adminUser.email,
      role: req.adminUser.role,
      lastLogin: req.adminUser.lastLogin
    }
  });
}

export async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;

    if (!email || email.trim().toLowerCase() !== AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
      return res.json({
        success: true,
        message: 'If the provided email is registered, a password reset instruction has been logged.'
      });
    }

    if (mongoose.connection.readyState === 1) {
      const user = await AdminUser.findOne({ email: AUTHORIZED_ADMIN_EMAIL.toLowerCase() });
      if (user) {
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 mins
        await user.save();

        console.log(`\n========================================`);
        console.log(`[MZK ADMIN PASSWORD RESET TOKEN]`);
        console.log(`Token: ${resetToken}`);
        console.log(`Valid for: 15 minutes`);
        console.log(`========================================\n`);
      }
    }

    res.json({
      success: true,
      message: 'If the provided email is registered, a password reset instruction has been logged.'
    });
  } catch (err) {
    next(err);
  }
}

export async function resetPassword(req, res, next) {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword || newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'A valid token and new password (min 8 chars) are required.' });
    }

    if (mongoose.connection.readyState === 1) {
      const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
      const user = await AdminUser.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() }
      });

      if (!user) {
        return res.status(400).json({ success: false, message: 'Password reset token is invalid or has expired.' });
      }

      user.password = newPassword;
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save();
    }

    res.json({ success: true, message: 'Password has been reset successfully. You may now log in.' });
  } catch (err) {
    next(err);
  }
}

// -------------------------------------------------------------
// Module 1: Dashboard Overview Stats
// -------------------------------------------------------------
export async function getOverviewStats(req, res, next) {
  try {
    let stats = {
      projects: { total: 5, published: 5, draft: 0, archived: 0 },
      experience: 1,
      skills: 17,
      education: 1,
      certifications: 7,
      hackathons: 2,
      achievements: 3,
      contactsCount: 0,
      database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      serverUptime: process.uptime()
    };

    if (mongoose.connection.readyState === 1) {
      const [
        totalProjects,
        publishedProjects,
        draftProjects,
        archivedProjects,
        expCount,
        skillCount,
        eduCount,
        certCount,
        hackCount,
        achieveCount,
        contactsCount
      ] = await Promise.all([
        Project.countDocuments(),
        Project.countDocuments({ status: 'published', isDeleted: false }),
        Project.countDocuments({ status: 'draft', isDeleted: false }),
        Project.countDocuments({ $or: [{ status: 'archived' }, { isDeleted: true }] }),
        Experience.countDocuments({ isDeleted: false }),
        Skill.countDocuments({ isDeleted: false }),
        Education.countDocuments({ isDeleted: false }),
        Certification.countDocuments({ isDeleted: false }),
        Hackathon.countDocuments({ isDeleted: false }),
        Achievement.countDocuments({ isDeleted: false }),
        ContactSubmission.countDocuments()
      ]);

      stats.projects = {
        total: totalProjects,
        published: publishedProjects,
        draft: draftProjects,
        archived: archivedProjects
      };
      stats.experience = expCount;
      stats.skills = skillCount;
      stats.education = eduCount;
      stats.certifications = certCount;
      stats.hackathons = hackCount;
      stats.achievements = achieveCount;
      stats.contactsCount = contactsCount;
    }

    res.json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
}

// -------------------------------------------------------------
// Module 2: Projects Management
// -------------------------------------------------------------
export async function getAllProjectsAdmin(req, res, next) {
  try {
    let projects = [];
    if (mongoose.connection.readyState === 1) {
      try {
        projects = await Project.find().sort({ order: 1 });
      } catch (e) {}
    }
    res.json({ success: true, data: projects?.length ? projects : verifiedProjects });
  } catch (err) {
    next(err);
  }
}

export async function saveProject(req, res, next) {
  try {
    const {
      _id,
      name,
      slug,
      tagline,
      description,
      problemStatement,
      solution,
      features,
      techStack,
      architecture,
      challenges,
      role,
      githubUrl,
      liveDemoUrl,
      order,
      status
    } = req.body;

    if (!name || !slug || !tagline || !description || !githubUrl) {
      return res.status(400).json({ success: false, message: 'Name, slug, tagline, description, and GitHub URL are required.' });
    }

    const projectData = {
      name: name.trim(),
      slug: slug.trim().toLowerCase(),
      tagline: tagline.trim(),
      description: description.trim(),
      problemStatement: (problemStatement || '').trim(),
      solution: (solution || '').trim(),
      features: Array.isArray(features) ? features : (typeof features === 'string' ? features.split('\n').filter(Boolean) : []),
      techStack: Array.isArray(techStack) ? techStack : (typeof techStack === 'string' ? techStack.split(',').map(s => s.trim()).filter(Boolean) : []),
      architecture: (architecture || '').trim(),
      challenges: Array.isArray(challenges) ? challenges : (typeof challenges === 'string' ? challenges.split('\n').filter(Boolean) : []),
      role: role || 'Project Leader',
      githubUrl: githubUrl.trim(),
      liveDemoUrl: liveDemoUrl ? liveDemoUrl.trim() : null,
      order: typeof order === 'number' ? order : 0,
      status: ['draft', 'published', 'archived'].includes(status) ? status : 'published',
      isDeleted: status === 'archived'
    };

    let project = null;
    if (mongoose.connection.readyState === 1) {
      if (_id && mongoose.isValidObjectId(_id)) {
        project = await Project.findByIdAndUpdate(_id, projectData, { new: true, runValidators: true });
      } else {
        project = await Project.findOneAndUpdate(
          { slug: projectData.slug },
          projectData,
          { upsert: true, new: true, runValidators: true }
        );
      }
    } else {
      project = { _id: _id || `in-mem-${Date.now()}`, ...projectData };
    }

    res.json({ success: true, message: 'Project saved successfully.', data: project });
  } catch (err) {
    next(err);
  }
}

export async function updateProject(req, res, next) {
  req.body._id = req.params.id;
  return saveProject(req, res, next);
}

export async function softDeleteProject(req, res, next) {
  try {
    const { id } = req.params;
    let project = null;
    if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(id)) {
      project = await Project.findByIdAndUpdate(
        id,
        { isDeleted: true, status: 'archived', deletedAt: new Date() },
        { new: true }
      );
    }
    res.json({ success: true, message: 'Project archived successfully.', data: project });
  } catch (err) {
    next(err);
  }
}

export async function restoreProject(req, res, next) {
  try {
    const { id } = req.params;
    let project = null;
    if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(id)) {
      project = await Project.findByIdAndUpdate(
        id,
        { isDeleted: false, status: 'published', deletedAt: null },
        { new: true }
      );
    }
    res.json({ success: true, message: 'Project restored successfully.', data: project });
  } catch (err) {
    next(err);
  }
}

export async function permanentDeleteProject(req, res, next) {
  try {
    const { id } = req.params;
    const { confirmPermanent } = req.body;

    if (!confirmPermanent) {
      return res.status(400).json({ success: false, message: 'Confirmation required for permanent deletion.' });
    }

    if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(id)) {
      await Project.findByIdAndDelete(id);
    }
    res.json({ success: true, message: 'Project permanently deleted.' });
  } catch (err) {
    next(err);
  }
}

// -------------------------------------------------------------
// Module 3: Experience Management
// -------------------------------------------------------------
export async function getExperienceAdmin(req, res, next) {
  try {
    let data = [];
    if (mongoose.connection.readyState === 1) {
      try {
        data = await Experience.find().sort({ order: 1 });
      } catch (e) {}
    }
    res.json({ success: true, data: data?.length ? data : verifiedExperience });
  } catch (err) {
    next(err);
  }
}

export async function saveExperienceAdmin(req, res, next) {
  try {
    const id = req.params.id || req.body._id;
    const {
      title,
      role,
      company,
      organization,
      type,
      employmentType,
      startDate,
      endDate,
      currentlyWorking,
      period,
      location,
      description,
      responsibilities,
      technologies,
      order,
      status
    } = req.body;

    const finalTitle = (role || title || '').trim();
    const finalCompany = (organization || company || '').trim();

    if (!finalTitle || !finalCompany || !description) {
      return res.status(400).json({ success: false, message: 'Role, organization, and description are required.' });
    }

    const payload = {
      title: finalTitle,
      role: finalTitle,
      company: finalCompany,
      organization: finalCompany,
      type: employmentType || type || 'Freelance',
      employmentType: employmentType || type || 'Freelance',
      startDate: startDate || '',
      endDate: endDate || '',
      currentlyWorking: Boolean(currentlyWorking),
      period: period || (startDate && endDate ? `${startDate} – ${endDate}` : 'Ongoing'),
      location: location || 'Remote',
      description: description.trim(),
      responsibilities: Array.isArray(responsibilities) ? responsibilities : (typeof responsibilities === 'string' ? responsibilities.split('\n').filter(Boolean) : []),
      technologies: Array.isArray(technologies) ? technologies : (typeof technologies === 'string' ? technologies.split(',').map(s => s.trim()).filter(Boolean) : []),
      order: typeof order === 'number' ? order : 0,
      status: ['draft', 'published', 'archived'].includes(status) ? status : 'published',
      isDeleted: status === 'archived'
    };

    let item = null;
    if (mongoose.connection.readyState === 1) {
      if (id && mongoose.isValidObjectId(id)) {
        item = await Experience.findByIdAndUpdate(id, payload, { new: true });
      } else {
        item = new Experience(payload);
        await item.save();
      }
    } else {
      item = { _id: id || `in-mem-${Date.now()}`, ...payload };
    }

    res.json({ success: true, message: 'Experience saved successfully.', data: item });
  } catch (err) {
    next(err);
  }
}

export async function deleteExperienceAdmin(req, res, next) {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(id)) {
      await Experience.findByIdAndDelete(id);
    }
    res.json({ success: true, message: 'Experience deleted.' });
  } catch (err) {
    next(err);
  }
}

// -------------------------------------------------------------
// Module 4: Skills Management
// -------------------------------------------------------------
export async function getSkillsAdmin(req, res, next) {
  try {
    let data = [];
    if (mongoose.connection.readyState === 1) {
      try {
        data = await Skill.find().sort({ category: 1, order: 1 });
      } catch (e) {}
    }
    res.json({ success: true, data: data?.length ? data : verifiedSkills });
  } catch (err) {
    next(err);
  }
}

export async function saveSkillAdmin(req, res, next) {
  try {
    const id = req.params.id || req.body._id;
    const { name, category, icon, order, status } = req.body;

    if (!name || !category) {
      return res.status(400).json({ success: false, message: 'Skill name and category are required.' });
    }

    const payload = {
      name: name.trim(),
      category: category.trim(),
      icon: icon || '',
      order: typeof order === 'number' ? order : 0,
      status: ['draft', 'published', 'archived'].includes(status) ? status : 'published',
      isDeleted: status === 'archived'
    };

    let item = null;
    if (mongoose.connection.readyState === 1) {
      if (id && mongoose.isValidObjectId(id)) {
        item = await Skill.findByIdAndUpdate(id, payload, { new: true });
      } else {
        item = new Skill(payload);
        await item.save();
      }
    } else {
      item = { _id: id || `in-mem-${Date.now()}`, ...payload };
    }

    res.json({ success: true, message: 'Skill saved successfully.', data: item });
  } catch (err) {
    next(err);
  }
}

export async function deleteSkillAdmin(req, res, next) {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(id)) {
      await Skill.findByIdAndDelete(id);
    }
    res.json({ success: true, message: 'Skill deleted.' });
  } catch (err) {
    next(err);
  }
}

export async function updateSkillsBatchAdmin(req, res, next) {
  try {
    const { skills } = req.body;
    if (!Array.isArray(skills)) {
      return res.status(400).json({ success: false, message: 'Skills array required.' });
    }

    if (mongoose.connection.readyState === 1) {
      await Skill.deleteMany({});
      const inserted = await Skill.insertMany(skills.map((s, index) => ({
        name: s.name,
        category: s.category || 'Other',
        icon: s.icon || '',
        order: typeof s.order === 'number' ? s.order : index,
        status: s.status || 'published'
      })));
      return res.json({ success: true, message: 'Skills updated successfully.', data: inserted });
    }

    res.json({ success: true, message: 'Skills updated successfully.', data: skills });
  } catch (err) {
    next(err);
  }
}

// -------------------------------------------------------------
// Module 5: Education Management
// -------------------------------------------------------------
export async function getEducationAdmin(req, res, next) {
  try {
    let data = [];
    if (mongoose.connection.readyState === 1) {
      try {
        data = await Education.find().sort({ order: 1 });
      } catch (e) {}
    }
    res.json({ success: true, data: data?.length ? data : verifiedEducation });
  } catch (err) {
    next(err);
  }
}

export async function saveEducationAdmin(req, res, next) {
  try {
    const id = req.params.id || req.body._id;
    const { degree, fieldOfStudy, institution, startYear, endYear, period, cgpa, grade, description, order, status } = req.body;

    if (!degree || !institution) {
      return res.status(400).json({ success: false, message: 'Degree and institution are required.' });
    }

    const payload = {
      degree: degree.trim(),
      fieldOfStudy: (fieldOfStudy || 'Computer Science & Engineering').trim(),
      institution: institution.trim(),
      startYear: startYear || '2025',
      endYear: endYear || '2029',
      period: period || `${startYear || '2025'}–${endYear || '2029'}`,
      cgpa: cgpa || grade || '9.1',
      description: (description || '').trim(),
      order: typeof order === 'number' ? order : 0,
      status: ['draft', 'published', 'archived'].includes(status) ? status : 'published',
      isDeleted: status === 'archived'
    };

    let item = null;
    if (mongoose.connection.readyState === 1) {
      if (id && mongoose.isValidObjectId(id)) {
        item = await Education.findByIdAndUpdate(id, payload, { new: true });
      } else {
        item = new Education(payload);
        await item.save();
      }
    } else {
      item = { _id: id || `in-mem-${Date.now()}`, ...payload };
    }

    res.json({ success: true, message: 'Education saved.', data: item });
  } catch (err) {
    next(err);
  }
}

export async function deleteEducationAdmin(req, res, next) {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(id)) {
      await Education.findByIdAndDelete(id);
    }
    res.json({ success: true, message: 'Education deleted.' });
  } catch (err) {
    next(err);
  }
}

// -------------------------------------------------------------
// Module 6: Certifications Management
// -------------------------------------------------------------
export async function getCertificationsAdmin(req, res, next) {
  try {
    let data = [];
    if (mongoose.connection.readyState === 1) {
      try {
        data = await Certification.find().sort({ order: 1 });
      } catch (e) {}
    }
    res.json({ success: true, data: data?.length ? data : verifiedCertifications });
  } catch (err) {
    next(err);
  }
}

export async function saveCertificationAdmin(req, res, next) {
  try {
    const id = req.params.id || req.body._id;
    const { title, name, issuer, credentialUrl, credentialId, issueDate, expiryDate, status, details, description, category, order } = req.body;

    const finalTitle = (title || name || '').trim();
    if (!finalTitle || !issuer) {
      return res.status(400).json({ success: false, message: 'Certification title and issuer are required.' });
    }

    const payload = {
      title: finalTitle,
      issuer: issuer.trim(),
      credentialUrl: credentialUrl || '',
      credentialId: credentialId || '',
      issueDate: issueDate || '',
      expiryDate: expiryDate || '',
      status: status || 'Completed',
      details: details || description || '',
      description: description || details || '',
      category: category || 'Technical',
      order: typeof order === 'number' ? order : 0,
      isDeleted: false
    };

    let item = null;
    if (mongoose.connection.readyState === 1) {
      if (id && mongoose.isValidObjectId(id)) {
        item = await Certification.findByIdAndUpdate(id, payload, { new: true });
      } else {
        item = new Certification(payload);
        await item.save();
      }
    } else {
      item = { _id: id || `in-mem-${Date.now()}`, ...payload };
    }

    res.json({ success: true, message: 'Certification saved.', data: item });
  } catch (err) {
    next(err);
  }
}

export async function deleteCertificationAdmin(req, res, next) {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(id)) {
      await Certification.findByIdAndDelete(id);
    }
    res.json({ success: true, message: 'Certification deleted.' });
  } catch (err) {
    next(err);
  }
}

// -------------------------------------------------------------
// Module 7: Hackathons Management
// -------------------------------------------------------------
export async function getHackathonsAdmin(req, res, next) {
  try {
    let data = [];
    if (mongoose.connection.readyState === 1) {
      try {
        data = await Hackathon.find().sort({ order: 1 });
      } catch (e) {}
    }
    res.json({ success: true, data: data?.length ? data : verifiedHackathons });
  } catch (err) {
    next(err);
  }
}

export async function saveHackathonAdmin(req, res, next) {
  try {
    const id = req.params.id || req.body._id;
    const { name, organizer, date, location, projectName, role, description, teamInfo, teamInformation, result, certificateUrl, projectUrl, technologies, order, status } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Hackathon name is required.' });
    }

    const payload = {
      name: name.trim(),
      organizer: organizer || '',
      date: date || '',
      location: location || 'India',
      projectName: projectName || '',
      role: role || 'Team Leader',
      description: (description || '').trim(),
      teamInfo: teamInfo || teamInformation || 'Team Leader & Solution Architect',
      result: result || '',
      certificateUrl: certificateUrl || '',
      projectUrl: projectUrl || '',
      technologies: Array.isArray(technologies) ? technologies : (typeof technologies === 'string' ? technologies.split(',').map(s => s.trim()).filter(Boolean) : []),
      order: typeof order === 'number' ? order : 0,
      status: ['draft', 'published', 'archived'].includes(status) ? status : 'published',
      isDeleted: status === 'archived'
    };

    let item = null;
    if (mongoose.connection.readyState === 1) {
      if (id && mongoose.isValidObjectId(id)) {
        item = await Hackathon.findByIdAndUpdate(id, payload, { new: true });
      } else {
        item = new Hackathon(payload);
        await item.save();
      }
    } else {
      item = { _id: id || `in-mem-${Date.now()}`, ...payload };
    }

    res.json({ success: true, message: 'Hackathon saved.', data: item });
  } catch (err) {
    next(err);
  }
}

export async function deleteHackathonAdmin(req, res, next) {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(id)) {
      await Hackathon.findByIdAndDelete(id);
    }
    res.json({ success: true, message: 'Hackathon deleted.' });
  } catch (err) {
    next(err);
  }
}

// -------------------------------------------------------------
// Module 8: Achievements Management
// -------------------------------------------------------------
export async function getAchievementsAdmin(req, res, next) {
  try {
    let data = [];
    if (mongoose.connection.readyState === 1) {
      try {
        data = await Achievement.find().sort({ order: 1 });
      } catch (e) {}
    }
    res.json({ success: true, data: data?.length ? data : verifiedAchievements });
  } catch (err) {
    next(err);
  }
}

export async function saveAchievementAdmin(req, res, next) {
  try {
    const id = req.params.id || req.body._id;
    const { title, description, date, category, url, mediaUrl, order, status } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description are required.' });
    }

    const payload = {
      title: title.trim(),
      description: description.trim(),
      date: date || '',
      category: category || 'Technical',
      url: url || '',
      mediaUrl: mediaUrl || '',
      order: typeof order === 'number' ? order : 0,
      status: ['draft', 'published', 'archived'].includes(status) ? status : 'published',
      isDeleted: status === 'archived'
    };

    let item = null;
    if (mongoose.connection.readyState === 1) {
      if (id && mongoose.isValidObjectId(id)) {
        item = await Achievement.findByIdAndUpdate(id, payload, { new: true });
      } else {
        item = new Achievement(payload);
        await item.save();
      }
    } else {
      item = { _id: id || `in-mem-${Date.now()}`, ...payload };
    }

    res.json({ success: true, message: 'Achievement saved.', data: item });
  } catch (err) {
    next(err);
  }
}

export async function deleteAchievementAdmin(req, res, next) {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(id)) {
      await Achievement.findByIdAndDelete(id);
    }
    res.json({ success: true, message: 'Achievement deleted.' });
  } catch (err) {
    next(err);
  }
}

// -------------------------------------------------------------
// Module 9: Profile / About Management
// -------------------------------------------------------------
export async function getProfileAdmin(req, res, next) {
  try {
    let profile = null;
    if (mongoose.connection.readyState === 1) {
      try {
        profile = await Profile.findOne();
      } catch (e) {}
    }
    res.json({ success: true, data: profile || verifiedProfile });
  } catch (err) {
    next(err);
  }
}

export async function updateProfileAdmin(req, res, next) {
  try {
    let profile = null;
    const updateData = {
      ...req.body,
      email: AUTHORIZED_ADMIN_EMAIL // Lock email strictly to owner
    };

    if (mongoose.connection.readyState === 1) {
      profile = await Profile.findOneAndUpdate(
        {},
        updateData,
        { upsert: true, new: true, runValidators: true }
      );
    } else {
      profile = { ...verifiedProfile, ...updateData };
    }

    res.json({ success: true, message: 'Profile updated successfully.', data: profile });
  } catch (err) {
    next(err);
  }
}

// -------------------------------------------------------------
// Module 10: Availability / Contact Settings & Inquiries Inbox
// -------------------------------------------------------------
export async function getAvailabilityAdmin(req, res, next) {
  try {
    let profile = null;
    if (mongoose.connection.readyState === 1) {
      profile = await Profile.findOne();
    }
    const current = profile || verifiedProfile;
    res.json({
      success: true,
      data: {
        availabilityStatus: current.availabilityStatus || 'Available for Opportunities',
        availabilityStatement: current.availabilityStatement || 'Open to software engineering opportunities, internships & freelance projects',
        publicEmail: current.publicEmail || AUTHORIZED_ADMIN_EMAIL,
        contactFormEnabled: current.contactFormEnabled !== false,
        notificationEmail: AUTHORIZED_ADMIN_EMAIL
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function updateAvailabilityAdmin(req, res, next) {
  try {
    const { availabilityStatus, availabilityStatement, publicEmail, contactFormEnabled } = req.body;

    const payload = {
      availabilityStatus: availabilityStatus || 'Available for Opportunities',
      availabilityStatement: availabilityStatement || 'Open to software engineering opportunities, internships & freelance projects',
      publicEmail: publicEmail || AUTHORIZED_ADMIN_EMAIL,
      contactFormEnabled: contactFormEnabled !== false,
      notificationEmail: AUTHORIZED_ADMIN_EMAIL
    };

    let profile = null;
    if (mongoose.connection.readyState === 1) {
      profile = await Profile.findOneAndUpdate(
        {},
        payload,
        { upsert: true, new: true }
      );
    } else {
      profile = { ...verifiedProfile, ...payload };
    }

    res.json({ success: true, message: 'Availability & contact settings updated.', data: profile });
  } catch (err) {
    next(err);
  }
}

export async function getContactsAdmin(req, res, next) {
  try {
    let contacts = [];
    if (mongoose.connection.readyState === 1) {
      contacts = await ContactSubmission.find().sort({ createdAt: -1 }).limit(50);
    }
    res.json({ success: true, data: contacts });
  } catch (err) {
    next(err);
  }
}

export async function deleteContactAdmin(req, res, next) {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(id)) {
      await ContactSubmission.findByIdAndDelete(id);
    }
    res.json({ success: true, message: 'Contact message deleted.' });
  } catch (err) {
    next(err);
  }
}

// -------------------------------------------------------------
// Module 11: Site Settings
// -------------------------------------------------------------
export async function getSettingsAdmin(req, res, next) {
  try {
    let profile = null;
    if (mongoose.connection.readyState === 1) {
      try {
        profile = await Profile.findOne();
      } catch (e) {}
    }
    res.json({ success: true, data: profile || verifiedProfile });
  } catch (err) {
    next(err);
  }
}

export async function updateSettingsAdmin(req, res, next) {
  try {
    let profile = null;
    const updateData = {
      ...req.body,
      footerCopyright: '© 2026 Mohammad Zaid Khan', // Preserved exact copyright
      email: AUTHORIZED_ADMIN_EMAIL
    };

    if (mongoose.connection.readyState === 1) {
      profile = await Profile.findOneAndUpdate(
        {},
        updateData,
        { upsert: true, new: true, runValidators: true }
      );
    } else {
      profile = { ...verifiedProfile, ...updateData };
    }

    res.json({ success: true, message: 'Site settings updated.', data: profile });
  } catch (err) {
    next(err);
  }
}

// -------------------------------------------------------------
// Module 12: Email Diagnostics & Independent Testing (Protected)
// -------------------------------------------------------------
export async function getEmailDiagnosticsAdmin(req, res, next) {
  try {
    const config = getEmailConfig();
    const verification = await emailService.verifyConnection();

    res.json({
      success: true,
      data: {
        configured: emailService.isConfigured(),
        host: config.host || null,
        port: config.port,
        user: config.user ? `${config.user.slice(0, 3)}***@${config.user.split('@')[1] || ''}` : null,
        from: config.from,
        to: config.to,
        secure: config.secure,
        verified: verification.verified,
        message: verification.message
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function sendTestEmailAdmin(req, res, next) {
  try {
    const config = getEmailConfig();
    if (!emailService.isConfigured()) {
      return res.status(400).json({
        success: false,
        message: 'Email service credentials are not configured in environment.'
      });
    }

    const testSubmission = {
      name: req.body?.name || 'Admin Test Probe',
      email: req.body?.email || config.to,
      company: 'Portfolio Security Suite',
      phone: '',
      purpose: 'General Inquiry',
      subject: 'Protected SMTP Diagnostics Test',
      message: 'This is an administrative test probe verifying real-time email delivery from the portfolio server.',
      createdAt: new Date().toISOString()
    };

    const result = await emailService.sendContactNotification(testSubmission);
    if (result.sent) {
      return res.json({
        success: true,
        message: `Test email successfully dispatched to ${config.to}`,
        messageId: result.messageId
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Email provider rejected test dispatch.',
        error: result.error || result.reason
      });
    }
  } catch (err) {
    next(err);
  }
}
