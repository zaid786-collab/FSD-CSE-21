import mongoose from 'mongoose';

const contactSubmissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    maxlength: 150
  },
  company: {
    type: String,
    trim: true,
    default: '',
    maxlength: 150
  },
  phone: {
    type: String,
    trim: true,
    default: '',
    maxlength: 30
  },
  purpose: {
    type: String,
    required: true,
    enum: [
      'Internship',
      'Full-time Opportunity',
      'Freelance',
      'Project Collaboration',
      'Hackathon or Open Source',
      'General Inquiry'
    ],
    default: 'General Inquiry'
  },
  subject: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 5000
  },
  ipAddress: {
    type: String,
    default: ''
  },
  userAgent: {
    type: String,
    default: ''
  },
  emailNotificationSent: {
    type: Boolean,
    default: false
  },
  autoReplySent: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export const ContactSubmission = mongoose.model('ContactSubmission', contactSubmissionSchema);
