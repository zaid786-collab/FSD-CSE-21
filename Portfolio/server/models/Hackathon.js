import mongoose from 'mongoose';

const hackathonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  organizer: {
    type: String,
    default: ''
  },
  date: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: 'India'
  },
  projectName: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    required: true,
    default: 'Team Leader'
  },
  description: {
    type: String,
    default: ''
  },
  teamInfo: {
    type: String,
    default: 'Team Leader & Solution Architect'
  },
  result: {
    type: String,
    default: ''
  },
  certificateUrl: {
    type: String,
    default: ''
  },
  projectUrl: {
    type: String,
    default: ''
  },
  technologies: [{
    type: String
  }],
  order: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'published'
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export const Hackathon = mongoose.model('Hackathon', hackathonSchema);
