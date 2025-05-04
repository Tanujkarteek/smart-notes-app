// server/controllers/authController.js
const User = require("../models/user");

// Register a new user
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      hasCompletedOnboarding: false,
    });

    // Generate JWT token
    const token = user.generateAuthToken();

    // Return user without password and token
    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if password is correct
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = user.generateAuthToken();

    // Return user without password and token
    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        hasCompletedOnboarding: user.hasCompletedOnboarding,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

// Get current user profile
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      hasCompletedOnboarding: user.hasCompletedOnboarding,
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Server error getting user data" });
  }
};

// Update onboarding status
exports.updateOnboardingStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.hasCompletedOnboarding = true;
    await user.save();

    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      hasCompletedOnboarding: user.hasCompletedOnboarding,
    });
  } catch (error) {
    console.error("Update onboarding error:", error);
    res
      .status(500)
      .json({ message: "Server error updating onboarding status" });
  }
};
