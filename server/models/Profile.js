import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: 'Mohammad Zaid Khan'
  },
  title: {
    type: String,
    required: true,
    default: 'Software Engineer | Full-Stack Developer | Competitive Programmer'
  },
  headline: {
    type: String,
    default: 'Building scalable software, solving problems through DSA/CP, and exploring AI/GenAI.'
  },
  bio: {
    type: String,
    default: 'Computer Science student at ABES Engineering College with strong fundamentals in full-stack development, backend architecture, and competitive programming. Committed to building robust, production-grade applications and solving complex algorithmic challenges.'
  },
  location: {
    type: String,
    default: 'Noida, India'
  },
  email: {
    type: String,
    required: true,
    default: 'zaidkhan24082006@gmail.com'
  },
  publicEmail: {
    type: String,
    default: 'zaidkhan24082006@gmail.com'
  },
  availabilityStatus: {
    type: String,
    default: 'Available for Opportunities'
  },
  availabilityStatement: {
    type: String,
    default: 'Open to software engineering opportunities, internships & freelance projects'
  },
  contactFormEnabled: {
    type: Boolean,
    default: true
  },
  notificationEmail: {
    type: String,
    default: 'zaidkhan24082006@gmail.com'
  },
  siteTitle: {
    type: String,
    default: 'Mohammad Zaid Khan — Software Engineer Portfolio'
  },
  metaDescription: {
    type: String,
    default: 'Portfolio of Mohammad Zaid Khan - Software Engineer, Full-Stack Developer, and Competitive Programmer.'
  },
  footerCopyright: {
    type: String,
    default: '© 2026 Mohammad Zaid Khan'
  },
  developerTagline: {
    type: String,
    default: 'Building scalable software, solving problems through DSA/CP, and exploring AI/GenAI.'
  },
  githubUrl: {
    type: String,
    default: 'https://github.com/zaid786-collab'
  },
  linkedinUrl: {
    type: String,
    default: 'https://www.linkedin.com/in/mohammad-zaid-khan-a2927a370/'
  },
  leetcodeUrl: {
    type: String,
    default: 'https://leetcode.com/u/MOHAMMADZAIDKHAN7/'
  },
  codechefUrl: {
    type: String,
    default: 'https://www.codechef.com/users/zaid_khan07'
  },
  codeforcesUrl: {
    type: String,
    default: 'https://codeforces.com/profile/MohammadZaidKhan'
  },
  resumeUrl: {
    type: String,
    default: '/Mohammad_Zaid_Khan_Resume.pdf'
  },
  socialLinks: [{
    platform: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    label: String,
    order: Number
  }],
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'published'
  }
}, {
  timestamps: true
});

export const Profile = mongoose.model('Profile', profileSchema);
