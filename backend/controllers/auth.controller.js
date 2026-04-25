const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const registerUser = async (req, res) => {
  try {
    const { fullName, email, phone,dateOfBirth, password, state,city } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered"
      });
    }

    const existingPhone = await User.findOne({ phone });

    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: "Phone number already registered"
      });
    }

    const newUser = await User.create({
      fullName,
      email,
      phone,
      dateOfBirth,
      password,       
      state,
      city
    });

const token = jwt.sign(
  {
    id: newUser._id,
    fullName: newUser.fullName,
    state: newUser.state,
    city: newUser.city,
    email: newUser.email,
    phone: newUser.phone
  },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);
    res.status(201).json({
      success: true,
      message: "User registered successfully ✅",
      token,
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        phone: newUser.phone,
        dateOfBirth: newUser.dateOfBirth,
        state: newUser.state,
        city: newUser.city
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    if (user.password !== password) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password"
      });
    }

const token = jwt.sign(
  {
    id: user._id,
    fullName: user.fullName,
    state: user.state,
    city: user.city,
    email: user.email,
    phone: user.phone
  },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);
    res.status(200).json({
      success: true,
      message: "Login successful ✅",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
         state: user.state,
          city: user.city,
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};
  const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User with this email does not exist"
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes

    await user.save();

    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

    const html = `
      <h2>CrimeHub Password Reset</h2>
      <p>You requested a password reset.</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>This link will expire in 15 minutes.</p>
    `;

    await sendEmail(user.email, "CrimeHub Password Reset", html);

    res.json({
      success: true,
      message: "Password reset link sent to your email"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token"
      });
    }

    user.password = password;

    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    res.json({
      success: true,
      message: "Password reset successful"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { password, fullName, phone, state, city } = req.body;

    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password"
      });
    }

    user.fullName = fullName || user.fullName;
    user.phone = phone || user.phone;
    user.state = state || user.state;
    user.city = city || user.city;

    await user.save();

    const token = jwt.sign(
      {
        id: user._id,
        fullName: user.fullName,
        state: user.state,
        city: user.city,
        email: user.email,
        phone: user.phone
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Profile updated successfully",
      token
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

module.exports = { registerUser, loginUser, forgotPassword, resetPassword, updateProfile };

