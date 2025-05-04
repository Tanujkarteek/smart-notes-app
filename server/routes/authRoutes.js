// server/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getCurrentUser,
  updateOnboardingStatus,
} = require("../controller/authController");
const { protect } = require("../middleware/authMiddleware");

// Register a new user
router.post("/register", register);

// Login userxw
router.post("/login", login);

// update has completed onboarding
router.put("/onboarding/complete", protect, updateOnboardingStatus);

// Get current user (protected route)
router.get("/me", protect, getCurrentUser);

module.exports = router;
