const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: [true, "Username already taken"],
    required: [true, "Username required for registration"],
  },
  email: {
    type: String,
    unique: [true, "Email already registered"],
    required: [true, "Email required for registration"],
  },
  password: {
    type: String,
    required: [true, "Password required for registration"],
    select: false,
  },
});

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
