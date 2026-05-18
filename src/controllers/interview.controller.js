const interviewModel = require("../model/interviewReport.model");
const userModel = require("../model/user.model");
const pdfParse = require("pdf-parse");

const generateInterViewReportController = async (req, res) => {
  const resumeFile = req.file;

  const resumeContent = new pdfParse(req.file.buffer);
};

module.exports = { generateInterViewReportController };
