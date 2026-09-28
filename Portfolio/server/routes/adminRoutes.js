import express from 'express';
import {
  // Auth
  login,
  googleLogin,
  logout,
  checkAuth,
  forgotPassword,
  resetPassword,
  // Overview
  getOverviewStats,
  // Projects
  getAllProjectsAdmin,
  saveProject,
  updateProject,
  softDeleteProject,
  restoreProject,
  permanentDeleteProject,
  // Experience
  getExperienceAdmin,
  saveExperienceAdmin,
  deleteExperienceAdmin,
  // Skills
  getSkillsAdmin,
  saveSkillAdmin,
  deleteSkillAdmin,
  updateSkillsBatchAdmin,
  // Education
  getEducationAdmin,
  saveEducationAdmin,
  deleteEducationAdmin,
  // Certifications
  getCertificationsAdmin,
  saveCertificationAdmin,
  deleteCertificationAdmin,
  // Hackathons
  getHackathonsAdmin,
  saveHackathonAdmin,
  deleteHackathonAdmin,
  // Achievements
  getAchievementsAdmin,
  saveAchievementAdmin,
  deleteAchievementAdmin,
  // Profile / About
  getProfileAdmin,
  updateProfileAdmin,
  // Availability & Contacts
  getAvailabilityAdmin,
  updateAvailabilityAdmin,
  getContactsAdmin,
  deleteContactAdmin,
  // Site Settings
  getSettingsAdmin,
  updateSettingsAdmin,
  // Email Diagnostics & Testing
  getEmailDiagnosticsAdmin,
  sendTestEmailAdmin
} from '../controllers/adminController.js';
import { requireAdmin } from '../middleware/authMiddleware.js';
import { authLimiter } from '../middleware/securityMiddleware.js';

const router = express.Router();

// -------------------------------------------------------------
// Authentication Routes (Owner-Only)
// -------------------------------------------------------------
router.post('/login', authLimiter, login);
router.post('/google-login', authLimiter, googleLogin);
router.post('/logout', logout);
router.get('/me', requireAdmin, checkAuth);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password', authLimiter, resetPassword);

// -------------------------------------------------------------
// Module 1: Dashboard Overview
// -------------------------------------------------------------
router.get('/overview', requireAdmin, getOverviewStats);

// -------------------------------------------------------------
// Module 2: Projects Management
// -------------------------------------------------------------
router.get('/projects', requireAdmin, getAllProjectsAdmin);
router.post('/projects', requireAdmin, saveProject);
router.put('/projects/:id', requireAdmin, updateProject);
router.delete('/projects/:id', requireAdmin, softDeleteProject);
router.patch('/projects/:id/restore', requireAdmin, restoreProject);
router.delete('/projects/:id/permanent', requireAdmin, permanentDeleteProject);

// -------------------------------------------------------------
// Module 3: Experience Management
// -------------------------------------------------------------
router.get('/experience', requireAdmin, getExperienceAdmin);
router.post('/experience', requireAdmin, saveExperienceAdmin);
router.put('/experience/:id', requireAdmin, saveExperienceAdmin);
router.delete('/experience/:id', requireAdmin, deleteExperienceAdmin);

// -------------------------------------------------------------
// Module 4: Skills Management
// -------------------------------------------------------------
router.get('/skills', requireAdmin, getSkillsAdmin);
router.post('/skills', requireAdmin, saveSkillAdmin);
router.put('/skills/:id', requireAdmin, saveSkillAdmin);
router.delete('/skills/:id', requireAdmin, deleteSkillAdmin);
router.put('/skills', requireAdmin, updateSkillsBatchAdmin);

// -------------------------------------------------------------
// Module 5: Education Management
// -------------------------------------------------------------
router.get('/education', requireAdmin, getEducationAdmin);
router.post('/education', requireAdmin, saveEducationAdmin);
router.put('/education/:id', requireAdmin, saveEducationAdmin);
router.delete('/education/:id', requireAdmin, deleteEducationAdmin);

// -------------------------------------------------------------
// Module 6: Certifications Management
// -------------------------------------------------------------
router.get('/certifications', requireAdmin, getCertificationsAdmin);
router.post('/certifications', requireAdmin, saveCertificationAdmin);
router.put('/certifications/:id', requireAdmin, saveCertificationAdmin);
router.delete('/certifications/:id', requireAdmin, deleteCertificationAdmin);

// -------------------------------------------------------------
// Module 7: Hackathons Management
// -------------------------------------------------------------
router.get('/hackathons', requireAdmin, getHackathonsAdmin);
router.post('/hackathons', requireAdmin, saveHackathonAdmin);
router.put('/hackathons/:id', requireAdmin, saveHackathonAdmin);
router.delete('/hackathons/:id', requireAdmin, deleteHackathonAdmin);

// -------------------------------------------------------------
// Module 8: Achievements Management
// -------------------------------------------------------------
router.get('/achievements', requireAdmin, getAchievementsAdmin);
router.post('/achievements', requireAdmin, saveAchievementAdmin);
router.put('/achievements/:id', requireAdmin, saveAchievementAdmin);
router.delete('/achievements/:id', requireAdmin, deleteAchievementAdmin);

// -------------------------------------------------------------
// Module 9: Profile / About Management
// -------------------------------------------------------------
router.get('/profile', requireAdmin, getProfileAdmin);
router.put('/profile', requireAdmin, updateProfileAdmin);

// -------------------------------------------------------------
// Module 10: Availability / Contact Settings & Inquiries
// -------------------------------------------------------------
router.get('/availability', requireAdmin, getAvailabilityAdmin);
router.put('/availability', requireAdmin, updateAvailabilityAdmin);
router.get('/contacts', requireAdmin, getContactsAdmin);
router.delete('/contacts/:id', requireAdmin, deleteContactAdmin);

// -------------------------------------------------------------
// Module 11: Site Settings
// -------------------------------------------------------------
router.get('/settings', requireAdmin, getSettingsAdmin);
router.put('/settings', requireAdmin, updateSettingsAdmin);

// -------------------------------------------------------------
// Module 12: Email Diagnostics & Testing (Protected)
// -------------------------------------------------------------
router.get('/email/diagnostics', requireAdmin, getEmailDiagnosticsAdmin);
router.post('/email/test', requireAdmin, sendTestEmailAdmin);

export default router;
