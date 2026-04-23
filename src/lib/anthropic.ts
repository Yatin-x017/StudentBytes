import Anthropic from '@anthropic-ai/sdk';

export const getAnthropicClient = (apiKey: string) => {
  return new Anthropic({
    apiKey,
    dangerouslyAllowBrowser: true, // Required for client-side Anthropic SDK usage
  });
};

export const SYSTEM_PROMPT = `You are a brilliant CS tutor named Byte. You specialize in helping university students understand computer science concepts. You explain things clearly with real-world analogies, provide code examples in the student's preferred language (default: Python), and always check understanding by asking a follow-up question. Format code in markdown code blocks. Keep responses concise but complete. Topics you cover: DSA, Operating Systems, DBMS, Computer Networks, OOP, System Design, Algorithms, and general programming.`;

export function buildSystemPromptWithFile(fileContent: string, fileName: string): string {
  return `${SYSTEM_PROMPT}

The student has uploaded a document: "${fileName}"
Here is the content:

${fileContent}

When answering questions, refer to this document directly.
Quote specific sections when relevant. If asked something not
covered in the document, say so clearly.`;
}

export const QUIZ_PROMPT = (topic: string, difficulty: string) => `Generate 5 multiple-choice questions (MCQs) about "${topic}" at a "${difficulty}" level.
Return ONLY a JSON array of objects with these exact fields:
"question": string,
"options": string array (exactly 4),
"correctIndex": number (0-3),
"explanation": string.
Ensure the JSON is valid and contains no other text.`;
