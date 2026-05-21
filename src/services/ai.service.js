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
      "A score between 0 and 100 indicating how well the candidate's profile matches the job describe",
    ),
  technicalQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The technical question can be asked in the interview"),
        intention: z
          .string()
          .describe("The intention of interviewer behind asking this question"),
        answer: z
          .string()
          .describe(
            "How to answer this question, what points to cover, what approach to take etc.",
          ),
      }),
    )
    .describe(
      "Technical questions that can be asked in the interview along with their intention and how to answer them",
    ),
  behavioralQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The technical question can be asked in the interview"),
        intention: z
          .string()
          .describe("The intention of interviewer behind asking this question"),
        answer: z
          .string()
          .describe(
            "How to answer this question, what points to cover, what approach to take etc.",
          ),
      }),
    )
    .describe(
      "Behavioral questions that can be asked in the interview along with their intention and how to answer them",
    ),
  skillGaps: z
    .array(
      z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z
          .enum(["low", "medium", "high"])
          .describe(
            "The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances",
          ),
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
          .describe("The day number in the preparation plan, starting from 1"),
        focus: z
          .string()
          .describe(
            "The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc.",
          ),
        tasks: z
          .array(z.string())
          .describe(
            "List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.",
          ),
      }),
    )
    .describe(
      "A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively",
    ),
  title: z
    .string()
    .describe(
      "The title of the job for which the interview report is generated",
    ),
});

async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  const prompt = `
You are an AI interview preparation assistant.

Analyze the candidate profile carefully using:
1. Resume
2. Self Description
3. Job Description

Your task:
- Generate technical interview questions
- Generate behavioral interview questions
- Identify skill gaps
- Assign severity levels
- Create a preparation roadmap

STRICT RULES:
- Return ONLY valid JSON
- No markdown
- No explanations outside JSON
- Generate at least:
  - 5 technical questions
  - 5 behavioral questions
  - 5 skill gaps
  - 7-day preparation plan

Severity Levels:
- LOW
- MEDIUM
- HIGH

Candidate Resume:
${resume}

Candidate Self Description:
${selfDescription}

Job Description:
${jobDescription}

Expected JSON Structure:

{
  "technicalQuestions": [
    {
      question: "",
      difficulty: "",
      topic: "",
      expectedAnswer: ""
    }
  ],
  "behavioralQuestions": [
    {
      question: "",
      purpose: ""
    }
  ],
  "skillGaps": [
    {
      skill: "",
      severity: "",
      reason: "",
      improvementSuggestion: ""
    }
  ],
  "preparationPlan": [
    {
      day: "",
      focus: "",
      tasks: []
    }
  ]
}
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
