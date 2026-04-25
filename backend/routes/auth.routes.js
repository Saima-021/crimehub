const express = require("express");
const { validationResult } = require("express-validator");
const { validate } = require("../middleware/validate.middleware");

const { 
  registerUser, 
  loginUser, 
  forgotPassword, 
  resetPassword, 
  updateProfile 
} = require("../controllers/auth.controller");

const { registerValidator, loginValidator } = require("../middleware/auth.validator");

const { protect } = require("../middleware/auth.middleware"); // ✅ ADD THIS

const router = express.Router();

router.post(
  "/register", 
  registerValidator, 
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: errors.array()[0].msg 
      });
    }
    next();
  }, 
  registerUser
);

router.post(
  "/login",
  loginValidator,
  validate,
  loginUser
);

/* -------- SECURE PROFILE UPDATE -------- */

router.put("/update-profile", protect, updateProfile); // ✅ FIXED

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

module.exports = router;