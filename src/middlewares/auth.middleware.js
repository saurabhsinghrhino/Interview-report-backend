const userModel = require("../model/user.model");
const blackListModel = require("../model/blacklist.model");
const jwt = require("jsonwebtoken");

async function getUser(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({
      message: "User Unauthorized",
    });
  }
  const isBlacklistExisted = await blackListModel.findOne({
    token: token,
  });
  if (isBlacklistExisted) {
    return res.status(400).json({
      message: "This user token is BlackListed",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "User Unauthorized",
    });
  }
}

module.exports = { getUser };
