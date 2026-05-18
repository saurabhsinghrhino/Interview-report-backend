const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const authController = require("../controllers/auth.controller");
/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */

router.post("/register", authController.userRigster);

/**
 * @route   POST /api/auth/login
 * @desc    Login a user
 * @access  Public
 */
router.post("/login", authController.userLogin);

/**
 * @route   GET /api/auth/logout
 * @desc    Logout a user
 * @access  Public
 */
router.get("/logout", authController.userLogout);

/**
 * @route   GET /api/auth/getme
 * @desc    User get all details from his/her profile
 * @access  Private
 */
router.get("/getme", authMiddleware.getUser, authController.getUserDeatils);
module.exports = router;
