const mongoose = require("mongoose");

/**
 * - job description Schema : String
 * - resume text : String
 * - Self description : String
 *
 * - matchScore : Number
 *
 * - Technical questions :
 *          [{
 *              question : "",
 *              intension : "",
 *              answer : ""
 *          }]
 * - Behavioral questions : [{
 *              question : "",
 *              intension : "",
 *              answer : ""
 *          }]
 * - Skill gaps : [{
 *              skills : "",
 *              severity: {
 *                  type: String,
 *                  enum: ["low", "medium", "high"]
 *              }
 *          }]
 * - preparation plan : [{
 *              day : Number,
 *              focus : String,
 *              tasks : [String]
 *          }]
 *
 */

const technicalQuestionsSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "Question is required"],
    },
    intension: {
      type: String,
      required: [true, "Intension is required"],
    },
    answer: {
      type: String,
      required: [true, "Answer is required"],
    },
  },
  { _id: false },
);
const behavioralQuestionsSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "Question is required"],
    },
    intension: {
      type: String,
      required: [true, "Intension is required"],
    },
    answer: {
      type: String,
      required: [true, "Answer is required"],
    },
  },
  { _id: false },
);
const skillGapsSchema = new mongoose.Schema(
  {
    skills: {
      type: String,
      required: [true, "Skills are required"],
    },
    severity: {
      type: String,
      enum: ["low", "medium", "high"],
      required: [true, "Severity is required"],
    },
  },
  {
    _id: false,
  },
);

const preparationPlanSchema = new mongoose.Schema({
  day: {
    type: Number,
    required: [true, "Day is required"],
  },
  focus: {
    type: String,
    required: [true, "Focus is required"],
  },
  tasks: {
    type: [String],
    required: [true, "Tasks are required"],
  },
});
const interviewReportSchema = new mongoose.Schema(
  {
    jobDescription: {
      type: String,
      required: [true, "Job description is required"],
    },
    resume: {
      type: String,
    },
    selfDescription: {
      type: String,
    },
    matchScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    technicalQuestions: [technicalQuestionsSchema],
    behavioralQuestions: [behavioralQuestionsSchema],
    skillGaps: [skillGapsSchema],
    preparationPlan: [preparationPlanSchema],
  },
  { timestamps: true },
);

const interviewReportModel = mongoose.model(
  "InterviewReport",
  interviewReportSchema,
);

module.exports = interviewReportModel;
