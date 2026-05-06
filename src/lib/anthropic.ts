import Anthropic from '@anthropic-ai/sdk';

export const getAnthropicClient = (apiKey: string) => {
  return new Anthropic({
    apiKey,
    dangerouslyAllowBrowser: true, // Required for client-side Anthropic SDK usage
  });
};

export const SYSTEM_PROMPT = `You are Byte — a sharp, friendly AI tutor
for CS university students. Casual, precise, never condescending.
Use markdown with fenced code blocks. End with a follow-up question.`;

export const buildSystemPromptWithLanguage = (language: string) =>
  `You are Byte — a sharp, friendly AI tutor for CS university students.
Casual, precise, never condescending.

Use ${language} for ALL code examples. Always use fenced code blocks tagged correctly.
Use markdown formatting. End every response with one follow-up question.`;

export function buildSystemPromptWithFile(fileContent: string, fileName: string): string {
  return `${SYSTEM_PROMPT}

The student has uploaded a document: "${fileName}"
Here is the content:

${fileContent}

When answering questions, refer to this document directly.
Quote specific sections when relevant. If asked something not
covered in the document, say so clearly.`;
}

export const QUIZ_PROMPT = (
  topic: string,
  difficulty: string,
  language = 'Python'
) => `Generate exactly 5 MCQ questions about "${topic}" at ${difficulty} level.

Rules:
- Beginner: conceptual questions, no heavy math, simple code if any
- Intermediate: mix of concept + applied + one ${language} code snippet question
- Advanced: edge cases, complexity analysis, tricky ${language} code output questions
- Wrong options must be plausible common misconceptions, not obviously wrong
- Explanations must say WHY correct AND why each wrong option is wrong

Return ONLY valid JSON array. No markdown. No preamble:
[
  {
    "question": "question text",
    "code": "optional ${language} code block if relevant, else null",
    "options": ["A", "B", "C", "D"],
    "correctIndex": 0,
    "explanation": "Why A is correct. Why B wrong. Why C wrong. Why D wrong.",
    "difficulty": "${difficulty}",
    "concept": "the specific concept tested"
  }
]`;
