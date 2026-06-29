const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const interviewReportSchema = z.object({
  matchScore: z
    .number()
    .describe(
      "A score between 0 and 100 indicating how well the candidate matches the job",
    ),
  technicalQuestions: z
    .array(
      z.object({
        question: z.string().describe("Technical question for the interview"),
        intention: z
          .string()
          .describe("Interviewer's intention behind this question"),
        answer: z.string().describe("How to answer this question effectively"),
      }),
    )
    .describe("Technical questions with intention and answer guidance"),
  behavioralQuestions: z
    .array(
      z.object({
        question: z.string().describe("Behavioral question for the interview"),
        intention: z
          .string()
          .describe("Interviewer's intention behind this question"),
        answer: z.string().describe("How to answer this question effectively"),
      }),
    )
    .describe("Behavioral questions with intention and answer guidance"),
  skillGaps: z
    .array(
      z.object({
        skill: z.string().describe("Skill the candidate is lacking"),
        severity: z
          .enum(["low", "medium", "high"])
          .describe("How critical this gap is"),
      }),
    )
    .describe("Skill gaps with severity"),
  preparationPlan: z
    .array(
      z.object({
        day: z.number().describe("Day number starting from 1"),
        focus: z.string().describe("Main focus for this day"),
        tasks: z.array(z.string()).describe("Tasks to complete on this day"),
      }),
    )
    .describe("Day-wise preparation plan"),
  title: z.string().describe("Job title from the job description"),
});

async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  const prompt = `
You are an expert technical interviewer and career coach.

Analyze the candidate's profile against the job description and generate a comprehensive interview preparation report.

Candidate Resume:
${resume}

Candidate Self Description:
${selfDescription}

Job Description:
${jobDescription}

You MUST respond with ONLY a valid JSON object. No explanation, no markdown, no extra text.
The JSON must strictly follow this exact structure:

{
  "title": "string - job title from the job description",
  "matchScore": number between 0 and 100,
  "technicalQuestions": [
    {
      "question": "string - the technical question",
      "intention": "string - why interviewer asks this",
      "answer": "string - how to answer effectively"
    }
  ],
  "behavioralQuestions": [
    {
      "question": "string - the behavioral question",
      "intention": "string - why interviewer asks this",
      "answer": "string - how to answer effectively"
    }
  ],
  "skillGaps": [
    {
      "skill": "string - skill the candidate lacks",
      "severity": "low" or "medium" or "high"
    }
  ],
  "preparationPlan": [
    {
      "day": number starting from 1,
      "focus": "string - main topic for the day",
      "tasks": ["string - task 1", "string - task 2"]
    }
  ]
}

Generate 5-7 technical questions, 4-5 behavioral questions, list all skill gaps, and a 7-day preparation plan.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview ",
      contents: prompt,
      config: {
        responseMimeType: "application/json", // this alone is enough
      },
    });

    const parsed = JSON.parse(response.text);
    return parsed;
  } catch (err) {
    console.error("AI generation failed:", err.message);
    throw new Error("Failed to generate interview report");
  }
}

module.exports = { generateInterviewReport };
