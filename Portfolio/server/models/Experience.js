import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    trim: true,
    default: ''
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  organization: {
    type: String,
    trim: true,
    default: ''
  },
  type: {
    type: String,
    enum: ['Freelance', 'Internship', 'Full-time', 'Leadership', 'Contract', 'Consulting'],
    default: 'Freelance'
  },
  employmentType: {
    type: String,
    default: 'Freelance'
  },
  startDate: {
    type: String,
    default: ''
  },
  endDate: {
    type: String,
    default: ''
  },
  currentlyWorking: {
    type: Boolean,
    default: false
  },
  period: {
    type: String,
    required: true,
    default: 'Ongoing'
  },
  location: {
    type: String,
    default: 'Remote'
  },
  description: {
    type: String,
    required: true
  },
  responsibilities: [{
    type: String
  }],
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

// Pre-save hook to populate role and organization if left empty
experienceSchema.pre('save', function(next) {
  if (!this.role && this.title) this.role = this.title;
  if (!this.organization && this.company) this.organization = this.company;
  if (!this.employmentType && this.type) this.employmentType = this.type;
  next();
});

export const Experience = mongoose.model('Experience', experienceSchema);
