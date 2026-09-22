import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

import { Profile } from '../models/Profile.js';
import { Project } from '../models/Project.js';
import { Skill } from '../models/Skill.js';
import { Experience } from '../models/Experience.js';
import { Education } from '../models/Education.js';
import { Certification } from '../models/Certification.js';
import { Hackathon } from '../models/Hackathon.js';
import { Achievement } from '../models/Achievement.js';
import { AdminUser, AUTHORIZED_ADMIN_EMAIL } from '../models/AdminUser.js';

export const verifiedProfile = {
  name: 'Mohammad Zaid Khan',
  title: 'Software Engineer | Full-Stack Developer | Competitive Programmer',
  headline: 'Building scalable software, solving problems through DSA/CP, and exploring AI/GenAI.',
  location: 'Noida, India',
  email: 'zaidkhan24082006@gmail.com',
  bio: 'Computer Science & Engineering student at ABES Engineering College with strong fundamentals in full-stack architecture, backend systems, and competitive programming. Committed to building clean, scalable software, mastering algorithmic problem solving, and exploring modern AI/GenAI technologies.',
  socialLinks: [
    { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/mohammad-zaid-khan-a2927a370/', label: 'LinkedIn', order: 1 },
    { platform: 'GitHub', url: 'https://github.com/zaid786-collab', label: 'GitHub', order: 2 },
    { platform: 'LeetCode', url: 'https://leetcode.com/u/MOHAMMADZAIDKHAN7/', label: 'LeetCode', order: 3 },
    { platform: 'CodeChef', url: 'https://www.codechef.com/users/zaid_khan07', label: 'CodeChef', order: 4 },
    { platform: 'Codeforces', url: 'https://codeforces.com/profile/MohammadZaidKhan', label: 'Codeforces', order: 5 }
  ],
  status: 'published'
};

export const verifiedSkills = [
  // Languages
  { name: 'C', category: 'Languages', order: 1 },
  { name: 'C++', category: 'Languages', order: 2 },
  { name: 'Java', category: 'Languages', order: 3 },
  { name: 'JavaScript', category: 'Languages', order: 4 },
  { name: 'Python', category: 'Languages', order: 5 },
  // Frontend
  { name: 'HTML', category: 'Frontend', order: 6 },
  { name: 'CSS', category: 'Frontend', order: 7 },
  { name: 'React', category: 'Frontend', order: 8 },
  // Backend
  { name: 'Node.js', category: 'Backend', order: 9 },
  { name: 'Express.js', category: 'Backend', order: 10 },
  { name: 'Flask', category: 'Backend', order: 11 },
  // Database
  { name: 'MongoDB', category: 'Database', order: 12 },
  { name: 'SQL', category: 'Database', order: 13 },
  // Tools
  { name: 'Git', category: 'Tools', order: 14 },
  { name: 'GitHub', category: 'Tools', order: 15 },
  { name: 'Docker', category: 'Tools', order: 16 },
  // Other
  { name: 'AI / GenAI', category: 'Other', order: 17 }
];

export const verifiedProjects = [
  {
    name: 'Intervista AI',
    slug: 'intervista-ai',
    tagline: 'Next-Generation AI-Powered Technical Interview & Career Assessment Platform',
    description: 'Enterprise-grade AI technical interview simulation and career readiness platform pairing Large Language Models with multimodal audio/video analysis, speech recognition, and an interactive coding sandbox.',
    problemStatement: 'Technical job candidates often struggle to bridge the gap between static self-study and high-stakes engineering interviews, lacking realistic real-time feedback on communication, coding efficiency, and problem solving.',
    solution: 'Intervista AI simulates realistic technical interviews using adaptive LLM interviewers, real-time speech-to-text, live code execution against test suites, and automated multimodal evaluation.',
    features: [
      'Adaptive AI interviewer dynamically generating context-aware follow-up questions',
      'In-browser coding sandbox with multi-language execution and test case validation',
      'Speech-to-text synchronization and multimodal communication analysis',
      'AI-powered resume parser and ATS compatibility gauge',
      'Predictive analytics, skill mastery radar charts, and downloadable PDF assessment reports'
    ],
    techStack: ['React 18', 'FastAPI', 'Python 3.10+', 'Vite', 'Large Language Models', 'Tailwind CSS'],
    architecture: 'FastAPI asynchronous backend with Python AI pipelines and LLM orchestration, paired with a high-performance React frontend and dynamic execution sandbox.',
    challenges: [
      'Synchronizing live audio/speech stream with real-time text analysis without latency spikes',
      'Safely executing candidate code in sandboxed environments with strict timeout handling'
    ],
    role: 'Project Leader',
    githubUrl: 'https://github.com/zaid786-collab/Intervista-AI.git',
    liveDemoUrl: null,
    order: 1,
    status: 'published'
  },
  {
    name: 'Crime Lens',
    slug: 'crime-lens',
    tagline: 'Cybernetic Crime Investigation & Intelligence Analytics Platform',
    description: 'Next-generation intelligence analytics platform engineered for digital forensics and investigative teams to unify fragmented data—wiretaps, financial transactions, and dark web signals—into actionable threat intelligence.',
    problemStatement: 'Law enforcement and investigative teams face fragmented data silos, making it difficult to trace complex criminal syndicate command hierarchies and suspicious financial flows.',
    solution: 'CrimeLens bridges disparate data sources into a unified tactical dashboard featuring an interactive Network Nexus graph, multi-source chronological timelines, and Entity 360 dossiers.',
    features: [
      'Tactical live telemetry dashboard with threat matrix and active case tracking',
      'Interactive Network Nexus graph for multi-hop entity and financial flow analysis',
      'Chronological multi-source event timeline with anomaly spike detection',
      'Entity 360 Dossier unifying suspect aliases and biometric intelligence',
      'Cryptographic evidence sealing ensuring chain of custody integrity',
      'Neural Investigation Copilot for natural language intelligence queries'
    ],
    techStack: ['React 19', 'Vite', 'JavaScript', 'Network Graph Visualization', 'CSS3'],
    architecture: 'Reactive modular frontend with graph-based visualization layers and AI-assisted query resolution engine.',
    challenges: [
      'Visualizing complex multi-hop network graphs with high node density while preserving interactive 60fps rendering',
      'Modeling multi-source chronological telemetry with automated anomaly detection'
    ],
    role: 'Project Leader',
    githubUrl: 'https://github.com/mayankkotuli099/Crime-Lens.git',
    liveDemoUrl: null,
    order: 2,
    status: 'published'
  },
  {
    name: 'Smart Stocks',
    slug: 'smart-stocks',
    tagline: 'AI-Powered Investment Intelligence Platform',
    description: 'Investment intelligence platform analyzing stock market data to deliver price predictions, market trends, risk metrics, and company financial health insights.',
    problemStatement: 'Retail investors struggle to process overwhelming market noise and extract actionable, risk-adjusted insights from raw financial data.',
    solution: 'Smart Stocks streamlines investment decision-making by combining algorithmic trend analysis, risk scoring, and AI-driven stock evaluation into a clean interface.',
    features: [
      'Real-time market telemetry and price prediction indicators',
      'Algorithmic market trend and risk analysis matrix',
      'Company health indicators and fundamental metrics overview',
      'AI-powered stock screening and watchlists'
    ],
    techStack: ['React', 'Vite', 'Lucide React', 'Tailwind CSS', 'PostCSS'],
    architecture: 'Component-driven frontend optimized for fast data rendering, real-time market updates, and clean modular UI.',
    challenges: [
      'Managing high-frequency stock price data streams and maintaining responsive state updates across multi-chart dashboards'
    ],
    role: 'Project Leader',
    githubUrl: 'https://github.com/zaid786-collab/Smart-Stocks.git',
    liveDemoUrl: null,
    order: 3,
    status: 'published'
  },
  {
    name: 'Salesforce Clone',
    slug: 'salesforce-clone',
    tagline: 'Enterprise CRM Landing Experience & Interactive Platform Clone',
    description: 'High-fidelity enterprise CRM web portal recreating Salesforce’s core presentation architecture, responsive design system, product catalog, and lead capture workflows.',
    problemStatement: 'Mastering enterprise-level web standards, complex component hierarchies, and responsive business application UI from the ground up.',
    solution: 'Constructed an end-to-end responsive CRM experience featuring enterprise header navigation, dynamic product showcase matrices, customer success stories, and lead intake forms.',
    features: [
      'Multi-tiered enterprise navigation with mobile-responsive drawer',
      'Interactive product feature comparison matrices and service showcases',
      'Structured lead capture and inquiry intake workflow',
      'Pixel-perfect responsive layout across desktop, tablet, and mobile'
    ],
    techStack: ['HTML5', 'CSS3', 'JavaScript'],
    architecture: 'Semantic modular web architecture utilizing modern CSS layout grids, flexbox, and vanilla JavaScript DOM interactions.',
    challenges: [
      'Faithfully replicating intricate enterprise responsive layouts and multi-level navigation states without heavyweight frameworks'
    ],
    role: 'Project Leader',
    githubUrl: 'https://github.com/zaid786-collab/Salesforce-Clone.git',
    liveDemoUrl: null,
    order: 4,
    status: 'published'
  },
  {
    name: 'Developer Portfolio Rebuild',
    slug: 'developer-portfolio',
    tagline: 'Production-Grade Software Engineer Showcase & Content Management System',
    description: 'Custom-built, production-ready personal developer portfolio featuring modern React frontend architecture, Express API backend, MongoDB persistence, protected admin CMS, and live profile integrations.',
    problemStatement: 'Standard portfolio templates are generic, lack technical depth, and fail to demonstrate real full-stack engineering, security, and data architecture competencies.',
    solution: 'Engineered an authentic full-stack system with dark-mode developer aesthetics, CSRF/rate-limited APIs, dynamic GitHub and CP stats caching, ATS-optimized resume distribution, and an authorized administrative management portal.',
    features: [
      'Dark-mode technical developer UI with blue/violet gradient accents and responsive mobile navigation',
      'Dedicated case-study detail pages for all major software engineering projects',
      'Dynamic GitHub API and competitive programming statistics with resilient caching',
      'End-to-end contact system with MongoDB persistence, honeypot protection, and email notifications',
      'Protected admin portal (/mzk-control) with draft/publish workflows, autosave, and safe soft deletion',
      'Strict accessibility compliance with WCAG standards and prefers-reduced-motion support'
    ],
    techStack: ['React 19', 'Vite', 'Tailwind CSS', 'Framer Motion', 'Node.js', 'Express', 'MongoDB', 'Mongoose'],
    architecture: 'Decoupled full-stack architecture: React SPA client with Express REST API, MongoDB Atlas database layer, and environment-isolated security policies.',
    challenges: [
      'Implementing robust CSRF, rate-limiting, and admin lock mechanisms while maintaining smooth client performance and zero-dependency PDF generation'
    ],
    role: 'Project Leader',
    githubUrl: 'https://github.com/zaid786-collab/My-Portfolio.git',
    liveDemoUrl: null,
    order: 5,
    status: 'published'
  }
];

export const verifiedExperience = [
  {
    title: 'Microsoft Dynamics 365 Analyst',
    company: 'IT Solutions',
    type: 'Freelance',
    period: 'Ongoing',
    location: 'Remote',
    description: 'Providing technical consulting and analysis on Microsoft Dynamics 365 implementations, workflow automations, and enterprise data integrations.',
    technologies: ['Microsoft Dynamics 365', 'Data Analysis', 'Enterprise Solutions'],
    order: 1,
    status: 'published'
  }
];

export const verifiedHackathons = [
  {
    name: 'Smart India Hackathon (SIH)',
    role: 'Team Leader',
    description: 'Led team in designing and architecting technical solutions addressing nationwide real-world challenges, coordinating system architecture, sprint workflows, and technical presentations.',
    technologies: ['System Design', 'Full-Stack Development', 'Problem Solving', 'Team Leadership'],
    order: 1
  },
  {
    name: 'Build with Bharat',
    role: 'Team Leader',
    description: 'Directed engineering team in building scalable digital products, overseeing rapid prototyping, software engineering implementation, and hackathon product delivery.',
    technologies: ['Rapid Prototyping', 'Software Engineering', 'Team Leadership'],
    order: 2
  }
];

export const verifiedEducation = [
  {
    degree: 'B.Tech — Computer Science & Engineering',
    institution: 'ABES Engineering College',
    period: '2025–2029',
    cgpa: '9.1',
    order: 1
  }
];

export const verifiedCertifications = [
  {
    title: 'NIELIT O Level',
    issuer: 'National Institute of Electronics & Information Technology (NIELIT)',
    status: 'In Progress',
    details: '3 modules completed, 1 remaining',
    category: 'Foundation',
    order: 1
  },
  {
    title: 'Generative AI: Introduction to AI',
    issuer: 'IBM / Leading Education Providers',
    status: 'Completed',
    details: 'Foundations of Artificial Intelligence and deep learning architectures',
    category: 'AI / GenAI',
    order: 2
  },
  {
    title: 'Generative AI: Introduction & Applications',
    issuer: 'IBM / Leading Education Providers',
    status: 'Completed',
    details: 'Application architectures and generative workflow pipelines',
    category: 'AI / GenAI',
    order: 3
  },
  {
    title: 'Prompt Engineering Basics',
    issuer: 'IBM / Leading Education Providers',
    status: 'Completed',
    details: 'Contextual prompt construction, system instructions, and LLM steering',
    category: 'AI / GenAI',
    order: 4
  },
  {
    title: 'Python for Data Science, AI & Development',
    issuer: 'IBM / Leading Education Providers',
    status: 'Completed',
    details: 'Python data science stack, APIs, and data modeling',
    category: 'Data & AI',
    order: 5
  },
  {
    title: 'Microsoft Certified Data Analyst',
    issuer: 'Microsoft',
    status: 'Completed',
    details: 'Data preparation, modeling, visualization, and analytical reporting',
    category: 'Data & Cloud',
    order: 6
  },
  {
    title: 'Claude AI',
    issuer: 'PW Skills',
    status: 'Completed',
    details: 'Advanced LLM interaction and agentic workflow foundations',
    category: 'AI / GenAI',
    order: 7
  }
];

export const verifiedAchievements = [
  {
    title: 'LeetCode 100+ Algorithmic Challenges Solved',
    description: 'Consistent problem solving across Data Structures, Dynamic Programming, and Graph Theory.',
    date: '2025–2026',
    category: 'Competitive Programming',
    url: 'https://leetcode.com/u/MOHAMMADZAIDKHAN7/',
    order: 1,
    status: 'published'
  },
  {
    title: 'CodeChef Active Division Competitor',
    description: 'Regular participation in algorithmic rated rounds solving time-constrained challenges.',
    date: '2025–2026',
    category: 'Competitive Programming',
    url: 'https://www.codechef.com/users/zaid_khan07',
    order: 2,
    status: 'published'
  },
  {
    title: 'Academic Excellence — 9.1 CGPA in B.Tech CSE',
    description: 'Maintained strong academic standing in Computer Science fundamentals at ABES Engineering College.',
    date: '2025–2026',
    category: 'Academic',
    url: '',
    order: 3,
    status: 'published'
  }
];

export async function seedDatabase() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/portfolio';
  console.log(`Connecting to MongoDB at ${mongoUri.replace(/:([^:@]{4})[^:@]*@/, ':****@')}...`);

  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB successfully.');

    // 1. Profile (upsert)
    await Profile.findOneAndUpdate(
      { email: verifiedProfile.email },
      verifiedProfile,
      { upsert: true, new: true }
    );
    console.log('✓ Profile seeded / updated.');

    // 2. Skills
    for (const s of verifiedSkills) {
      await Skill.findOneAndUpdate(
        { name: s.name },
        s,
        { upsert: true, new: true }
      );
    }
    console.log(`✓ ${verifiedSkills.length} Skills seeded.`);

    // 3. Projects
    for (const p of verifiedProjects) {
      await Project.findOneAndUpdate(
        { slug: p.slug },
        p,
        { upsert: true, new: true }
      );
    }
    console.log(`✓ ${verifiedProjects.length} Projects seeded.`);

    // 4. Experience
    for (const e of verifiedExperience) {
      await Experience.findOneAndUpdate(
        { title: e.title, company: e.company },
        e,
        { upsert: true, new: true }
      );
    }
    console.log(`✓ ${verifiedExperience.length} Experience records seeded.`);

    // 5. Hackathons
    for (const h of verifiedHackathons) {
      await Hackathon.findOneAndUpdate(
        { name: h.name },
        h,
        { upsert: true, new: true }
      );
    }
    console.log(`✓ ${verifiedHackathons.length} Hackathon entries seeded.`);

    // 6. Education
    for (const edu of verifiedEducation) {
      await Education.findOneAndUpdate(
        { degree: edu.degree, institution: edu.institution },
        edu,
        { upsert: true, new: true }
      );
    }
    console.log(`✓ ${verifiedEducation.length} Education records seeded.`);

    // 7. Certifications
    for (const c of verifiedCertifications) {
      await Certification.findOneAndUpdate(
        { title: c.title, issuer: c.issuer },
        c,
        { upsert: true, new: true }
      );
    }
    console.log(`✓ ${verifiedCertifications.length} Certifications seeded.`);

    // 8. Achievements
    for (const a of verifiedAchievements) {
      await Achievement.findOneAndUpdate(
        { title: a.title },
        a,
        { upsert: true, new: true }
      );
    }
    console.log(`✓ ${verifiedAchievements.length} Achievements seeded.`);

    // 8. Admin User (if ADMIN_INITIAL_PASSWORD is provided in .env, seed it; otherwise warn)
    const adminPassword = process.env.ADMIN_INITIAL_PASSWORD;
    const existingAdmin = await AdminUser.findOne({ email: AUTHORIZED_ADMIN_EMAIL });
    if (!existingAdmin && adminPassword) {
      const admin = new AdminUser({
        email: AUTHORIZED_ADMIN_EMAIL,
        password: adminPassword
      });
      await admin.save();
      console.log(`✓ Admin user initialized for ${AUTHORIZED_ADMIN_EMAIL}.`);
    } else if (existingAdmin) {
      console.log(`✓ Admin user already exists for ${AUTHORIZED_ADMIN_EMAIL}.`);
    } else {
      console.log(`ℹ Admin user not seeded yet. Set ADMIN_INITIAL_PASSWORD in .env and rerun seed.`);
    }

    console.log('--- Idempotent database seeding complete ---');
  } catch (err) {
    console.error('Seeding error:', err.stack || err.message);
  } finally {
    await mongoose.disconnect();
  }
}

// If run directly:
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  seedDatabase();
}
