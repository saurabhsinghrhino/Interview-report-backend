const userModel = require("../model/user.model");
const blacklistModel = require("../model/blacklist.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

/**
 * @route POST/api/auth/register
 * @desc Register a new user with username,email and password
 * @access Public
 */
const userRigster = async function (req, res) {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const isExisted = await userModel.findOne({
    $or: [{ username: username }, { email: email }],
  });
  if (isExisted) {
    return res.status(400).json({ message: "User already exists" });
  }

  try {
    const hash = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      username: username,
      email: email,
      password: hash,
    });

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.cookie("token", token);
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @route POST/api/auth/login
 * @desc Login a user with email and password
 * @access Public
 */
const userLogin = async function (req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const user = await userModel
      .findOne({
        email: email,
      })
      .select("+password");
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.cookie("token", token);
    res.status(200).json({
      message: "User logged in successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @route GET/api/auth/logout
 * @description Logout a user by clearing the token cookie with token blacklisting
 * @access Public
 */
const userLogout = async function (req, res) {
  const token = req.cookies.token;
  if (token) {
    await blacklistModel.create({
      token: token,
    });
  } else {
    return res.status(400).json({
      message: "Some Error found",
    });
  }
  res.clearCookie("token");
  return res.status(201).json({
    message: "User logout successfully",
  });
};

/**
 * @route POST/api/auth/getme
 * @description Getting User Details
 * @access Private
 */
const getUserDeatils = async function (req, res) {
  const user = await userModel.findById(req.user.id);
  if (!user) {
    return res.status(401).json({
      message: "Use not existed",
    });
  }
  return res.status(201).json({
    message: "User all details fetched successfully",
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
    },
  });
};

module.exports = { userRigster, userLogin, userLogout, getUserDeatils };
