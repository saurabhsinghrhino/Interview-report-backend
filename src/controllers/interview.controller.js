const pdfParse = require("pdf-parse");
const { generateInterviewReport } = require("../services/ai.service");
const interviewReportModel = require("../model/interviewReport.model");
/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterViewReportController(req, res) {
  try {
    const resumeContent = await new pdfParse.PDFParse(
      Uint8Array.from(req.file.buffer),
    ).getText();
    const { selfDescription, jobDescription } = req.body;

    const interViewReportByAi = await generateInterviewReport({
      resume: resumeContent.text,
      selfDescription,
      jobDescription,
    });

    const interviewReport = await interviewReportModel.create({
      user: req.user.id,
      resume: resumeContent.text,
      selfDescription,
      jobDescription,
      ...interViewReportByAi,
    });
    console.log(interviewReport);
    // In your controller, before saving to DB
    const isValid =
      Array.isArray(interViewReportByAi.technicalQuestions) &&
      typeof interViewReportByAi.technicalQuestions[0] === "object";

    if (!isValid) {
      return res
        .status(500)
        .json({ message: "AI returned invalid report structure" });
    }
  } catch (err) {
    console.error("Controller error:", err.message);
    res.status(500).json({ message: err.message });
  }
}

module.exports = { generateInterViewReportController };
