const interviewModel = require("../model/interviewReport.model");
const { generateInterviewReport } = require("../services/ai.service");
const pdfParse = require("pdf-parse");

const generateInterViewReportController = async (req, res) => {
  try {
    const resumeContent = await new pdfParse.PDFParse(
      Uint8Array.from(req.file.buffer),
    ).getText();
    const { selfDescription, jobDescription } = req.body;

    const interviewReportByAi = await generateInterviewReport({
      resume: resumeContent.text,
      selfDescription,
      jobDescription,
    });
    console.log("AI RESPONSE:");
    console.log(JSON.stringify(interviewReportByAi, null, 2));

    console.log(Array.isArray(interviewReportByAi.technicalQuestions));
    const interviewReportCreation = await interviewModel.create({
      user: req.user.id,
      resume: resumeContent.text,
      selfDescription: selfDescription,
      jobDescription: jobDescription,
      ...interviewReportByAi,
    });

    res.status(201).json({
      message: "Interview report generated successfully",
      interviewReportCreation,
    });
  } catch (error) {
    console.log(error);

    return res.status(400).json({
      message: error.message,
    });
  }
};

module.exports = { generateInterViewReportController };
