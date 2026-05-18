const express = require("express");
const { getUser } = require("../middlewares/auth.middleware");
const interviewController = require("../controllers/interview.controller");
const upload = require("../middlewares/file.middleware");
const interviewRouter = express.Router();

/**
 * @route POST /api/interview/
 * @description This is to generate interview report of candidate on the basis of self description, resume pdf and job description
 * @access private
 */

interviewRouter.post(
  "/",
  getUser,
  upload.single("resume"),
  interviewController.generateInterViewReportController,
);

module.exports = interviewRouter;
