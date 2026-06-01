const pdfParse = require("pdf-parse");
const { generateInterviewReport } = require("../services/ai.service");
const interviewReportModel = require("../model/interviewReport.model");

/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterViewReportController(req, res) {
  const resumeContent = await new pdfParse.PDFParse(
    Uint8Array.from(req.file.buffer),
  ).getText();
  const { selfDescription, jobDescription } = req.body;
  console.log("resumeContent", resumeContent);

  const interViewReportByAi = await generateInterviewReport({
    resume: resumeContent.text,
    selfDescription,
    jobDescription,
  });
  console.log("interViewReportByAi", interViewReportByAi);

  const interviewReport = await interviewReportModel.create({
    user: req.user.id,
    resume: resumeContent.text,
    selfDescription,
    jobDescription,
    ...interViewReportByAi,
  });
  console.log("interviewReport", interviewReport);
  res.status(201).json({
    message: "Interview report generated successfully.",
    interviewReport,
  });
}

module.exports = {
  generateInterViewReportController,
};
