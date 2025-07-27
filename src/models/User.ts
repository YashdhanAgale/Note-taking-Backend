import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  otp: {
    type: String,
  },
  otpExpiresAt: {
    type: Date,
  }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
