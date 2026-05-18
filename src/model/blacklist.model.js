const mongoose = require("mongoose");

const blackListSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: [true, "Token is required"],
      index: true,
    },
  },
  { timestamps: true },
);
blackListSchema.index({ createdAt: 1 }, { expires: 60 * 60 * 24 * 3 }); // Set the document to expire after 3 days

const tokenBlackListModel = mongoose.model("TokenBlackList", blackListSchema);
module.exports = tokenBlackListModel;
