import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { AdminUser, AUTHORIZED_ADMIN_EMAIL } from '../models/AdminUser.js';

export const JWT_SECRET = process.env.JWT_SECRET || 'mzk_super_secure_jwt_secret_dev_2026_!#';

export async function requireAdmin(req, res, next) {
  try {
    const token = req.cookies?.mzk_token || (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : null);

    if (!token) {
      return res.status(401).json({ success: false, message: 'Authentication required. No active session token.' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    // Double check email strictly matches the single authorized admin email
    if (!decoded.email || decoded.email.toLowerCase() !== AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
      return res.status(403).json({ success: false, message: 'Forbidden. Administrator privileges not granted.' });
    }

    if (mongoose.connection.readyState === 1) {
      const user = await AdminUser.findOne({ email: decoded.email.toLowerCase() });
      if (!user) {
        return res.status(403).json({ success: false, message: 'Forbidden. User record not recognized.' });
      }
      req.adminUser = user;
    } else {
      req.adminUser = {
        _id: decoded.id || 'authorized-owner-id',
        email: decoded.email,
        role: decoded.role || 'admin',
        lastLogin: new Date()
      };
    }

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Session expired. Please log in again.' });
    }
    return res.status(401).json({ success: false, message: 'Invalid session token.' });
  }
}
