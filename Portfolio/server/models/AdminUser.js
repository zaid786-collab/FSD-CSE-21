import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const AUTHORIZED_ADMIN_EMAIL = 'zaidkhan24082006@gmail.com';

const adminUserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function (value) {
        return value.toLowerCase() === AUTHORIZED_ADMIN_EMAIL.toLowerCase();
      },
      message: 'Access Denied: Only the authorized email can hold administrator credentials.'
    }
  },
  password: {
    type: String,
    required: function () {
      return !this.googleId;
    },
    minlength: 8
  },
  googleId: {
    type: String,
    default: null
  },
  role: {
    type: String,
    enum: ['admin'],
    default: 'admin'
  },
  resetPasswordToken: {
    type: String,
    default: null
  },
  resetPasswordExpires: {
    type: Date,
    default: null
  },
  lastLogin: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

adminUserSchema.pre('save', async function (next) {
  if (this.email.toLowerCase() !== AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
    return next(new Error('Unauthorized email address'));
  }
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

adminUserSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

export const AdminUser = mongoose.model('AdminUser', adminUserSchema);
export { AUTHORIZED_ADMIN_EMAIL };
