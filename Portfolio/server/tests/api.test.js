import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import app, { connectDatabase } from '../server.js';
import { JWT_SECRET } from '../middleware/authMiddleware.js';
import { ContactSubmission } from '../models/ContactSubmission.js';
import { emailService } from '../services/emailService.js';

let server;
let baseUrl;

before(async () => {
  await connectDatabase();
  return new Promise((resolve) => {
    server = app.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://localhost:${port}`;
      resolve();
    });
  });
});

after(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
});

describe('Portfolio API & Owner Authorization Test Suite', () => {
  test('GET /api/health should return status ok', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.status, 'ok');
  });

  test('GET /api/portfolio should return verified profile and projects', async () => {
    const res = await fetch(`${baseUrl}/api/portfolio`);
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.data.profile.name, 'Mohammad Zaid Khan');
    assert.strictEqual(json.data.projects.length, 5);
  });

  test('Case 4: Direct admin API call without authentication should return 401', async () => {
    const endpoints = [
      '/api/admin/me',
      '/api/admin/projects',
      '/api/admin/experience',
      '/api/admin/certifications',
      '/api/admin/hackathons',
      '/api/admin/education',
      '/api/admin/skills',
      '/api/admin/settings'
    ];

    for (const ep of endpoints) {
      const res = await fetch(`${baseUrl}${ep}`);
      assert.strictEqual(res.status, 401, `Expected 401 for unauthenticated ${ep}`);
    }
  });

  test('Case 2: Login or Google-login with unauthorized email should return 403 Forbidden', async () => {
    // Password attempt with different email
    const res1 = await fetch(`${baseUrl}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'other_user@domain.com',
        password: 'password123'
      })
    });
    assert.strictEqual(res1.status, 403);
    const json1 = await res1.json();
    assert.match(json1.message, /Access Denied/);

    // Google OAuth attempt with different email
    const res2 = await fetch(`${baseUrl}/api/admin/google-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'attacker_google_account@gmail.com',
        googleId: '12345678'
      })
    });
    assert.strictEqual(res2.status, 403);
    const json2 = await res2.json();
    assert.match(json2.message, /Access Denied/);
  });

  test('Case 5: Token signed for non-owner email should return 403 Forbidden on protected API', async () => {
    const nonOwnerToken = jwt.sign(
      { id: '123', email: 'other_person@gmail.com', role: 'admin' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    const res = await fetch(`${baseUrl}/api/admin/projects`, {
      headers: {
        Authorization: `Bearer ${nonOwnerToken}`
      }
    });
    assert.strictEqual(res.status, 403);
  });

  let ownerCookie = '';
  let ownerBearerToken = '';

  test('Case 3: Owner login with correct credentials should succeed and return cookie', async () => {
    const res = await fetch(`${baseUrl}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'zaidkhan24082006@gmail.com',
        password: process.env.ADMIN_INITIAL_PASSWORD || 'ZaidKhanAdmin2026!'
      })
    });

    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.user.email, 'zaidkhan24082006@gmail.com');
    assert.ok(json.token, 'Expected JWT token in response body');
    ownerBearerToken = json.token;

    // Extract cookie
    const setCookie = res.headers.get('set-cookie');
    assert.ok(setCookie, 'Expected Set-Cookie header');
    assert.match(setCookie, /mzk_token=/);
    ownerCookie = setCookie.split(';')[0];
  });

  test('Case 6: Owner session persistence via cookie across requests', async () => {
    const res = await fetch(`${baseUrl}/api/admin/me`, {
      headers: {
        Cookie: ownerCookie
      }
    });

    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.user.email, 'zaidkhan24082006@gmail.com');
  });

  test('Case 6b: Owner session persistence via Bearer token without cookies', async () => {
    const res = await fetch(`${baseUrl}/api/admin/me`, {
      headers: {
        Authorization: `Bearer ${ownerBearerToken}`
      }
    });

    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.user.email, 'zaidkhan24082006@gmail.com');
  });

  test('Owner has access to all admin CMS endpoints', async () => {
    const endpoints = [
      '/api/admin/overview',
      '/api/admin/projects',
      '/api/admin/experience',
      '/api/admin/certifications',
      '/api/admin/hackathons',
      '/api/admin/achievements',
      '/api/admin/education',
      '/api/admin/skills',
      '/api/admin/profile',
      '/api/admin/availability',
      '/api/admin/contacts',
      '/api/admin/settings'
    ];

    for (const ep of endpoints) {
      const res = await fetch(`${baseUrl}${ep}`, {
        headers: { Cookie: ownerCookie }
      });
      assert.strictEqual(res.status, 200, `Expected 200 for authenticated ${ep}`);
      const json = await res.json();
      assert.strictEqual(json.success, true);
    }
  });

  test('CMS CRUD & Public Portfolio Integration: Experience', async () => {
    // 1. Create a new test experience
    const createRes = await fetch(`${baseUrl}/api/admin/experience`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: ownerCookie
      },
      body: JSON.stringify({
        organization: 'Verified Tech Labs',
        role: 'Senior Systems Analyst',
        employmentType: 'Full-time',
        location: 'Remote',
        startDate: '2024-01',
        currentlyWorking: true,
        description: 'Architecting distributed platforms and cloud systems.',
        responsibilities: ['Engineered microservices', 'Optimized query throughput'],
        technologies: ['Node.js', 'MongoDB', 'Docker'],
        status: 'published',
        order: 0
      })
    });
    assert.strictEqual(createRes.status, 200);
    const createJson = await createRes.json();
    assert.strictEqual(createJson.success, true);
    const expId = createJson.data._id;
    assert.ok(expId);

    // 2. Check that it is immediately reflected on the public portfolio
    const publicRes1 = await fetch(`${baseUrl}/api/portfolio`);
    const publicJson1 = await publicRes1.json();
    const foundInPublic = publicJson1.data.experience.find(e => (e._id && e._id.toString() === expId.toString()) || e.organization === 'Verified Tech Labs');
    assert.ok(foundInPublic, 'New published experience should appear in public portfolio');
    assert.strictEqual(foundInPublic.role, 'Senior Systems Analyst');

    // 3. Update / Archive it
    const updateRes = await fetch(`${baseUrl}/api/admin/experience/${expId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: ownerCookie
      },
      body: JSON.stringify({
        ...foundInPublic,
        role: 'Lead Systems Architect',
        status: 'archived'
      })
    });
    assert.strictEqual(updateRes.status, 200);

    // 4. Check that archived experience is hidden from the public portfolio
    const publicRes2 = await fetch(`${baseUrl}/api/portfolio`);
    const publicJson2 = await publicRes2.json();
    const foundInPublicArchived = publicJson2.data.experience.find(e => e._id && e._id.toString() === expId.toString());
    assert.strictEqual(foundInPublicArchived, undefined, 'Archived experience must NOT appear in public portfolio');

    // 5. Permanent delete
    const deleteRes = await fetch(`${baseUrl}/api/admin/experience/${expId}?permanent=true`, {
      method: 'DELETE',
      headers: { Cookie: ownerCookie }
    });
    assert.strictEqual(deleteRes.status, 200);
  });

  test('CMS CRUD & Public Portfolio Integration: Skills', async () => {
    // 1. Create a new skill
    const createRes = await fetch(`${baseUrl}/api/admin/skills`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: ownerCookie
      },
      body: JSON.stringify({
        name: 'RustLangTest',
        category: 'Languages',
        status: 'published',
        order: 99
      })
    });
    assert.strictEqual(createRes.status, 200);
    const createJson = await createRes.json();
    const skillId = createJson.data._id;

    // 2. Check public portfolio
    const publicRes1 = await fetch(`${baseUrl}/api/portfolio`);
    const publicJson1 = await publicRes1.json();
    const foundSkill = publicJson1.data.skills.find(s => s.name === 'RustLangTest');
    assert.ok(foundSkill, 'New published skill should appear in public portfolio');

    // 3. Clean up skill
    const deleteRes = await fetch(`${baseUrl}/api/admin/skills/${skillId}`, {
      method: 'DELETE',
      headers: { Cookie: ownerCookie }
    });
    assert.strictEqual(deleteRes.status, 200);
  });

  test('CMS CRUD & Public Portfolio Integration: Profile & Site Settings', async () => {
    // 1. Update profile
    const profileRes = await fetch(`${baseUrl}/api/admin/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: ownerCookie
      },
      body: JSON.stringify({
        title: 'Software Engineer | Full-Stack Developer | Competitive Programmer (Updated)',
        location: 'India'
      })
    });
    assert.strictEqual(profileRes.status, 200);

    // 2. Check public portfolio
    const publicRes = await fetch(`${baseUrl}/api/portfolio`);
    const publicJson = await publicRes.json();
    assert.strictEqual(publicJson.data.profile.title, 'Software Engineer | Full-Stack Developer | Competitive Programmer (Updated)');

    // 3. Restore title
    await fetch(`${baseUrl}/api/admin/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: ownerCookie
      },
      body: JSON.stringify({
        title: 'Software Engineer | Full-Stack Developer | Competitive Programmer'
      })
    });
  });

  test('CMS CRUD & Public Portfolio Integration: Education & Certifications', async () => {
    // Education
    const eduRes = await fetch(`${baseUrl}/api/admin/education`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: ownerCookie
      },
      body: JSON.stringify({
        degree: 'M.Tech',
        fieldOfStudy: 'Computer Science',
        institution: 'Indian Institute of Technology',
        startYear: '2029',
        endYear: '2031',
        cgpa: '9.5',
        status: 'published'
      })
    });
    assert.strictEqual(eduRes.status, 200);
    const eduJson = await eduRes.json();
    const eduId = eduJson.data._id;

    // Verify in public portfolio
    const pubRes1 = await fetch(`${baseUrl}/api/portfolio`);
    const pubJson1 = await pubRes1.json();
    const foundEdu = pubJson1.data.education.find(e => e._id && e._id.toString() === eduId.toString());
    assert.ok(foundEdu, 'Education entry should appear in public portfolio');

    // Clean up
    await fetch(`${baseUrl}/api/admin/education/${eduId}?permanent=true`, {
      method: 'DELETE',
      headers: { Cookie: ownerCookie }
    });

    // Certifications
    const certRes = await fetch(`${baseUrl}/api/admin/certifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: ownerCookie
      },
      body: JSON.stringify({
        name: 'AWS Certified Solutions Architect',
        issuer: 'Amazon Web Services',
        status: 'published'
      })
    });
    assert.strictEqual(certRes.status, 200);
    const certJson = await certRes.json();
    const certId = certJson.data._id;

    // Clean up
    await fetch(`${baseUrl}/api/admin/certifications/${certId}?permanent=true`, {
      method: 'DELETE',
      headers: { Cookie: ownerCookie }
    });
  });

  test('CMS CRUD & Public Portfolio Integration: Hackathons & Achievements', async () => {
    // Hackathon
    const hackRes = await fetch(`${baseUrl}/api/admin/hackathons`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: ownerCookie
      },
      body: JSON.stringify({
        name: 'Global AI Hackathon 2026',
        organizer: 'Tech Alliance',
        role: 'Team Lead',
        projectName: 'Autonomous Agent Platform',
        status: 'published'
      })
    });
    assert.strictEqual(hackRes.status, 200);
    const hackJson = await hackRes.json();
    const hackId = hackJson.data._id;

    // Clean up
    await fetch(`${baseUrl}/api/admin/hackathons/${hackId}?permanent=true`, {
      method: 'DELETE',
      headers: { Cookie: ownerCookie }
    });

    // Achievement
    const achRes = await fetch(`${baseUrl}/api/admin/achievements`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: ownerCookie
      },
      body: JSON.stringify({
        title: 'National Coding Champion',
        description: 'Placed 1st among 10,000+ competitors',
        category: 'Competitive Programming',
        status: 'published'
      })
    });
    assert.strictEqual(achRes.status, 200);
    const achJson = await achRes.json();
    const achId = achJson.data._id;

    // Clean up
    await fetch(`${baseUrl}/api/admin/achievements/${achId}?permanent=true`, {
      method: 'DELETE',
      headers: { Cookie: ownerCookie }
    });
  });

  test('CMS Availability & Contact Settings', async () => {
    const availRes = await fetch(`${baseUrl}/api/admin/availability`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: ownerCookie
      },
      body: JSON.stringify({
        availabilityStatus: 'Available for high-impact roles',
        contactFormEnabled: true
      })
    });
    assert.strictEqual(availRes.status, 200);

    // Verify public portfolio shows updated availability
    const pubRes = await fetch(`${baseUrl}/api/portfolio`);
    const pubJson = await pubRes.json();
    assert.strictEqual(pubJson.data.profile.availabilityStatus, 'Available for high-impact roles');
  });

  test('Case 8: Email Diagnostics (Admin Protected) should be secure and provide diagnostics', async () => {
    // Unauthenticated call should be 401
    const unauthRes = await fetch(`${baseUrl}/api/admin/email/diagnostics`);
    assert.strictEqual(unauthRes.status, 401);

    // Authenticated call with owner cookie
    const authRes = await fetch(`${baseUrl}/api/admin/email/diagnostics`, {
      headers: { Cookie: ownerCookie }
    });
    assert.strictEqual(authRes.status, 200);
    const authJson = await authRes.json();
    assert.strictEqual(authJson.success, true);
    assert.ok(authJson.data.to, 'Should return destination recipient');
    assert.strictEqual(authJson.data.password, undefined, 'Never expose email password');
  });

  test('Case 9: Public Contact Form - Input validation rejects incomplete data', async () => {
    const invalidSubmissions = [
      { name: '', email: 'valid@example.com', subject: 'Sub', message: 'Msg' },
      { name: 'Name', email: 'invalid-email', subject: 'Sub', message: 'Msg' },
      { name: 'Name', email: 'valid@example.com', subject: '', message: 'Msg' },
      { name: 'Name', email: 'valid@example.com', subject: 'Sub', message: '' }
    ];

    for (const sub of invalidSubmissions) {
      const res = await fetch(`${baseUrl}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sub)
      });
      assert.strictEqual(res.status, 400);
      const json = await res.json();
      assert.strictEqual(json.success, false);
    }
  });

  test('Case 10: Public Contact Form - Honeypot silently blocks spam bots', async () => {
    const botPayload = {
      name: 'SpamBot 3000',
      email: 'bot@spamnetwork.com',
      subject: 'Buy crypto now',
      message: 'Exclusive investment scheme',
      website_hp: 'http://spam-link.biz' // Honeypot filled!
    };

    const res = await fetch(`${baseUrl}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(botPayload)
    });

    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);

    // Confirm that the spam bot submission was NOT saved to MongoDB
    const foundInDb = await ContactSubmission.findOne({ email: 'bot@spamnetwork.com' });
    assert.strictEqual(foundInDb, null, 'Honeypot-flagged submission must not be saved to DB');
  });

  test('Case 11: Public Contact Form - Valid submission stores in MongoDB and handles email accurately', async () => {
    const testId = `test_${Date.now()}`;
    const payload = {
      name: 'Integration Test Submitter',
      email: 'tester@enterprise.dev',
      company: 'Enterprise Test Corp',
      phone: '+1-202-555-0143',
      purpose: 'Full-time Opportunity',
      subject: `Testing Delivery Pipeline ${testId}`,
      message: 'This is an end-to-end integration test submission verifying MongoDB storage and delivery reporting.',
      website_hp: ''
    };

    const res = await fetch(`${baseUrl}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.ok(json.message);
    assert.strictEqual(json.delivery.database, true, 'Database save must be confirmed');

    // Verify document in MongoDB
    const doc = await ContactSubmission.findOne({ email: 'tester@enterprise.dev', subject: payload.subject });
    assert.ok(doc, 'Submission document must exist in MongoDB');
    assert.strictEqual(doc.name, 'Integration Test Submitter');
    assert.strictEqual(doc.company, 'Enterprise Test Corp');
    assert.strictEqual(doc.phone, '+1-202-555-0143');
    assert.strictEqual(doc.purpose, 'Full-time Opportunity');
    assert.strictEqual(doc.message, payload.message);
    assert.ok(doc.createdAt);
    assert.strictEqual(typeof doc.emailNotificationSent, 'boolean');
    assert.strictEqual(typeof doc.autoReplySent, 'boolean');

    // Clean up test document
    await ContactSubmission.deleteOne({ _id: doc._id });
  });

  test('Case 12: Public Contact Form - Full email dispatch updates MongoDB flags to true', async () => {
    // Attach a mock transporter
    const originalTransporter = emailService.transporter;
    const originalIsConfigured = emailService.isConfigured;
    const originalInit = emailService.initTransporter;

    emailService.isConfigured = () => true;
    emailService.initTransporter = () => {};
    emailService.transporter = {
      sendMail: async () => ({ messageId: 'mock-msg-' + Date.now() })
    };

    try {
      const payload = {
        name: 'Email Delivery Submitter',
        email: 'mocksuccess@enterprise.dev',
        company: 'Cloud Corp',
        phone: '+1-202-555-9999',
        purpose: 'Project Collaboration',
        subject: 'Mock Email Dispatch Verification',
        message: 'Verifying that emailNotificationSent and autoReplySent are true when SMTP dispatches successfully.',
        website_hp: ''
      };

      const res = await fetch(`${baseUrl}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      assert.strictEqual(res.status, 200);
      const json = await res.json();
      assert.strictEqual(json.success, true);
      assert.strictEqual(json.delivery.database, true);
      assert.strictEqual(json.delivery.email, true);
      assert.match(json.message, /confirmation has been delivered/);

      // Verify in MongoDB
      const doc = await ContactSubmission.findOne({ email: 'mocksuccess@enterprise.dev' });
      assert.ok(doc, 'Document should exist in database');
      assert.strictEqual(doc.emailNotificationSent, true, 'emailNotificationSent must be true');
      assert.strictEqual(doc.autoReplySent, true, 'autoReplySent must be true');

      await ContactSubmission.deleteOne({ _id: doc._id });
    } finally {
      emailService.transporter = originalTransporter;
      emailService.isConfigured = originalIsConfigured;
      emailService.initTransporter = originalInit;
    }
  });

  test('Case 7: Owner logs out and admin APIs become inaccessible', async () => {
    const logoutRes = await fetch(`${baseUrl}/api/admin/logout`, {
      method: 'POST',
      headers: { Cookie: ownerCookie }
    });
    assert.strictEqual(logoutRes.status, 200);

    const logoutCookie = logoutRes.headers.get('set-cookie');
    assert.ok(logoutCookie);
    assert.match(logoutCookie, /mzk_token=;/);

    // Call without token should now be rejected with 401
    const meRes = await fetch(`${baseUrl}/api/admin/me`);
    assert.strictEqual(meRes.status, 401);
  });
});
