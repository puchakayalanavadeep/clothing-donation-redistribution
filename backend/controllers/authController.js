const mongoose = require('mongoose');
const User = require('../models/User');
const Organization = require('../models/Organization');
const Otp = require('../models/Otp');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const memoryStore = require('../utils/memoryStore');

const isDbConnected = () => mongoose.connection.readyState === 1;

const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
  const token = jwt.sign(
    { id: user._id || user.id, role: user.role },
    process.env.JWT_SECRET || 'circular_threads_secret_key_2026_super_secure',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );

  const userObj = user.toObject ? user.toObject() : { ...user };
  delete userObj.password;

  res.status(statusCode).json({
    success: true,
    message,
    token,
    user: userObj
  });
};

// @desc    Register new user (donor, organization, admin)
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone, role, organizationName, organizationType } = req.body;

    if (isDbConnected()) {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ success: false, message: 'An account with this email address already exists.' });
      }

      const user = await User.create({ name, email, password, phone, role: role || 'donor' });

      if (user.role === 'organization') {
        await Organization.create({
          user: user._id,
          organizationName: organizationName || `${name} Organization`,
          organizationType: organizationType || 'NGO',
          contactPerson: name,
          phone: phone || '+91 98765 43210',
          email: email,
          location: user.location
        });
      }

      return sendTokenResponse(user, 201, res, 'User registered successfully.');
    }

    // In-memory fallback
    const existing = memoryStore.users.find(u => u.email === email);
    if (existing) {
      return res.status(400).json({ success: false, message: 'An account with this email address already exists.' });
    }

    const newUser = {
      _id: `usr_${Date.now()}`,
      name,
      email: email.toLowerCase().trim(),
      password,
      phone,
      role: role || 'donor',
      isVerified: true
    };
    memoryStore.users.push(newUser);

    if (newUser.role === 'organization') {
      memoryStore.organizations.push({
        _id: `org_${Date.now()}`,
        user: newUser._id,
        organizationName: organizationName || `${name} Organization`,
        organizationType: organizationType || 'NGO',
        contactPerson: name,
        phone: phone || '+91 98765 43210',
        email,
        verificationStatus: 'Verified'
      });
    }

    sendTokenResponse(newUser, 201, res, 'User registered successfully.');
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password.' });
    }

    const emailLower = email.toLowerCase().trim();

    if (isDbConnected()) {
      const user = await User.findOne({ email: emailLower }).select('+password');
      if (!user) {
        return res.status(404).json({ success: false, message: 'No account found with this email address. Please click Sign Up to register first.' });
      }
      if (!(await user.matchPassword(password))) {
        return res.status(401).json({ success: false, message: 'Incorrect password entered. Access denied.' });
      }
      return sendTokenResponse(user, 200, res, 'Logged in successfully.');
    }

    // In-memory fallback
    const user = memoryStore.users.find(u => u.email.toLowerCase() === emailLower);
    if (!user) {
      return res.status(404).json({ success: false, message: 'No account found with this email address. Please click Sign Up to register first.' });
    }

    if (user.password && user.password !== password) {
      return res.status(401).json({ success: false, message: 'Incorrect password entered. Access denied.' });
    }

    sendTokenResponse(user, 200, res, 'Logged in successfully.');
  } catch (error) {
    next(error);
  }
};


// @desc    Get logged in user profile
// @route   GET /api/auth/profile
// @access  Private
exports.getProfile = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const user = await User.findById(req.user.id);
      return res.status(200).json({ success: true, data: user });
    }

    const user = memoryStore.users.find(u => u._id === req.user.id) || req.user || memoryStore.users[0];
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      phone: req.body.phone,
      location: req.body.location,
      profileImage: req.body.profileImage
    };

    if (isDbConnected()) {
      const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, { new: true, runValidators: true });
      return res.status(200).json({ success: true, message: 'Profile updated successfully.', data: user });
    }

    const index = memoryStore.users.findIndex(u => u._id === req.user.id);
    if (index !== -1) {
      memoryStore.users[index] = { ...memoryStore.users[index], ...fieldsToUpdate };
    }

    res.status(200).json({ success: true, message: 'Profile updated successfully.', data: memoryStore.users[0] });
  } catch (error) {
    next(error);
  }
};

// @desc    Send OTP to email via SMTP
// @route   POST /api/auth/send-otp
// @access  Public
exports.sendOtp = async (req, res, next) => {
  try {
    const { email, purpose } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }

    const emailLower = email.toLowerCase().trim();
    const reqPurpose = purpose || 'login';

    // 1. Verify User Existence based on Purpose
    let userExists = false;
    if (isDbConnected()) {
      const existingUser = await User.findOne({ email: emailLower });
      if (existingUser) userExists = true;
    } else {
      userExists = memoryStore.users.some(u => u.email.toLowerCase() === emailLower);
    }

    // Strict Registration Requirement Checks
    if (reqPurpose === 'login' && !userExists) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email address. Please click Sign Up to register first.'
      });
    }

    if (reqPurpose === 'register' && userExists) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists. Please click Login instead.'
      });
    }

    // Generate random 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (isDbConnected()) {
      await Otp.deleteMany({ email: emailLower, purpose: reqPurpose });
      await Otp.create({ email: emailLower, otp: otpCode, purpose: reqPurpose });
    } else {
      memoryStore.otps = memoryStore.otps.filter(o => !(o.email === emailLower && o.purpose === reqPurpose));
      memoryStore.otps.push({
        email: emailLower,
        otp: otpCode,
        purpose: reqPurpose,
        expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
      });
    }

    const htmlMessage = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 28px; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        <div style="text-align: center; margin-bottom: 24px;">
          <div style="display: inline-block; background-color: #093529; color: #ffffff; padding: 10px 18px; border-radius: 12px; font-weight: bold; font-size: 20px;">
            🌱 ReWear Connect
          </div>
          <p style="color: #64748b; font-size: 13px; margin-top: 6px;">Give Every Garment a Second Life.</p>
        </div>
        
        <h2 style="color: #0f172a; font-size: 18px; font-weight: 700; margin-bottom: 12px; text-align: center;">Your Verification Code</h2>
        <p style="color: #475569; font-size: 14px; line-height: 1.6; text-align: center;">
          Use the following 6-digit code to complete your ${reqPurpose} request for <strong>ReWear Connect</strong>:
        </p>
        
        <div style="text-align: center; margin: 28px 0;">
          <span style="font-family: monospace; font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #093529; background-color: #f0fdf4; padding: 14px 28px; border-radius: 12px; border: 2px dashed #86efac; display: inline-block;">
            ${otpCode}
          </span>
        </div>
        
        <p style="color: #94a3b8; font-size: 12px; text-align: center; line-height: 1.5;">
          This code is valid for <strong>5 minutes</strong>. If you did not request this verification code, please ignore this email.
        </p>
        
        <div style="border-top: 1px solid #f1f5f9; margin-top: 28px; padding-top: 16px; text-align: center;">
          <p style="color: #cbd5e1; font-size: 11px; margin: 0;">
            ReWear Connect – Smart Clothing Donation & Redistribution Platform
          </p>
        </div>
      </div>
    `;

    try {
      await sendEmail({
        email: emailLower,
        subject: `Your ReWear Connect Verification Code: ${otpCode}`,
        message: `Your OTP is ${otpCode}. It will expire in 5 minutes.`,
        html: htmlMessage
      });
    } catch (smtpErr) {
      console.error('⚠️ [SMTP Error]: Could not send email via SMTP server:', smtpErr.message);
    }

    res.status(200).json({
      success: true,
      message: `Verification OTP dispatched to ${emailLower}`,
      otpExpiresIn: '5 minutes'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify OTP & Log In / Register User
// @route   POST /api/auth/verify-otp
// @access  Public
exports.verifyOtp = async (req, res, next) => {
  try {
    const { email, otp, role, name, phone, city, purpose } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Please provide both email and OTP code.' });
    }

    const emailLower = email.toLowerCase().trim();
    const reqPurpose = purpose || 'login';

    let isValid = false;

    if (isDbConnected()) {
      const otpRecord = await Otp.findOne({ email: emailLower, otp, purpose: reqPurpose });
      if (otpRecord) {
        isValid = true;
        await Otp.deleteMany({ email: emailLower });
      }
    } else {
      const index = memoryStore.otps.findIndex(
        o => o.email === emailLower && o.otp === otp && o.expiresAt > Date.now()
      );
      if (index !== -1) {
        isValid = true;
        memoryStore.otps.splice(index, 1);
      }
    }

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP verification code. Please check your email and try again.'
      });
    }

    // Fetch existing user or create user profile
    let user;
    if (isDbConnected()) {
      user = await User.findOne({ email: emailLower });

      if (reqPurpose === 'login' && !user) {
        return res.status(404).json({
          success: false,
          message: 'No registered account found with this email address. Please click Sign Up first.'
        });
      }

      if (reqPurpose === 'register' && user) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email address is already registered. Please click Login instead.'
        });
      }

      if (!user && reqPurpose === 'register') {
        user = await User.create({
          name: name || emailLower.split('@')[0],
          email: emailLower,
          phone: phone || '+91 98765 11111',
          role: role || 'donor',
          isVerified: true
        });
      }
    } else {
      user = memoryStore.users.find(u => u.email.toLowerCase() === emailLower);

      if (reqPurpose === 'login' && !user) {
        return res.status(404).json({
          success: false,
          message: 'No registered account found with this email address. Please click Sign Up first.'
        });
      }

      if (reqPurpose === 'register' && user) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email address is already registered. Please click Login instead.'
        });
      }

      if (!user && reqPurpose === 'register') {
        user = {
          _id: `usr_${Date.now()}`,
          name: name || (role === 'NGO' ? 'Hope Shelter Foundation' : role === 'Admin' ? 'ReWear Connect Admin' : 'Karthik Subramanian'),
          email: emailLower,
          phone: phone || '+91 98765 11111',
          role: role || 'donor',
          city: city || 'Pudukkottai',
          isVerified: true
        };
        memoryStore.users.push(user);
      }
    }

    sendTokenResponse(user, 200, res, reqPurpose === 'register' ? 'Registration completed successfully!' : 'Email verified & logged in successfully!');
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot Password - Send Reset OTP
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide your registered email address.' });
    }

    const emailLower = email.toLowerCase().trim();

    // Check if user exists
    let userExists = false;
    if (isDbConnected()) {
      const user = await User.findOne({ email: emailLower });
      if (user) userExists = true;
    } else {
      userExists = memoryStore.users.some(u => u.email.toLowerCase() === emailLower);
    }

    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: 'No registered account found with this email address. Please check your email or click Sign Up.'
      });
    }

    // Generate random 6-digit OTP for password reset
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (isDbConnected()) {
      await Otp.deleteMany({ email: emailLower, purpose: 'forgot_password' });
      await Otp.create({ email: emailLower, otp: otpCode, purpose: 'forgot_password' });
    } else {
      memoryStore.otps = memoryStore.otps.filter(o => !(o.email === emailLower && o.purpose === 'forgot_password'));
      memoryStore.otps.push({
        email: emailLower,
        otp: otpCode,
        purpose: 'forgot_password',
        expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
      });
    }

    const htmlMessage = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 28px; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        <div style="text-align: center; margin-bottom: 24px;">
          <div style="display: inline-block; background-color: #093529; color: #ffffff; padding: 10px 18px; border-radius: 12px; font-weight: bold; font-size: 20px;">
            🌱 ReWear Connect
          </div>
          <p style="color: #64748b; font-size: 13px; margin-top: 6px;">Password Reset Request</p>
        </div>
        
        <h2 style="color: #0f172a; font-size: 18px; font-weight: 700; margin-bottom: 12px; text-align: center;">Reset Your Password</h2>
        <p style="color: #475569; font-size: 14px; line-height: 1.6; text-align: center;">
          Use the following 6-digit OTP code to reset your account password for <strong>ReWear Connect</strong>:
        </p>
        
        <div style="text-align: center; margin: 28px 0;">
          <span style="font-family: monospace; font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #093529; background-color: #f0fdf4; padding: 14px 28px; border-radius: 12px; border: 2px dashed #86efac; display: inline-block;">
            ${otpCode}
          </span>
        </div>
        
        <p style="color: #94a3b8; font-size: 12px; text-align: center; line-height: 1.5;">
          This code is valid for <strong>5 minutes</strong>. If you did not request a password reset, please secure your account.
        </p>
      </div>
    `;

    try {
      await sendEmail({
        email: emailLower,
        subject: `ReWear Connect Password Reset OTP: ${otpCode}`,
        message: `Your Password Reset OTP is ${otpCode}. It will expire in 5 minutes.`,
        html: htmlMessage
      });
    } catch (smtpErr) {
      console.error('⚠️ [SMTP Error]: Could not send password reset email via SMTP server:', smtpErr.message);
    }

    res.status(200).json({
      success: true,
      message: `Password reset OTP sent to ${emailLower}. Please check your email inbox.`
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset Password with OTP
// @route   POST /api/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide email, OTP code, and new password.' });
    }

    const emailLower = email.toLowerCase().trim();

    let isValid = false;

    if (isDbConnected()) {
      const otpRecord = await Otp.findOne({ email: emailLower, otp, purpose: 'forgot_password' });
      if (otpRecord) {
        isValid = true;
        await Otp.deleteMany({ email: emailLower, purpose: 'forgot_password' });
      }
    } else {
      const index = memoryStore.otps.findIndex(
        o => o.email === emailLower && o.otp === otp && o.purpose === 'forgot_password' && o.expiresAt > Date.now()
      );
      if (index !== -1) {
        isValid = true;
        memoryStore.otps.splice(index, 1);
      }
    }

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired password reset code. Please request a new OTP.'
      });
    }

    // Update password
    let user;
    if (isDbConnected()) {
      user = await User.findOne({ email: emailLower });
      if (!user) {
        return res.status(404).json({ success: false, message: 'User account not found.' });
      }
      user.password = newPassword;
      await user.save();
    } else {
      const index = memoryStore.users.findIndex(u => u.email.toLowerCase() === emailLower);
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'User account not found.' });
      }
      memoryStore.users[index].password = newPassword;
      user = memoryStore.users[index];
    }

    sendTokenResponse(user, 200, res, 'Password reset successfully! You are now logged in.');
  } catch (error) {
    next(error);
  }
};



