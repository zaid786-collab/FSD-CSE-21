import mongoose from 'mongoose';

const certificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  issuer: {
    type: String,
    required: true,
    trim: true
  },
  credentialUrl: {
    type: String,
    default: ''
  },
  credentialId: {
    type: String,
    default: ''
  },
  issueDate: {
    type: String,
    default: ''
  },
  expiryDate: {
    type: String,
    default: ''
  },
  details: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    default: 'Technical'
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

certificationSchema.pre('save', function(next) {
  if (!this.description && this.details) this.description = this.details;
  if (!this.details && this.description) this.details = this.description;
  next();
});

export const Certification = mongoose.model('Certification', certificationSchema);
