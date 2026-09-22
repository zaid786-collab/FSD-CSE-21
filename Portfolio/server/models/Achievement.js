import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    enum: ['Academic', 'Competitive Programming', 'Hackathon', 'Technical', 'Leadership', 'Other'],
    default: 'Technical'
  },
  url: {
    type: String,
    default: ''
  },
  mediaUrl: {
    type: String,
    default: ''
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

export const Achievement = mongoose.model('Achievement', achievementSchema);
