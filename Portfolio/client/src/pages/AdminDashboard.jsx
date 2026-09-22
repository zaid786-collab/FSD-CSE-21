import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Lock,
  LogOut,
  Plus,
  Save,
  Trash2,
  RefreshCw,
  AlertTriangle,
  ArrowLeft,
  Terminal,
  ShieldAlert,
  Briefcase,
  Award,
  Layers,
  GraduationCap,
  Trophy,
  Sliders,
  FolderGit2,
  ExternalLink,
  LayoutDashboard,
  User,
  Mail,
  CheckCircle2,
  X,
  Edit2,
  RotateCcw,
  Clock,
  Eye,
  Send,
  MessageSquare
} from 'lucide-react';
import { BrandMark } from '../components/common/BrandMark';

export function AdminDashboard() {
  const [sessionState, setSessionState] = useState('loading'); // 'loading' | 'unauthenticated' | 'authenticated' | 'forbidden'
  const [adminEmail, setAdminEmail] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  // Auth Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [authError, setAuthError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMsg, setForgotMsg] = useState(null);
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // CMS Datasets
  const [overviewStats, setOverviewStats] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [experienceList, setExperienceList] = useState([]);
  const [skillsList, setSkillsList] = useState([]);
  const [educationList, setEducationList] = useState([]);
  const [certificationsList, setCertificationsList] = useState([]);
  const [hackathonsList, setHackathonsList] = useState([]);
  const [achievementsList, setAchievementsList] = useState([]);
  const [profile, setProfile] = useState(null);
  const [availability, setAvailability] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [settings, setSettings] = useState(null);

  // Status & Modals
  const [saveStatus, setSaveStatus] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, type: '', id: null, title: '', permanent: false });
  const [editingItem, setEditingItem] = useState(null); // Used for Experience, Skills, Education, Certs, Hackathons, Achievements modals
  const [viewMessageModal, setViewMessageModal] = useState(null);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    setSessionState('loading');
    setAuthError(null);
    try {
      const res = await fetch('/api/admin/me', { credentials: 'include' });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.user) {
          setAdminEmail(json.user.email);
          setSessionState('authenticated');
          loadAllData();
          return;
        }
      } else if (res.status === 403) {
        setSessionState('forbidden');
        return;
      }
    } catch (e) {
      console.warn('Session check failed:', e.message);
    }
    setSessionState('unauthenticated');
  };

  const loadAllData = async () => {
    loadOverview();
    loadProjects();
    loadExperience();
    loadSkills();
    loadEducation();
    loadCertifications();
    loadHackathons();
    loadAchievements();
    loadProfile();
    loadAvailability();
    loadContacts();
    loadSettings();
  };

  const loadOverview = async () => {
    try {
      const res = await fetch('/api/admin/overview', { credentials: 'include' });
      if (res.ok) {
        const json = await res.json();
        if (json.success) setOverviewStats(json.data);
      }
    } catch (e) {}
  };

  const loadProjects = async () => {
    try {
      const res = await fetch('/api/admin/projects', { credentials: 'include' });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setProjects(json.data);
          if (json.data.length > 0 && !selectedProject) {
            setSelectedProject(json.data[0]);
          }
        }
      }
    } catch (e) {}
  };

  const loadExperience = async () => {
    try {
      const res = await fetch('/api/admin/experience', { credentials: 'include' });
      if (res.ok) {
        const json = await res.json();
        if (json.success) setExperienceList(json.data);
      }
    } catch (e) {}
  };

  const loadSkills = async () => {
    try {
      const res = await fetch('/api/admin/skills', { credentials: 'include' });
      if (res.ok) {
        const json = await res.json();
        if (json.success) setSkillsList(json.data);
      }
    } catch (e) {}
  };

  const loadEducation = async () => {
    try {
      const res = await fetch('/api/admin/education', { credentials: 'include' });
      if (res.ok) {
        const json = await res.json();
        if (json.success) setEducationList(json.data);
      }
    } catch (e) {}
  };

  const loadCertifications = async () => {
    try {
      const res = await fetch('/api/admin/certifications', { credentials: 'include' });
      if (res.ok) {
        const json = await res.json();
        if (json.success) setCertificationsList(json.data);
      }
    } catch (e) {}
  };

  const loadHackathons = async () => {
    try {
      const res = await fetch('/api/admin/hackathons', { credentials: 'include' });
      if (res.ok) {
        const json = await res.json();
        if (json.success) setHackathonsList(json.data);
      }
    } catch (e) {}
  };

  const loadAchievements = async () => {
    try {
      const res = await fetch('/api/admin/achievements', { credentials: 'include' });
      if (res.ok) {
        const json = await res.json();
        if (json.success) setAchievementsList(json.data);
      }
    } catch (e) {}
  };

  const loadProfile = async () => {
    try {
      const res = await fetch('/api/admin/profile', { credentials: 'include' });
      if (res.ok) {
        const json = await res.json();
        if (json.success) setProfile(json.data);
      }
    } catch (e) {}
  };

  const loadAvailability = async () => {
    try {
      const res = await fetch('/api/admin/availability', { credentials: 'include' });
      if (res.ok) {
        const json = await res.json();
        if (json.success) setAvailability(json.data);
      }
    } catch (e) {}
  };

  const loadContacts = async () => {
    try {
      const res = await fetch('/api/admin/contacts', { credentials: 'include' });
      if (res.ok) {
        const json = await res.json();
        if (json.success) setContacts(json.data);
      }
    } catch (e) {}
  };

  const loadSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings', { credentials: 'include' });
      if (res.ok) {
        const json = await res.json();
        if (json.success) setSettings(json.data);
      }
    } catch (e) {}
  };

  // Auth Handlers
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });

      const json = await res.json();

      if (res.status === 403) {
        setSessionState('forbidden');
        setIsSubmitting(false);
        return;
      }

      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Authentication failed. Please verify credentials.');
      }

      setAdminEmail(json.user.email);
      setSessionState('authenticated');
      loadAllData();
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleOAuth = async () => {
    setAuthError(null);
    setIsSubmitting(true);
    try {
      const simulatedEmail = window.prompt('Google OAuth Account Email:', loginEmail || 'zaidkhan24082006@gmail.com');
      if (!simulatedEmail) {
        setIsSubmitting(false);
        return;
      }

      const res = await fetch('/api/admin/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: simulatedEmail, googleId: 'google-oauth-flow' })
      });

      const json = await res.json();

      if (res.status === 403) {
        setSessionState('forbidden');
        setIsSubmitting(false);
        return;
      }

      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Google authentication failed.');
      }

      setAdminEmail(json.user.email);
      setSessionState('authenticated');
      loadAllData();
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' });
    } catch (e) {}
    setSessionState('unauthenticated');
    setSelectedProject(null);
    setAdminEmail('');
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotMsg(null);
    try {
      const res = await fetch('/api/admin/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: forgotEmail })
      });
      const json = await res.json();
      setForgotMsg(json.message || 'Instruction logged.');
    } catch (e) {
      setForgotMsg('Request failed.');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setForgotMsg(null);
    try {
      const res = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ token: resetToken, newPassword })
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Reset failed.');
      }
      setForgotMsg('Password reset successfully. You can now log in.');
      setTimeout(() => setShowForgotModal(false), 2000);
    } catch (e) {
      setForgotMsg(e.message);
    }
  };

  // Generic Save Helper with UI notifications
  const notifySuccess = (msg = 'Saved successfully') => {
    setSaveStatus(msg);
    setTimeout(() => setSaveStatus(null), 3000);
  };

  // Section 2: Projects
  const saveCurrentProject = async (projectToSave = selectedProject) => {
    if (!projectToSave) return;
    setSaveStatus('Saving project...');
    try {
      const res = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(projectToSave)
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || 'Failed to save.');
      notifySuccess('Project saved successfully');
      loadProjects();
    } catch (err) {
      setSaveStatus(`Error: ${err.message}`);
    }
  };

  const handleProjectDelete = async (id, permanent = false) => {
    try {
      if (permanent) {
        await fetch(`/api/admin/projects/${id}/permanent`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ confirmPermanent: true })
        });
      } else {
        await fetch(`/api/admin/projects/${id}`, { method: 'DELETE', credentials: 'include' });
      }
      setDeleteModal({ show: false, type: '', id: null, title: '', permanent: false });
      setSelectedProject(null);
      loadProjects();
      notifySuccess(permanent ? 'Project permanently deleted' : 'Project archived');
    } catch (e) {
      alert('Delete action failed.');
    }
  };

  const handleProjectRestore = async (id) => {
    try {
      await fetch(`/api/admin/projects/${id}/restore`, { method: 'PATCH', credentials: 'include' });
      loadProjects();
      notifySuccess('Project restored successfully');
    } catch (e) {
      alert('Restore failed.');
    }
  };

  const createNewProject = () => {
    const newProj = {
      name: 'New Project',
      slug: `project-${Date.now()}`,
      tagline: 'Technical summary of the project',
      description: 'Detailed description of functionality and architecture.',
      problemStatement: '',
      solution: '',
      features: ['Feature 1', 'Feature 2'],
      techStack: ['React', 'Node.js'],
      architecture: '',
      challenges: [],
      role: 'Project Leader',
      githubUrl: 'https://github.com/zaid786-collab',
      liveDemoUrl: null,
      order: projects.length + 1,
      status: 'draft'
    };
    setSelectedProject(newProj);
  };

  // Section 3: Experience Save
  const saveExperience = async (e) => {
    e.preventDefault();
    setSaveStatus('Saving experience...');
    try {
      const res = await fetch('/api/admin/experience', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(editingItem)
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message);
      setEditingItem(null);
      loadExperience();
      notifySuccess('Experience entry saved');
    } catch (err) {
      alert(`Save error: ${err.message}`);
    }
  };

  // Section 4: Skill Save
  const saveSkill = async (e) => {
    e.preventDefault();
    setSaveStatus('Saving skill...');
    try {
      const res = await fetch('/api/admin/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(editingItem)
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message);
      setEditingItem(null);
      loadSkills();
      notifySuccess('Skill saved');
    } catch (err) {
      alert(`Save error: ${err.message}`);
    }
  };

  // Section 5: Education Save
  const saveEducation = async (e) => {
    e.preventDefault();
    setSaveStatus('Saving education...');
    try {
      const res = await fetch('/api/admin/education', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(editingItem)
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message);
      setEditingItem(null);
      loadEducation();
      notifySuccess('Education saved');
    } catch (err) {
      alert(`Save error: ${err.message}`);
    }
  };

  // Section 6: Certification Save
  const saveCertification = async (e) => {
    e.preventDefault();
    setSaveStatus('Saving certification...');
    try {
      const res = await fetch('/api/admin/certifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(editingItem)
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message);
      setEditingItem(null);
      loadCertifications();
      notifySuccess('Certification saved');
    } catch (err) {
      alert(`Save error: ${err.message}`);
    }
  };

  // Section 7: Hackathon Save
  const saveHackathon = async (e) => {
    e.preventDefault();
    setSaveStatus('Saving hackathon...');
    try {
      const res = await fetch('/api/admin/hackathons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(editingItem)
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message);
      setEditingItem(null);
      loadHackathons();
      notifySuccess('Hackathon saved');
    } catch (err) {
      alert(`Save error: ${err.message}`);
    }
  };

  // Section 8: Achievement Save
  const saveAchievement = async (e) => {
    e.preventDefault();
    setSaveStatus('Saving achievement...');
    try {
      const res = await fetch('/api/admin/achievements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(editingItem)
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message);
      setEditingItem(null);
      loadAchievements();
      notifySuccess('Achievement saved');
    } catch (err) {
      alert(`Save error: ${err.message}`);
    }
  };

  // Generic Deletion
  const confirmDeleteAction = async () => {
    const { type, id } = deleteModal;
    try {
      if (type === 'projects') {
        await handleProjectDelete(id, deleteModal.permanent);
        return;
      }
      const res = await fetch(`/api/admin/${type}/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (res.ok) {
        notifySuccess('Item deleted successfully');
        if (type === 'experience') loadExperience();
        if (type === 'skills') loadSkills();
        if (type === 'education') loadEducation();
        if (type === 'certifications') loadCertifications();
        if (type === 'hackathons') loadHackathons();
        if (type === 'achievements') loadAchievements();
        if (type === 'contacts') loadContacts();
      }
    } catch (e) {
      alert('Delete failed.');
    } finally {
      setDeleteModal({ show: false, type: '', id: null, title: '', permanent: false });
    }
  };

  // Loading State
  if (sessionState === 'loading') {
    return (
      <div className="min-h-screen bg-[#0B0B0A] flex items-center justify-center text-[#9E9E96] font-mono text-xs">
        <RefreshCw size={14} className="animate-spin mr-2.5 text-[#D4AF37]" />
        Verifying administrative session...
      </div>
    );
  }

  // 403 Forbidden State
  if (sessionState === 'forbidden') {
    return (
      <div className="min-h-screen bg-[#0B0B0A] text-[#EDEDEB] flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded bg-[#11110F] border border-red-500/30 shadow-2xl text-center">
          <div className="inline-flex p-3 rounded-full bg-red-500/10 text-red-400 mb-4">
            <ShieldAlert size={32} />
          </div>
          <h1 className="text-lg font-serif font-bold text-[#EDEDEB] mb-2">403 Forbidden</h1>
          <p className="text-xs font-mono text-[#9E9E96] leading-relaxed mb-6">
            Access Denied: Only the verified owner (<span className="text-[#D4AF37]">zaidkhan24082006@gmail.com</span>) is authorized to access the Admin Control Panel.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded bg-[#171713] hover:bg-[#232320] text-xs font-mono text-[#EDEDEB] transition-colors"
            >
              Sign In with Another Account
            </button>
            <Link
              to="/"
              className="px-4 py-2 rounded bg-[#D4AF37] hover:bg-[#E5C158] text-xs font-mono font-medium text-[#0B0B0A] transition-colors"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Unauthenticated View
  if (sessionState === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-[#0B0B0A] text-[#EDEDEB] flex items-center justify-center p-4">
        <div className="max-w-sm w-full p-8 rounded bg-[#11110F] border border-[#232320] shadow-2xl relative">
          <div className="flex flex-col items-center text-center mb-8">
            <BrandMark size={36} showText={false} className="mb-3" />
            <h1 className="text-base font-serif font-bold text-[#EDEDEB] flex items-center gap-2">
              <Terminal size={15} className="text-[#D4AF37]" />
              Admin Control Panel
            </h1>
            <p className="text-xs font-mono text-[#5A5A52] mt-1">
              Restricted to authorized portfolio owner.
            </p>
          </div>

          {authError && (
            <div className="p-3 rounded bg-[#171713] border border-red-500/30 text-red-300 text-xs font-mono mb-6 flex items-start gap-2">
              <ShieldAlert size={15} className="shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-[#9E9E96] mb-1.5">Email Address</label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="admin@domain.com"
                className="w-full px-3.5 py-2.5 rounded bg-[#0B0B0A] border border-[#232320] text-[#EDEDEB] text-xs focus-visible:outline-none focus-visible:border-[#D4AF37] font-mono"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-mono text-[#9E9E96]">Password</label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[11px] font-mono text-[#D4AF37] hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 rounded bg-[#0B0B0A] border border-[#232320] text-[#EDEDEB] text-xs focus-visible:outline-none focus-visible:border-[#D4AF37]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded bg-[#EDEDEB] hover:bg-white text-[#0B0B0A] font-mono text-xs font-semibold tracking-wide transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Lock size={13} />
              <span>{isSubmitting ? 'Authenticating...' : 'Sign In'}</span>
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-[#1D1D1A]">
            <button
              type="button"
              onClick={handleGoogleOAuth}
              disabled={isSubmitting}
              className="w-full py-2.5 rounded bg-[#171713] hover:bg-[#1D1D18] border border-[#232320] text-[#EDEDEB] font-mono text-xs transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-[#1D1D1A] flex items-center justify-between text-[11px] font-mono text-[#5A5A52]">
            <Link to="/" className="hover:text-[#EDEDEB] transition-colors flex items-center gap-1">
              <ArrowLeft size={11} /> Return Home
            </Link>
            <span>Single-Admin Guard</span>
          </div>
        </div>

        {showForgotModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
            <div className="bg-[#11110F] border border-[#232320] p-6 rounded max-w-sm w-full shadow-2xl">
              <h3 className="text-sm font-bold text-[#EDEDEB] font-serif mb-2">Reset Administrative Password</h3>
              <p className="text-xs text-[#9E9E96] mb-4 font-mono">
                Submit registered administrator email to dispatch recovery token.
              </p>
              {forgotMsg && (
                <div className="p-2.5 rounded bg-[#171713] text-[#D4AF37] text-xs font-mono mb-4">
                  {forgotMsg}
                </div>
              )}
              <form onSubmit={handleForgotPassword} className="space-y-3 mb-4">
                <input
                  type="email"
                  required
                  placeholder="admin@domain.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-[#0B0B0A] border border-[#232320] text-xs text-[#EDEDEB] font-mono"
                />
                <button
                  type="submit"
                  className="w-full py-2 rounded bg-[#EDEDEB] text-[#0B0B0A] text-xs font-mono font-medium"
                >
                  Generate Token
                </button>
              </form>
              <div className="pt-3 border-t border-[#1D1D1A]">
                <span className="text-[11px] font-mono text-[#9E9E96] block mb-2">Have a token?</span>
                <form onSubmit={handleResetPassword} className="space-y-2">
                  <input
                    type="text"
                    required
                    placeholder="Reset token"
                    value={resetToken}
                    onChange={(e) => setResetToken(e.target.value)}
                    className="w-full px-3 py-1.5 rounded bg-[#0B0B0A] border border-[#232320] text-xs text-[#EDEDEB] font-mono"
                  />
                  <input
                    type="password"
                    required
                    placeholder="New password (min 8 chars)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-1.5 rounded bg-[#0B0B0A] border border-[#232320] text-xs text-[#EDEDEB]"
                  />
                  <button
                    type="submit"
                    className="w-full py-2 rounded bg-[#D4AF37] text-[#0B0B0A] text-xs font-mono font-medium"
                  >
                    Confirm Reset
                  </button>
                </form>
              </div>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="w-full mt-3 py-1.5 text-center text-xs font-mono text-[#5A5A52] hover:text-[#9E9E96]"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 11 CMS Navigation Sections
  const navSections = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: FolderGit2, count: projects.length },
    { id: 'experience', label: 'Experience', icon: Briefcase, count: experienceList.length },
    { id: 'skills', label: 'Skills', icon: Layers, count: skillsList.length },
    { id: 'education', label: 'Education', icon: GraduationCap, count: educationList.length },
    { id: 'certifications', label: 'Certifications', icon: Award, count: certificationsList.length },
    { id: 'hackathons', label: 'Hackathons', icon: Trophy, count: hackathonsList.length },
    { id: 'achievements', label: 'Achievements', icon: Award, count: achievementsList.length },
    { id: 'profile', label: 'Profile / About', icon: User },
    { id: 'availability', label: 'Availability & Inbox', icon: Mail, count: contacts.length },
    { id: 'settings', label: 'Site Settings', icon: Sliders }
  ];

  return (
    <div className="min-h-screen bg-[#0B0B0A] text-[#EDEDEB] flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-[#11110F] border-b border-[#232320] px-6 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <BrandMark size={24} showText={false} />
          <span className="font-mono text-xs font-bold text-[#EDEDEB] tracking-wider uppercase">
            Admin Control Panel
          </span>
          <span className="text-[#3A3A34]">|</span>
          <span className="text-[11px] font-mono text-[#D4AF37] truncate max-w-[200px]">
            {adminEmail}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {saveStatus && (
            <span className="text-xs font-mono text-[#D4AF37] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
              {saveStatus}
            </span>
          )}
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono text-[#9E9E96] hover:text-[#EDEDEB] transition-colors flex items-center gap-1"
          >
            <ExternalLink size={12} />
            <span>Public Site</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#171713] hover:bg-red-500/10 text-[#9E9E96] hover:text-red-400 text-xs font-mono transition-colors"
          >
            <LogOut size={12} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main CMS Layout */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-60 bg-[#0E0E0C] border-r border-[#232320] p-3 flex flex-col justify-between shrink-0 overflow-y-auto">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#5A5A52] block px-3 py-1.5">
              CMS Modules
            </span>

            {navSections.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs font-mono transition-colors ${
                    isActive
                      ? 'bg-[#171713] text-[#D4AF37] font-semibold border-l-2 border-[#D4AF37]'
                      : 'text-[#9E9E96] hover:text-[#EDEDEB] hover:bg-[#11110F]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={14} />
                    <span>{tab.label}</span>
                  </div>
                  {tab.count !== undefined && (
                    <span className="text-[10px] text-[#5A5A52] bg-[#11110F] px-1.5 py-0.5 rounded">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-[#1D1D1A] text-[11px] font-mono text-[#5A5A52] px-3">
            <div className="flex items-center gap-1.5 text-[#D4AF37] mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
              <span>Owner Mode Active</span>
            </div>
            <span>zaidkhan24082006@gmail.com</span>
          </div>
        </aside>

        {/* Content View Area */}
        <main className="flex-1 overflow-y-auto bg-[#0B0B0A] flex flex-col">
          {/* SECTION 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="p-6 md:p-8 space-y-6 max-w-5xl">
              <div>
                <h2 className="text-xl font-serif font-bold text-[#EDEDEB]">Portfolio CMS Overview</h2>
                <p className="text-xs font-mono text-[#5A5A52]">Live telemetry, database state, and inventory overview.</p>
              </div>

              {/* Metric Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Projects', count: projects.length, sub: `${projects.filter(p=>p.status==='published').length} published`, tab: 'projects' },
                  { label: 'Experience', count: experienceList.length, sub: 'Milestones', tab: 'experience' },
                  { label: 'Skills', count: skillsList.length, sub: 'Capabilities', tab: 'skills' },
                  { label: 'Certifications', count: certificationsList.length, sub: 'Credentials', tab: 'certifications' },
                  { label: 'Hackathons', count: hackathonsList.length, sub: 'Team Leader', tab: 'hackathons' },
                  { label: 'Achievements', count: achievementsList.length, sub: 'Awards', tab: 'achievements' },
                  { label: 'Education', count: educationList.length, sub: 'Academic', tab: 'education' },
                  { label: 'Messages', count: contacts.length, sub: 'Inquiries', tab: 'availability' },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => setActiveTab(item.tab)}
                    className="p-4 rounded bg-[#11110F] border border-[#232320] text-left hover:border-[#D4AF37]/50 transition-colors group"
                  >
                    <div className="text-[11px] font-mono text-[#9E9E96] uppercase">{item.label}</div>
                    <div className="text-2xl font-serif font-bold text-[#EDEDEB] group-hover:text-[#D4AF37] transition-colors mt-1">
                      {item.count}
                    </div>
                    <div className="text-[10px] font-mono text-[#5A5A52] mt-1">{item.sub}</div>
                  </button>
                ))}
              </div>

              {/* Quick Actions Bar */}
              <div className="p-5 rounded bg-[#11110F] border border-[#232320] flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs font-mono font-semibold text-[#EDEDEB]">Quick Actions</div>
                  <div className="text-[11px] font-mono text-[#5A5A52]">Create or modify portfolio data instantly.</div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => { setActiveTab('projects'); createNewProject(); }}
                    className="px-3 py-1.5 rounded bg-[#171713] hover:bg-[#D4AF37] hover:text-[#0B0B0A] text-[#EDEDEB] text-xs font-mono transition-colors flex items-center gap-1.5"
                  >
                    <Plus size={12} /> Project
                  </button>
                  <button
                    onClick={() => { setActiveTab('experience'); setEditingItem({ title: '', company: '', description: '', type: 'Freelance', period: 'Ongoing', order: experienceList.length + 1, status: 'published' }); }}
                    className="px-3 py-1.5 rounded bg-[#171713] hover:bg-[#D4AF37] hover:text-[#0B0B0A] text-[#EDEDEB] text-xs font-mono transition-colors flex items-center gap-1.5"
                  >
                    <Plus size={12} /> Experience
                  </button>
                  <button
                    onClick={() => { setActiveTab('skills'); setEditingItem({ name: '', category: 'Languages', order: skillsList.length + 1, status: 'published' }); }}
                    className="px-3 py-1.5 rounded bg-[#171713] hover:bg-[#D4AF37] hover:text-[#0B0B0A] text-[#EDEDEB] text-xs font-mono transition-colors flex items-center gap-1.5"
                  >
                    <Plus size={12} /> Skill
                  </button>
                  <button
                    onClick={() => { setActiveTab('certifications'); setEditingItem({ title: '', issuer: '', status: 'Completed', category: 'Technical', order: certificationsList.length + 1 }); }}
                    className="px-3 py-1.5 rounded bg-[#171713] hover:bg-[#D4AF37] hover:text-[#0B0B0A] text-[#EDEDEB] text-xs font-mono transition-colors flex items-center gap-1.5"
                  >
                    <Plus size={12} /> Cert
                  </button>
                </div>
              </div>

              {/* Recent Inquiries Inbox Widget */}
              <div className="rounded bg-[#11110F] border border-[#232320] p-5">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#1D1D1A]">
                  <div className="flex items-center gap-2">
                    <Mail size={15} className="text-[#D4AF37]" />
                    <span className="text-xs font-mono font-semibold text-[#EDEDEB] uppercase">
                      Recent Contact Messages ({contacts.length})
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveTab('availability')}
                    className="text-[11px] font-mono text-[#D4AF37] hover:underline"
                  >
                    View All Inquiries &rarr;
                  </button>
                </div>

                {contacts.length === 0 ? (
                  <div className="py-6 text-center text-xs font-mono text-[#5A5A52]">
                    No messages received yet.
                  </div>
                ) : (
                  <div className="divide-y divide-[#1D1D1A]">
                    {contacts.slice(0, 4).map((c) => (
                      <div key={c._id} className="py-3 flex items-center justify-between gap-4 text-xs font-mono">
                        <div>
                          <div className="font-semibold text-[#EDEDEB]">{c.name} &lt;{c.email}&gt;</div>
                          <div className="text-[11px] text-[#9E9E96] truncate max-w-md">{c.subject} — {c.message}</div>
                        </div>
                        <button
                          onClick={() => setViewMessageModal(c)}
                          className="px-2.5 py-1 rounded bg-[#171713] hover:bg-[#232320] text-[#D4AF37] text-[11px]"
                        >
                          View
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SECTION 2: PROJECTS */}
          {activeTab === 'projects' && (
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              {/* Sidebar list */}
              <div className="w-full md:w-72 bg-[#0B0B0A] border-r border-[#232320] p-4 flex flex-col overflow-y-auto shrink-0">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#9E9E96] font-semibold">
                    Projects ({projects.length})
                  </span>
                  <button
                    onClick={createNewProject}
                    className="p-1.5 rounded bg-[#171713] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0B0B0A] transition-colors"
                    title="Create New Project"
                  >
                    <Plus size={13} />
                  </button>
                </div>

                <div className="space-y-1.5">
                  {projects.map((p) => {
                    const isSelected = selectedProject?._id === p._id || selectedProject?.slug === p.slug;
                    return (
                      <button
                        key={p.slug}
                        onClick={() => setSelectedProject(p)}
                        className={`w-full text-left p-2.5 rounded text-xs font-mono transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#171713] border border-[#D4AF37]/50 text-[#EDEDEB]'
                            : 'bg-[#11110F]/60 hover:bg-[#11110F] text-[#9E9E96] border border-transparent'
                        }`}
                      >
                        <div className="truncate mr-2">
                          <div className="font-medium truncate text-[#EDEDEB]">{p.name}</div>
                          <div className="text-[10px] text-[#5A5A52] truncate">/{p.slug}</div>
                        </div>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] uppercase font-mono ${
                          p.status === 'published' ? 'text-[#D4AF37] bg-[#D4AF37]/10' : 'text-[#9E9E96] bg-[#171713]'
                        }`}>
                          {p.isDeleted ? 'archived' : p.status}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Editor */}
              <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-[#0B0B0A]">
                {selectedProject ? (
                  <div className="max-w-3xl space-y-5">
                    <div className="flex items-center justify-between pb-4 border-b border-[#232320]">
                      <div>
                        <h2 className="text-base font-serif font-bold text-[#EDEDEB]">
                          Editing: {selectedProject.name}
                        </h2>
                        <span className="text-xs font-mono text-[#5A5A52]">
                          Display Order: #{selectedProject.order || 1} &middot; Status: {selectedProject.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <select
                          value={selectedProject.status}
                          onChange={(e) => setSelectedProject({ ...selectedProject, status: e.target.value })}
                          className="px-3 py-1.5 rounded bg-[#11110F] border border-[#232320] text-xs font-mono text-[#EDEDEB] focus-visible:border-[#D4AF37]"
                        >
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                          <option value="archived">Archived</option>
                        </select>

                        <button
                          onClick={() => saveCurrentProject(selectedProject)}
                          className="flex items-center gap-1.5 px-4 py-1.5 rounded bg-[#EDEDEB] hover:bg-white text-[#0B0B0A] text-xs font-mono font-medium transition-colors"
                        >
                          <Save size={13} />
                          <span>Save</span>
                        </button>

                        {selectedProject._id && (
                          <button
                            onClick={() => setDeleteModal({ show: true, type: 'projects', id: selectedProject._id, title: selectedProject.name, permanent: false })}
                            className="p-1.5 rounded bg-[#171713] hover:bg-red-500/10 text-[#9E9E96] hover:text-red-400 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-[#9E9E96] mb-1">Project Name *</label>
                        <input
                          type="text"
                          value={selectedProject.name || ''}
                          onChange={(e) => setSelectedProject({ ...selectedProject, name: e.target.value })}
                          className="w-full px-3 py-2 rounded bg-[#11110F] border border-[#232320] text-xs text-[#EDEDEB] focus-visible:border-[#D4AF37]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-[#9E9E96] mb-1">URL Slug *</label>
                        <input
                          type="text"
                          value={selectedProject.slug || ''}
                          onChange={(e) => setSelectedProject({ ...selectedProject, slug: e.target.value })}
                          className="w-full px-3 py-2 rounded bg-[#11110F] border border-[#232320] text-xs text-[#EDEDEB] font-mono focus-visible:border-[#D4AF37]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-mono text-[#9E9E96] mb-1">Tagline *</label>
                        <input
                          type="text"
                          value={selectedProject.tagline || ''}
                          onChange={(e) => setSelectedProject({ ...selectedProject, tagline: e.target.value })}
                          className="w-full px-3 py-2 rounded bg-[#11110F] border border-[#232320] text-xs text-[#EDEDEB] focus-visible:border-[#D4AF37]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-[#9E9E96] mb-1">Role</label>
                        <input
                          type="text"
                          value={selectedProject.role || 'Project Leader'}
                          onChange={(e) => setSelectedProject({ ...selectedProject, role: e.target.value })}
                          className="w-full px-3 py-2 rounded bg-[#11110F] border border-[#232320] text-xs text-[#EDEDEB] font-mono focus-visible:border-[#D4AF37]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-[#9E9E96] mb-1">Description *</label>
                      <textarea
                        rows={3}
                        value={selectedProject.description || ''}
                        onChange={(e) => setSelectedProject({ ...selectedProject, description: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-[#11110F] border border-[#232320] text-xs text-[#EDEDEB] focus-visible:border-[#D4AF37]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-[#9E9E96] mb-1">GitHub URL *</label>
                        <input
                          type="url"
                          value={selectedProject.githubUrl || ''}
                          onChange={(e) => setSelectedProject({ ...selectedProject, githubUrl: e.target.value })}
                          className="w-full px-3 py-2 rounded bg-[#11110F] border border-[#232320] text-xs text-[#EDEDEB] font-mono focus-visible:border-[#D4AF37]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-[#9E9E96] mb-1">Live Demo URL (optional)</label>
                        <input
                          type="url"
                          value={selectedProject.liveDemoUrl || ''}
                          onChange={(e) => setSelectedProject({ ...selectedProject, liveDemoUrl: e.target.value })}
                          placeholder="https://..."
                          className="w-full px-3 py-2 rounded bg-[#11110F] border border-[#232320] text-xs text-[#EDEDEB] font-mono focus-visible:border-[#D4AF37]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-[#9E9E96] mb-1">Technologies (comma-separated)</label>
                      <input
                        type="text"
                        value={Array.isArray(selectedProject.techStack) ? selectedProject.techStack.join(', ') : ''}
                        onChange={(e) => setSelectedProject({ ...selectedProject, techStack: e.target.value.split(',').map(s=>s.trim()).filter(Boolean) })}
                        className="w-full px-3 py-2 rounded bg-[#11110F] border border-[#232320] text-xs text-[#EDEDEB] font-mono focus-visible:border-[#D4AF37]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-[#9E9E96] mb-1">Problem Statement</label>
                        <textarea
                          rows={2}
                          value={selectedProject.problemStatement || ''}
                          onChange={(e) => setSelectedProject({ ...selectedProject, problemStatement: e.target.value })}
                          className="w-full px-3 py-2 rounded bg-[#11110F] border border-[#232320] text-xs text-[#EDEDEB] focus-visible:border-[#D4AF37]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-[#9E9E96] mb-1">Solution & Architecture</label>
                        <textarea
                          rows={2}
                          value={selectedProject.solution || ''}
                          onChange={(e) => setSelectedProject({ ...selectedProject, solution: e.target.value })}
                          className="w-full px-3 py-2 rounded bg-[#11110F] border border-[#232320] text-xs text-[#EDEDEB] focus-visible:border-[#D4AF37]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-[#9E9E96] mb-1">Key Features (one per line)</label>
                      <textarea
                        rows={3}
                        value={Array.isArray(selectedProject.features) ? selectedProject.features.join('\n') : ''}
                        onChange={(e) => setSelectedProject({ ...selectedProject, features: e.target.value.split('\n').filter(Boolean) })}
                        className="w-full px-3 py-2 rounded bg-[#11110F] border border-[#232320] text-xs text-[#EDEDEB] font-mono focus-visible:border-[#D4AF37]"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 text-[#5A5A52]">
                    <Terminal size={28} className="mb-2 text-[#D4AF37]" />
                    <p className="text-xs font-mono">Select a project to inspect or edit.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SECTION 3: EXPERIENCE */}
          {activeTab === 'experience' && (
            <div className="p-6 md:p-8 max-w-4xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#232320]">
                <div>
                  <h2 className="text-base font-serif font-bold text-[#EDEDEB]">Experience Management</h2>
                  <p className="text-xs font-mono text-[#5A5A52]">Freelance, leadership, and consulting timeline records.</p>
                </div>
                <button
                  onClick={() => setEditingItem({
                    title: '',
                    role: '',
                    company: '',
                    organization: '',
                    type: 'Freelance',
                    startDate: '',
                    endDate: '',
                    currentlyWorking: true,
                    period: 'Ongoing',
                    location: 'Remote',
                    description: '',
                    technologies: [],
                    order: experienceList.length + 1,
                    status: 'published'
                  })}
                  className="px-3.5 py-1.5 rounded bg-[#EDEDEB] hover:bg-white text-[#0B0B0A] text-xs font-mono font-semibold transition-colors flex items-center gap-1.5"
                >
                  <Plus size={13} /> Add Experience
                </button>
              </div>

              {experienceList.length === 0 ? (
                <div className="p-12 text-center rounded bg-[#11110F] border border-[#232320] font-mono text-xs text-[#5A5A52]">
                  <Briefcase size={28} className="mx-auto mb-2 text-[#D4AF37]" />
                  <p className="mb-3">No experience entries yet.</p>
                  <button
                    onClick={() => setEditingItem({ title: '', company: '', description: '', type: 'Freelance', order: 1, status: 'published' })}
                    className="text-[#D4AF37] hover:underline"
                  >
                    + Add Experience
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {experienceList.map((item) => (
                    <div key={item._id || item.title} className="p-4 rounded bg-[#11110F] border border-[#232320] flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-[#EDEDEB]">{item.role || item.title}</span>
                          <span className="text-xs font-mono text-[#D4AF37]">@{item.organization || item.company}</span>
                          <span className="px-1.5 py-0.5 rounded text-[9px] uppercase font-mono text-[#9E9E96] bg-[#171713]">
                            {item.status}
                          </span>
                        </div>
                        <div className="text-xs font-mono text-[#5A5A52]">{item.period} &middot; {item.location} &middot; #{item.order || 1}</div>
                        <p className="text-xs text-[#9E9E96] pt-1 leading-relaxed">{item.description}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setEditingItem(item)}
                          className="p-1.5 rounded bg-[#171713] hover:bg-[#232320] text-[#9E9E96] hover:text-[#EDEDEB]"
                          title="Edit"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => setDeleteModal({ show: true, type: 'experience', id: item._id, title: item.title, permanent: false })}
                          className="p-1.5 rounded bg-[#171713] hover:bg-red-500/10 text-[#9E9E96] hover:text-red-400"
                          title="Delete"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SECTION 4: SKILLS */}
          {activeTab === 'skills' && (
            <div className="p-6 md:p-8 max-w-4xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#232320]">
                <div>
                  <h2 className="text-base font-serif font-bold text-[#EDEDEB]">Skills Ledger Management</h2>
                  <p className="text-xs font-mono text-[#5A5A52]">Languages, frameworks, databases, and tooling.</p>
                </div>
                <button
                  onClick={() => setEditingItem({ name: '', category: 'Languages', order: skillsList.length + 1, status: 'published' })}
                  className="px-3.5 py-1.5 rounded bg-[#EDEDEB] hover:bg-white text-[#0B0B0A] text-xs font-mono font-semibold transition-colors flex items-center gap-1.5"
                >
                  <Plus size={13} /> Add Skill
                </button>
              </div>

              {['Languages', 'Frontend', 'Backend', 'Database', 'Tools', 'Other'].map((cat) => {
                const catSkills = skillsList.filter(s => s.category === cat);
                return (
                  <div key={cat} className="p-4 rounded bg-[#11110F] border border-[#232320] space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-semibold text-[#D4AF37] uppercase">{cat} ({catSkills.length})</span>
                    </div>
                    {catSkills.length === 0 ? (
                      <p className="text-xs font-mono text-[#5A5A52] italic">No skills added in this category.</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {catSkills.map((s) => (
                          <div key={s._id || s.name} className="px-3 py-1.5 rounded bg-[#171713] border border-[#232320] text-xs font-mono flex items-center gap-2">
                            <span className="text-[#EDEDEB]">{s.name}</span>
                            <span className="text-[10px] text-[#5A5A52]">#{s.order}</span>
                            <button
                              onClick={() => setEditingItem(s)}
                              className="text-[#5A5A52] hover:text-[#EDEDEB]"
                              title="Edit"
                            >
                              <Edit2 size={11} />
                            </button>
                            <button
                              onClick={() => setDeleteModal({ show: true, type: 'skills', id: s._id, title: s.name, permanent: false })}
                              className="text-[#5A5A52] hover:text-red-400"
                              title="Delete"
                            >
                              <X size={11} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* SECTION 5: EDUCATION */}
          {activeTab === 'education' && (
            <div className="p-6 md:p-8 max-w-4xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#232320]">
                <div>
                  <h2 className="text-base font-serif font-bold text-[#EDEDEB]">Education Management</h2>
                  <p className="text-xs font-mono text-[#5A5A52]">Degrees, institutions, academic standing.</p>
                </div>
                <button
                  onClick={() => setEditingItem({ degree: 'B.Tech', fieldOfStudy: 'Computer Science & Engineering', institution: 'ABES Engineering College', startYear: '2025', endYear: '2029', cgpa: '9.1', description: '', order: educationList.length + 1, status: 'published' })}
                  className="px-3.5 py-1.5 rounded bg-[#EDEDEB] hover:bg-white text-[#0B0B0A] text-xs font-mono font-semibold transition-colors flex items-center gap-1.5"
                >
                  <Plus size={13} /> Add Education
                </button>
              </div>

              <div className="space-y-3">
                {educationList.map((edu) => (
                  <div key={edu._id || edu.degree} className="p-4 rounded bg-[#11110F] border border-[#232320] flex items-start justify-between">
                    <div>
                      <div className="text-sm font-semibold text-[#EDEDEB]">{edu.degree} — {edu.fieldOfStudy}</div>
                      <div className="text-xs font-mono text-[#D4AF37]">{edu.institution} &middot; {edu.period || `${edu.startYear}–${edu.endYear}`}</div>
                      <div className="text-xs font-mono text-[#9E9E96] mt-1">CGPA: {edu.cgpa}</div>
                      {edu.description && <p className="text-xs text-[#9E9E96] mt-1 leading-relaxed">{edu.description}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingItem(edu)}
                        className="p-1.5 rounded bg-[#171713] hover:bg-[#232320] text-[#9E9E96] hover:text-[#EDEDEB]"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => setDeleteModal({ show: true, type: 'education', id: edu._id, title: edu.degree, permanent: false })}
                        className="p-1.5 rounded bg-[#171713] hover:bg-red-500/10 text-[#9E9E96] hover:text-red-400"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 6: CERTIFICATIONS */}
          {activeTab === 'certifications' && (
            <div className="p-6 md:p-8 max-w-4xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#232320]">
                <div>
                  <h2 className="text-base font-serif font-bold text-[#EDEDEB]">Certifications & Accreditations</h2>
                  <p className="text-xs font-mono text-[#5A5A52]">Verified credentials from IBM, Microsoft, NIELIT, etc.</p>
                </div>
                <button
                  onClick={() => setEditingItem({ title: '', issuer: '', credentialUrl: '', status: 'Completed', category: 'Technical', order: certificationsList.length + 1 })}
                  className="px-3.5 py-1.5 rounded bg-[#EDEDEB] hover:bg-white text-[#0B0B0A] text-xs font-mono font-semibold transition-colors flex items-center gap-1.5"
                >
                  <Plus size={13} /> Add Certification
                </button>
              </div>

              <div className="space-y-3">
                {certificationsList.map((cert) => (
                  <div key={cert._id || cert.title} className="p-4 rounded bg-[#11110F] border border-[#232320] flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-[#EDEDEB] flex items-center gap-2">
                        <span>{cert.title}</span>
                        {cert.credentialUrl && (
                          <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="text-[#D4AF37]">
                            <ExternalLink size={11} />
                          </a>
                        )}
                      </div>
                      <div className="text-xs font-mono text-[#5A5A52]">{cert.issuer} &middot; {cert.category}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-[#D4AF37] px-2 py-0.5 rounded bg-[#D4AF37]/10">
                        {cert.status}
                      </span>
                      <button
                        onClick={() => setEditingItem(cert)}
                        className="p-1.5 rounded bg-[#171713] hover:bg-[#232320] text-[#9E9E96] hover:text-[#EDEDEB]"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => setDeleteModal({ show: true, type: 'certifications', id: cert._id, title: cert.title, permanent: false })}
                        className="p-1.5 rounded bg-[#171713] hover:bg-red-500/10 text-[#9E9E96] hover:text-red-400"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 7: HACKATHONS */}
          {activeTab === 'hackathons' && (
            <div className="p-6 md:p-8 max-w-4xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#232320]">
                <div>
                  <h2 className="text-base font-serif font-bold text-[#EDEDEB]">Hackathons Management</h2>
                  <p className="text-xs font-mono text-[#5A5A52]">National competitions: SIH, Build with Bharat, etc.</p>
                </div>
                <button
                  onClick={() => setEditingItem({ name: '', organizer: '', role: 'Team Leader', description: '', location: 'India', order: hackathonsList.length + 1, status: 'published' })}
                  className="px-3.5 py-1.5 rounded bg-[#EDEDEB] hover:bg-white text-[#0B0B0A] text-xs font-mono font-semibold transition-colors flex items-center gap-1.5"
                >
                  <Plus size={13} /> Add Hackathon
                </button>
              </div>

              <div className="space-y-3">
                {hackathonsList.map((h) => (
                  <div key={h._id || h.name} className="p-4 rounded bg-[#11110F] border border-[#232320] flex items-start justify-between">
                    <div>
                      <div className="text-sm font-semibold text-[#EDEDEB] flex items-center gap-2">
                        <span>{h.name}</span>
                        <span className="text-xs font-mono text-[#D4AF37]">({h.role})</span>
                      </div>
                      <p className="text-xs text-[#9E9E96] mt-1 leading-relaxed">{h.description}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setEditingItem(h)}
                        className="p-1.5 rounded bg-[#171713] hover:bg-[#232320] text-[#9E9E96] hover:text-[#EDEDEB]"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => setDeleteModal({ show: true, type: 'hackathons', id: h._id, title: h.name, permanent: false })}
                        className="p-1.5 rounded bg-[#171713] hover:bg-red-500/10 text-[#9E9E96] hover:text-red-400"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 8: ACHIEVEMENTS */}
          {activeTab === 'achievements' && (
            <div className="p-6 md:p-8 max-w-4xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#232320]">
                <div>
                  <h2 className="text-base font-serif font-bold text-[#EDEDEB]">Achievements & Recognitions</h2>
                  <p className="text-xs font-mono text-[#5A5A52]">Verified algorithmic contest records, academic awards.</p>
                </div>
                <button
                  onClick={() => setEditingItem({ title: '', description: '', category: 'Competitive Programming', date: '2025–2026', order: achievementsList.length + 1, status: 'published' })}
                  className="px-3.5 py-1.5 rounded bg-[#EDEDEB] hover:bg-white text-[#0B0B0A] text-xs font-mono font-semibold transition-colors flex items-center gap-1.5"
                >
                  <Plus size={13} /> Add Achievement
                </button>
              </div>

              {achievementsList.length === 0 ? (
                <div className="p-12 text-center rounded bg-[#11110F] border border-[#232320] font-mono text-xs text-[#5A5A52]">
                  <Trophy size={28} className="mx-auto mb-2 text-[#D4AF37]" />
                  <p className="mb-2">No achievements currently saved.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {achievementsList.map((ach) => (
                    <div key={ach._id || ach.title} className="p-4 rounded bg-[#11110F] border border-[#232320] flex items-start justify-between">
                      <div>
                        <div className="text-sm font-semibold text-[#EDEDEB]">{ach.title}</div>
                        <div className="text-xs font-mono text-[#D4AF37]">{ach.category} &middot; {ach.date}</div>
                        <p className="text-xs text-[#9E9E96] mt-1 leading-relaxed">{ach.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingItem(ach)}
                          className="p-1.5 rounded bg-[#171713] hover:bg-[#232320] text-[#9E9E96] hover:text-[#EDEDEB]"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => setDeleteModal({ show: true, type: 'achievements', id: ach._id, title: ach.title, permanent: false })}
                          className="p-1.5 rounded bg-[#171713] hover:bg-red-500/10 text-[#9E9E96] hover:text-red-400"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SECTION 9: PROFILE / ABOUT */}
          {activeTab === 'profile' && profile && (
            <div className="p-6 md:p-8 max-w-3xl space-y-5">
              <div className="pb-4 border-b border-[#232320]">
                <h2 className="text-base font-serif font-bold text-[#EDEDEB]">Personal Profile & About</h2>
                <p className="text-xs font-mono text-[#5A5A52]">Core identity parameters used throughout hero and about sections.</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-[#9E9E96] mb-1">Full Name</label>
                    <input
                      type="text"
                      value={profile.name || ''}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full px-3 py-2 rounded bg-[#11110F] border border-[#232320] text-xs text-[#EDEDEB] focus-visible:border-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-[#9E9E96] mb-1">Location</label>
                    <input
                      type="text"
                      value={profile.location || ''}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      className="w-full px-3 py-2 rounded bg-[#11110F] border border-[#232320] text-xs text-[#EDEDEB] focus-visible:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#9E9E96] mb-1">Professional Title</label>
                  <input
                    type="text"
                    value={profile.title || ''}
                    onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-[#11110F] border border-[#232320] text-xs text-[#EDEDEB] focus-visible:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#9E9E96] mb-1">Hero Supporting Copy (Headline)</label>
                  <textarea
                    rows={2}
                    value={profile.headline || ''}
                    onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-[#11110F] border border-[#232320] text-xs text-[#EDEDEB] focus-visible:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#9E9E96] mb-1">About Biography (Detailed)</label>
                  <textarea
                    rows={5}
                    value={profile.bio || ''}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-[#11110F] border border-[#232320] text-xs text-[#EDEDEB] focus-visible:border-[#D4AF37] leading-relaxed"
                  />
                </div>

                <button
                  onClick={async () => {
                    try {
                      const res = await fetch('/api/admin/profile', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        body: JSON.stringify(profile)
                      });
                      if (res.ok) notifySuccess('Profile updated successfully');
                    } catch (e) {
                      alert('Save failed.');
                    }
                  }}
                  className="px-5 py-2.5 rounded bg-[#EDEDEB] hover:bg-white text-[#0B0B0A] font-mono text-xs font-semibold transition-colors"
                >
                  Save Profile Changes
                </button>
              </div>
            </div>
          )}

          {/* SECTION 10: AVAILABILITY & INBOX */}
          {activeTab === 'availability' && availability && (
            <div className="p-6 md:p-8 max-w-4xl space-y-8">
              <div>
                <h2 className="text-base font-serif font-bold text-[#EDEDEB]">Availability & Inquiries Inbox</h2>
                <p className="text-xs font-mono text-[#5A5A52]">Control intake form state and view delivered client notes.</p>
              </div>

              {/* Form Settings */}
              <div className="p-5 rounded bg-[#11110F] border border-[#232320] space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-[#9E9E96] mb-1">Availability Status</label>
                    <input
                      type="text"
                      value={availability.availabilityStatus || ''}
                      onChange={(e) => setAvailability({ ...availability, availabilityStatus: e.target.value })}
                      className="w-full px-3 py-2 rounded bg-[#0B0B0A] border border-[#232320] text-xs text-[#EDEDEB] focus-visible:border-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-[#9E9E96] mb-1">Public Display Email</label>
                    <input
                      type="email"
                      value={availability.publicEmail || ''}
                      onChange={(e) => setAvailability({ ...availability, publicEmail: e.target.value })}
                      className="w-full px-3 py-2 rounded bg-[#0B0B0A] border border-[#232320] text-xs text-[#EDEDEB] focus-visible:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#9E9E96] mb-1">Availability Statement</label>
                  <textarea
                    rows={2}
                    value={availability.availabilityStatement || ''}
                    onChange={(e) => setAvailability({ ...availability, availabilityStatement: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-[#0B0B0A] border border-[#232320] text-xs text-[#EDEDEB] focus-visible:border-[#D4AF37]"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2.5 text-xs font-mono text-[#EDEDEB] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={availability.contactFormEnabled}
                      onChange={(e) => setAvailability({ ...availability, contactFormEnabled: e.target.checked })}
                      className="rounded border-[#232320] text-[#D4AF37] focus:ring-0"
                    />
                    <span>Contact Intake Form Enabled</span>
                  </label>

                  <button
                    onClick={async () => {
                      try {
                        const res = await fetch('/api/admin/availability', {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          credentials: 'include',
                          body: JSON.stringify(availability)
                        });
                        if (res.ok) notifySuccess('Availability settings saved');
                      } catch (e) {
                        alert('Save failed.');
                      }
                    }}
                    className="px-4 py-2 rounded bg-[#EDEDEB] text-[#0B0B0A] text-xs font-mono font-medium"
                  >
                    Save Availability
                  </button>
                </div>
              </div>

              {/* Messages Table */}
              <div className="rounded bg-[#11110F] border border-[#232320] p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#1D1D1A]">
                  <span className="text-xs font-mono font-semibold text-[#EDEDEB] uppercase">
                    Received Inquiries ({contacts.length})
                  </span>
                </div>

                {contacts.length === 0 ? (
                  <p className="text-xs font-mono text-[#5A5A52] py-4 text-center">No messages in inbox.</p>
                ) : (
                  <div className="space-y-2">
                    {contacts.map((c) => (
                      <div key={c._id} className="p-3.5 rounded bg-[#171713] border border-[#232320] flex items-start justify-between gap-4 text-xs font-mono">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-[#EDEDEB]">{c.name}</span>
                            <span className="text-[11px] text-[#D4AF37]">&lt;{c.email}&gt;</span>
                            <span className="text-[10px] text-[#5A5A52]">{c.purpose}</span>
                          </div>
                          <div className="text-[11px] text-[#EDEDEB] font-medium">{c.subject}</div>
                          <p className="text-xs text-[#9E9E96] line-clamp-2">{c.message}</p>
                          <div className="text-[10px] text-[#5A5A52]">Delivered: {new Date(c.createdAt).toLocaleString()}</div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => setViewMessageModal(c)}
                            className="px-2.5 py-1 rounded bg-[#11110F] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0B0B0A] text-xs"
                          >
                            Read
                          </button>
                          <button
                            onClick={() => setDeleteModal({ show: true, type: 'contacts', id: c._id, title: `Message from ${c.name}`, permanent: true })}
                            className="p-1.5 rounded bg-[#11110F] hover:bg-red-500/10 text-[#9E9E96] hover:text-red-400"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SECTION 11: SITE SETTINGS */}
          {activeTab === 'settings' && settings && (
            <div className="p-6 md:p-8 max-w-3xl space-y-5">
              <div className="pb-4 border-b border-[#232320]">
                <h2 className="text-base font-serif font-bold text-[#EDEDEB]">Global Site Settings</h2>
                <p className="text-xs font-mono text-[#5A5A52]">Meta tags, branding, resume path, and external profiles.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-[#9E9E96] mb-1">Site Title</label>
                  <input
                    type="text"
                    value={settings.siteTitle || ''}
                    onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-[#11110F] border border-[#232320] text-xs text-[#EDEDEB] focus-visible:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#9E9E96] mb-1">Meta Description</label>
                  <textarea
                    rows={2}
                    value={settings.metaDescription || ''}
                    onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-[#11110F] border border-[#232320] text-xs text-[#EDEDEB] focus-visible:border-[#D4AF37]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-[#9E9E96] mb-1">Footer Copyright</label>
                    <input
                      type="text"
                      disabled
                      value={settings.footerCopyright || '© 2026 Mohammad Zaid Khan'}
                      className="w-full px-3 py-2 rounded bg-[#171713] border border-[#232320] text-xs text-[#D4AF37] font-mono cursor-not-allowed opacity-80"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-[#9E9E96] mb-1">Resume Download Path</label>
                    <input
                      type="text"
                      value={settings.resumeUrl || '/Mohammad_Zaid_Khan_Resume.pdf'}
                      onChange={(e) => setSettings({ ...settings, resumeUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded bg-[#11110F] border border-[#232320] text-xs text-[#EDEDEB] font-mono focus-visible:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-[#1D1D1A] space-y-3">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#D4AF37] block">Verified External Links</span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                    <div>
                      <label className="block text-[#9E9E96] mb-1">GitHub</label>
                      <input
                        type="url"
                        value={settings.githubUrl || ''}
                        onChange={(e) => setSettings({ ...settings, githubUrl: e.target.value })}
                        className="w-full px-3 py-1.5 rounded bg-[#11110F] border border-[#232320] text-[#EDEDEB]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#9E9E96] mb-1">LinkedIn</label>
                      <input
                        type="url"
                        value={settings.linkedinUrl || ''}
                        onChange={(e) => setSettings({ ...settings, linkedinUrl: e.target.value })}
                        className="w-full px-3 py-1.5 rounded bg-[#11110F] border border-[#232320] text-[#EDEDEB]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#9E9E96] mb-1">LeetCode</label>
                      <input
                        type="url"
                        value={settings.leetcodeUrl || ''}
                        onChange={(e) => setSettings({ ...settings, leetcodeUrl: e.target.value })}
                        className="w-full px-3 py-1.5 rounded bg-[#11110F] border border-[#232320] text-[#EDEDEB]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#9E9E96] mb-1">CodeChef</label>
                      <input
                        type="url"
                        value={settings.codechefUrl || ''}
                        onChange={(e) => setSettings({ ...settings, codechefUrl: e.target.value })}
                        className="w-full px-3 py-1.5 rounded bg-[#11110F] border border-[#232320] text-[#EDEDEB]"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={async () => {
                    try {
                      const res = await fetch('/api/admin/settings', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        body: JSON.stringify(settings)
                      });
                      if (res.ok) notifySuccess('Site settings updated successfully');
                    } catch (e) {
                      alert('Save failed.');
                    }
                  }}
                  className="px-5 py-2.5 rounded bg-[#EDEDEB] hover:bg-white text-[#0B0B0A] font-mono text-xs font-semibold transition-colors mt-2"
                >
                  Save Settings
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL: ITEM EDIT (EXPERIENCE, SKILLS, EDUCATION, CERTS, HACKATHONS, ACHIEVEMENTS) */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="bg-[#11110F] border border-[#232320] p-6 rounded max-w-md w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#1D1D1A]">
              <h3 className="text-sm font-bold text-[#EDEDEB] font-serif uppercase tracking-wide">
                {editingItem._id ? 'Edit Entry' : 'Create New Entry'}
              </h3>
              <button onClick={() => setEditingItem(null)} className="text-[#9E9E96] hover:text-[#EDEDEB]">
                <X size={15} />
              </button>
            </div>

            {/* Form for Experience */}
            {activeTab === 'experience' && (
              <form onSubmit={saveExperience} className="space-y-3 font-mono text-xs">
                <div>
                  <label className="text-[#9E9E96] block mb-1">Role / Job Title *</label>
                  <input
                    type="text"
                    required
                    value={editingItem.role || editingItem.title || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, role: e.target.value, title: e.target.value })}
                    className="w-full px-3 py-1.5 rounded bg-[#0B0B0A] border border-[#232320] text-[#EDEDEB]"
                  />
                </div>
                <div>
                  <label className="text-[#9E9E96] block mb-1">Organization / Company *</label>
                  <input
                    type="text"
                    required
                    value={editingItem.organization || editingItem.company || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, organization: e.target.value, company: e.target.value })}
                    className="w-full px-3 py-1.5 rounded bg-[#0B0B0A] border border-[#232320] text-[#EDEDEB]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[#9E9E96] block mb-1">Employment Type</label>
                    <select
                      value={editingItem.type || 'Freelance'}
                      onChange={(e) => setEditingItem({ ...editingItem, type: e.target.value, employmentType: e.target.value })}
                      className="w-full px-3 py-1.5 rounded bg-[#0B0B0A] border border-[#232320] text-[#EDEDEB]"
                    >
                      <option value="Freelance">Freelance</option>
                      <option value="Internship">Internship</option>
                      <option value="Full-time">Full-time</option>
                      <option value="Leadership">Leadership</option>
                      <option value="Contract">Contract</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[#9E9E96] block mb-1">Location</label>
                    <input
                      type="text"
                      value={editingItem.location || 'Remote'}
                      onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })}
                      className="w-full px-3 py-1.5 rounded bg-[#0B0B0A] border border-[#232320] text-[#EDEDEB]"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[#9E9E96] block mb-1">Description *</label>
                  <textarea
                    rows={3}
                    required
                    value={editingItem.description || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                    className="w-full px-3 py-1.5 rounded bg-[#0B0B0A] border border-[#232320] text-[#EDEDEB]"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setEditingItem(null)} className="px-3 py-1.5 rounded bg-[#171713] text-[#9E9E96]">Cancel</button>
                  <button type="submit" className="px-4 py-1.5 rounded bg-[#EDEDEB] text-[#0B0B0A] font-semibold">Save Entry</button>
                </div>
              </form>
            )}

            {/* Form for Skills */}
            {activeTab === 'skills' && (
              <form onSubmit={saveSkill} className="space-y-3 font-mono text-xs">
                <div>
                  <label className="text-[#9E9E96] block mb-1">Skill Name *</label>
                  <input
                    type="text"
                    required
                    value={editingItem.name || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    className="w-full px-3 py-1.5 rounded bg-[#0B0B0A] border border-[#232320] text-[#EDEDEB]"
                  />
                </div>
                <div>
                  <label className="text-[#9E9E96] block mb-1">Category *</label>
                  <select
                    value={editingItem.category || 'Languages'}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    className="w-full px-3 py-1.5 rounded bg-[#0B0B0A] border border-[#232320] text-[#EDEDEB]"
                  >
                    <option value="Languages">Languages</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Database">Database</option>
                    <option value="Tools">Tools</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-[#9E9E96] block mb-1">Display Order</label>
                  <input
                    type="number"
                    value={editingItem.order || 0}
                    onChange={(e) => setEditingItem({ ...editingItem, order: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 rounded bg-[#0B0B0A] border border-[#232320] text-[#EDEDEB]"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setEditingItem(null)} className="px-3 py-1.5 rounded bg-[#171713] text-[#9E9E96]">Cancel</button>
                  <button type="submit" className="px-4 py-1.5 rounded bg-[#EDEDEB] text-[#0B0B0A] font-semibold">Save Skill</button>
                </div>
              </form>
            )}

            {/* Form for Education */}
            {activeTab === 'education' && (
              <form onSubmit={saveEducation} className="space-y-3 font-mono text-xs">
                <div>
                  <label className="text-[#9E9E96] block mb-1">Degree Title *</label>
                  <input
                    type="text"
                    required
                    value={editingItem.degree || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, degree: e.target.value })}
                    className="w-full px-3 py-1.5 rounded bg-[#0B0B0A] border border-[#232320] text-[#EDEDEB]"
                  />
                </div>
                <div>
                  <label className="text-[#9E9E96] block mb-1">Field of Study</label>
                  <input
                    type="text"
                    value={editingItem.fieldOfStudy || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, fieldOfStudy: e.target.value })}
                    className="w-full px-3 py-1.5 rounded bg-[#0B0B0A] border border-[#232320] text-[#EDEDEB]"
                  />
                </div>
                <div>
                  <label className="text-[#9E9E96] block mb-1">Institution *</label>
                  <input
                    type="text"
                    required
                    value={editingItem.institution || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, institution: e.target.value })}
                    className="w-full px-3 py-1.5 rounded bg-[#0B0B0A] border border-[#232320] text-[#EDEDEB]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[#9E9E96] block mb-1">Years (e.g. 2025–2029)</label>
                    <input
                      type="text"
                      value={editingItem.period || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, period: e.target.value })}
                      className="w-full px-3 py-1.5 rounded bg-[#0B0B0A] border border-[#232320] text-[#EDEDEB]"
                    />
                  </div>
                  <div>
                    <label className="text-[#9E9E96] block mb-1">CGPA / Grade</label>
                    <input
                      type="text"
                      value={editingItem.cgpa || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, cgpa: e.target.value })}
                      className="w-full px-3 py-1.5 rounded bg-[#0B0B0A] border border-[#232320] text-[#EDEDEB]"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[#9E9E96] block mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={editingItem.description || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                    className="w-full px-3 py-1.5 rounded bg-[#0B0B0A] border border-[#232320] text-[#EDEDEB]"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setEditingItem(null)} className="px-3 py-1.5 rounded bg-[#171713] text-[#9E9E96]">Cancel</button>
                  <button type="submit" className="px-4 py-1.5 rounded bg-[#EDEDEB] text-[#0B0B0A] font-semibold">Save Education</button>
                </div>
              </form>
            )}

            {/* Form for Certifications */}
            {activeTab === 'certifications' && (
              <form onSubmit={saveCertification} className="space-y-3 font-mono text-xs">
                <div>
                  <label className="text-[#9E9E96] block mb-1">Certification Name *</label>
                  <input
                    type="text"
                    required
                    value={editingItem.title || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                    className="w-full px-3 py-1.5 rounded bg-[#0B0B0A] border border-[#232320] text-[#EDEDEB]"
                  />
                </div>
                <div>
                  <label className="text-[#9E9E96] block mb-1">Issuing Organization *</label>
                  <input
                    type="text"
                    required
                    value={editingItem.issuer || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, issuer: e.target.value })}
                    className="w-full px-3 py-1.5 rounded bg-[#0B0B0A] border border-[#232320] text-[#EDEDEB]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[#9E9E96] block mb-1">Status</label>
                    <input
                      type="text"
                      value={editingItem.status || 'Completed'}
                      onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value })}
                      className="w-full px-3 py-1.5 rounded bg-[#0B0B0A] border border-[#232320] text-[#EDEDEB]"
                    />
                  </div>
                  <div>
                    <label className="text-[#9E9E96] block mb-1">Category</label>
                    <input
                      type="text"
                      value={editingItem.category || 'Technical'}
                      onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                      className="w-full px-3 py-1.5 rounded bg-[#0B0B0A] border border-[#232320] text-[#EDEDEB]"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[#9E9E96] block mb-1">Credential URL (optional)</label>
                  <input
                    type="url"
                    value={editingItem.credentialUrl || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, credentialUrl: e.target.value })}
                    className="w-full px-3 py-1.5 rounded bg-[#0B0B0A] border border-[#232320] text-[#EDEDEB]"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setEditingItem(null)} className="px-3 py-1.5 rounded bg-[#171713] text-[#9E9E96]">Cancel</button>
                  <button type="submit" className="px-4 py-1.5 rounded bg-[#EDEDEB] text-[#0B0B0A] font-semibold">Save Certification</button>
                </div>
              </form>
            )}

            {/* Form for Hackathons */}
            {activeTab === 'hackathons' && (
              <form onSubmit={saveHackathon} className="space-y-3 font-mono text-xs">
                <div>
                  <label className="text-[#9E9E96] block mb-1">Hackathon Name *</label>
                  <input
                    type="text"
                    required
                    value={editingItem.name || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    className="w-full px-3 py-1.5 rounded bg-[#0B0B0A] border border-[#232320] text-[#EDEDEB]"
                  />
                </div>
                <div>
                  <label className="text-[#9E9E96] block mb-1">Role *</label>
                  <input
                    type="text"
                    required
                    value={editingItem.role || 'Team Leader'}
                    onChange={(e) => setEditingItem({ ...editingItem, role: e.target.value })}
                    className="w-full px-3 py-1.5 rounded bg-[#0B0B0A] border border-[#232320] text-[#EDEDEB]"
                  />
                </div>
                <div>
                  <label className="text-[#9E9E96] block mb-1">Description *</label>
                  <textarea
                    rows={3}
                    required
                    value={editingItem.description || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                    className="w-full px-3 py-1.5 rounded bg-[#0B0B0A] border border-[#232320] text-[#EDEDEB]"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setEditingItem(null)} className="px-3 py-1.5 rounded bg-[#171713] text-[#9E9E96]">Cancel</button>
                  <button type="submit" className="px-4 py-1.5 rounded bg-[#EDEDEB] text-[#0B0B0A] font-semibold">Save Hackathon</button>
                </div>
              </form>
            )}

            {/* Form for Achievements */}
            {activeTab === 'achievements' && (
              <form onSubmit={saveAchievement} className="space-y-3 font-mono text-xs">
                <div>
                  <label className="text-[#9E9E96] block mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={editingItem.title || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                    className="w-full px-3 py-1.5 rounded bg-[#0B0B0A] border border-[#232320] text-[#EDEDEB]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[#9E9E96] block mb-1">Category</label>
                    <select
                      value={editingItem.category || 'Competitive Programming'}
                      onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                      className="w-full px-3 py-1.5 rounded bg-[#0B0B0A] border border-[#232320] text-[#EDEDEB]"
                    >
                      <option value="Competitive Programming">Competitive Programming</option>
                      <option value="Academic">Academic</option>
                      <option value="Hackathon">Hackathon</option>
                      <option value="Technical">Technical</option>
                      <option value="Leadership">Leadership</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[#9E9E96] block mb-1">Date</label>
                    <input
                      type="text"
                      value={editingItem.date || '2025–2026'}
                      onChange={(e) => setEditingItem({ ...editingItem, date: e.target.value })}
                      className="w-full px-3 py-1.5 rounded bg-[#0B0B0A] border border-[#232320] text-[#EDEDEB]"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[#9E9E96] block mb-1">Description *</label>
                  <textarea
                    rows={2}
                    required
                    value={editingItem.description || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                    className="w-full px-3 py-1.5 rounded bg-[#0B0B0A] border border-[#232320] text-[#EDEDEB]"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setEditingItem(null)} className="px-3 py-1.5 rounded bg-[#171713] text-[#9E9E96]">Cancel</button>
                  <button type="submit" className="px-4 py-1.5 rounded bg-[#EDEDEB] text-[#0B0B0A] font-semibold">Save Achievement</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* VIEW MESSAGE MODAL */}
      {viewMessageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="bg-[#11110F] border border-[#232320] p-6 rounded max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1D1D1A]">
              <div>
                <h3 className="text-sm font-bold text-[#EDEDEB] font-serif">Inquiry from {viewMessageModal.name}</h3>
                <span className="text-[11px] font-mono text-[#D4AF37]">{viewMessageModal.email}</span>
              </div>
              <button onClick={() => setViewMessageModal(null)} className="text-[#9E9E96] hover:text-[#EDEDEB]">
                <X size={15} />
              </button>
            </div>
            <div className="space-y-2 text-xs font-mono text-[#9E9E96]">
              <div><span className="text-[#5A5A52]">Subject:</span> <span className="text-[#EDEDEB]">{viewMessageModal.subject}</span></div>
              <div><span className="text-[#5A5A52]">Purpose:</span> <span className="text-[#EDEDEB]">{viewMessageModal.purpose}</span></div>
              {viewMessageModal.company && <div><span className="text-[#5A5A52]">Company:</span> <span className="text-[#EDEDEB]">{viewMessageModal.company}</span></div>}
              {viewMessageModal.phone && <div><span className="text-[#5A5A52]">Phone:</span> <span className="text-[#EDEDEB]">{viewMessageModal.phone}</span></div>}
              <div><span className="text-[#5A5A52]">Received:</span> <span>{new Date(viewMessageModal.createdAt).toLocaleString()}</span></div>
              <div className="pt-2 border-t border-[#1D1D1A]">
                <span className="text-[#5A5A52] block mb-1">Message Content:</span>
                <p className="p-3 rounded bg-[#0B0B0A] text-[#EDEDEB] leading-relaxed whitespace-pre-wrap">{viewMessageModal.message}</p>
              </div>
            </div>
            <button
              onClick={() => setViewMessageModal(null)}
              className="w-full py-2 rounded bg-[#171713] text-[#EDEDEB] text-xs font-mono"
            >
              Close Message
            </button>
          </div>
        </div>
      )}

      {/* CONFIRMATION DELETION MODAL */}
      {deleteModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="bg-[#11110F] border border-[#232320] p-6 rounded max-w-sm w-full shadow-2xl">
            <h3 className="text-sm font-bold text-[#EDEDEB] font-serif mb-2 flex items-center gap-2">
              <AlertTriangle size={15} className="text-red-400" />
              Confirm Deletion
            </h3>
            <p className="text-xs text-[#9E9E96] leading-relaxed mb-6 font-sans">
              Are you sure you want to delete <span className="text-[#EDEDEB] font-semibold">{deleteModal.title}</span>? This action cannot be undone.
            </p>

            <div className="space-y-2">
              <button
                onClick={confirmDeleteAction}
                className="w-full py-2 rounded bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-medium transition-colors"
              >
                Confirm Delete
              </button>
              <button
                onClick={() => setDeleteModal({ show: false, type: '', id: null, title: '', permanent: false })}
                className="w-full py-2 rounded bg-[#171713] hover:bg-[#232320] text-[#9E9E96] text-xs font-mono transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
