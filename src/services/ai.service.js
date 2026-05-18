const { GoogleGenAI, Behavior } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const interviewQuestionsSchema = z.object({
  matchScore: z
    .number()
    .describe(
      "A score between 0 and 100 indicating how well the candidate's profile matches the job description",
    ),
  technicalQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The technical question be asked in the interview"),
        intention: z
          .string()
          .describe(
            "The intention of the interviewer behind asking this question",
          ),
        answer: z
          .string()
          .describe(
            "How to answer this question and what the check points for this question, what are the approach, etc.",
          ),
      }),
    )
    .describe(
      "Technical questions that can be asked in the interview along with their intentions and answers",
    ),
  behavioralQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The behavioral question be asked in the interview"),
        intention: z
          .string()
          .describe(
            "The intention of the interviewer behind asking this question",
          ),
        answer: z
          .string()
          .describe(
            "How to answer this question and what the check points for this question, what are the approach, etc",
          ),
      }),
    )
    .describe(
      "Behavioral questions that can be asked in the interview along with their intentions and answers",
    ),
  skillGaps: z
    .array(
      z.object({
        skills: z.string().describe("The skills which the candidate lagging"),
        severity: z
          .enum(["low", "medium", "high"])
          .describe("The severity of this skill gaps "),
      }),
    )
    .describe(
      "List of skill gaps in the candidate's profile along with their severity",
    ),
  preparationPlan: z
    .array(
      z.object({
        day: z
          .number()
          .describe(
            "How many days it took to complete this preparation plan, from start to end",
          ),
        focus: z
          .string()
          .describe(
            "The main focuses on this plan, what are the topics that cover in a day...",
          ),
        tasks: z
          .array(z.string())
          .describe(
            "Everyday tasks that candidate cover in a day, and the flow of these tasks is form beginner to advanced",
          ),
      }),
    )
    .describe(
      "The day-wise preparation plan for the candidate to follow their tasks and everyday topics which can candidate cover's...",
    ),
});

async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  const prompt = `Generate an interview report for this candidate with the following details: 
  resume: ${resume}
  selfDescription: ${selfDescription}
  jobDescription: ${jobDescription}
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: zodToJsonSchema(interviewQuestionsSchema),
    },
  });

  return JSON.parse(response.text);
}

module.exports = { generateInterviewReport };
