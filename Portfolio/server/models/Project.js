import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  tagline: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  problemStatement: {
    type: String,
    default: ''
  },
  solution: {
    type: String,
    default: ''
  },
  features: [{
    type: String
  }],
  techStack: [{
    type: String,
    required: true
  }],
  architecture: {
    type: String,
    default: ''
  },
  challenges: [{
    type: String
  }],
  role: {
    type: String,
    default: 'Project Leader'
  },
  githubUrl: {
    type: String,
    required: true,
    trim: true
  },
  liveDemoUrl: {
    type: String,
    default: null,
    trim: true
  },
  mediaUrls: [{
    url: String,
    caption: String,
    isPrimary: Boolean
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
  },
  deletedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

projectSchema.query.active = function () {
  return this.where({ isDeleted: false, status: 'published' });
};

projectSchema.query.notDeleted = function () {
  return this.where({ isDeleted: false });
};

export const Project = mongoose.model('Project', projectSchema);
