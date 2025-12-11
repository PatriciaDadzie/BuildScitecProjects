const User = require('../models/User');
const emailService = require('../services/emailService');
const { generateToken } = require('../utils/tokenGenerator');

exports.sendVerificationEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });

    if (user && user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified',
      });
    }

    // Generate verification token
    const verificationToken = generateToken();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    if (!user) {
      // Create new user
      user = await User.create({
        email,
        verificationToken,
        verificationExpires,
        lastVerificationSent: new Date(),
      });
    } else {
      // Update existing user
      user.verificationToken = verificationToken;
      user.verificationExpires = verificationExpires;
      user.lastVerificationSent = new Date();
      user.verificationAttempts += 1;
      await user.save();
    }

    // Send verification email
    await emailService.sendVerificationEmail(email, verificationToken);

    res.status(200).json({
      success: true,
      message: 'Verification email sent successfully',
    });
  } catch (error) {
    next(error);
  }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.body;

    // Find user with valid token
    const user = await User.findOne({
      verificationToken: token,
      verificationExpires: { $gt: Date.now() },
    }).select('+verificationToken +verificationExpires');

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token',
      });
    }

    // Update user
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      data: {
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified',
      });
    }

    // Check if recently sent
    if (user.lastVerificationSent) {
      const timeSinceLastSent = Date.now() - user.lastVerificationSent.getTime();
      if (timeSinceLastSent < 60000) { // 1 minute
        return res.status(429).json({
          success: false,
          message: 'Please wait before requesting another verification email',
        });
      }
    }

    // Generate new token
    const verificationToken = generateToken();
    user.verificationToken = verificationToken;
    user.verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    user.lastVerificationSent = new Date();
    await user.save();

    await emailService.sendVerificationEmail(email, verificationToken);

    res.status(200).json({
      success: true,
      message: 'Verification email resent successfully',
    });
  } catch (error) {
    next(error);
  }
};
