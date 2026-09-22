import mongoose from 'mongoose';

const educationSchema = new mongoose.Schema({
  degree: {
    type: String,
    required: true,
    default: 'B.Tech'
  },
  fieldOfStudy: {
    type: String,
    default: 'Computer Science & Engineering'
  },
  institution: {
    type: String,
    required: true,
    default: 'ABES Engineering College'
  },
  startYear: {
    type: String,
    default: '2025'
  },
  endYear: {
    type: String,
    default: '2029'
  },
  period: {
    type: String,
    default: '2025–2029'
  },
  cgpa: {
    type: String,
    default: '9.1'
  },
  description: {
    type: String,
    default: 'Core focus on Data Structures & Algorithms, Object-Oriented Software Design, Database Systems, and Computer Architecture.'
  },
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

export const Education = mongoose.model('Education', educationSchema);
