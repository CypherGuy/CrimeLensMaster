// File: gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

let gemini: GoogleGenerativeAI;

/**
 * Initializes the Gemini API client with the provided API key.
 */
export const initializeGemini = (apiKey: string) => {
  gemini = new GoogleGenerativeAI(apiKey);
};

/**
 * Generates a question using Gemini.
 * This function simulates a two-part prompt:
 *   - The first part is the context (acting like a system message).
 *   - The second part is an empty user message.
 *
 * @param context - The context string used for generating the question.
 * @returns The Gemini API result.
 */
export const generateQuestionGemini = async (context: string) => {
  if (!gemini) {
    throw new Error("Gemini is not initialized");
  }
  const model = gemini.getGenerativeModel({ model: "gemini-1.5-flash-8b" });
  try {
    // Passing an array with the context and an empty string to mimic a chat prompt.
    const result = await model.generateContent([context, ""]);
    return result;
  } catch (e: any) {
    throw new Error(e.message);
  }
};

export const checkAnswerGemini = async (
  studentAnswerParam: string,
  context: string
) => {
  if (!gemini) {
    throw new Error("Gemini is not initialized");
  }
  const studentAnswer = studentAnswerParam.trim();
  const model = gemini.getGenerativeModel({ model: "gemini-1.5-flash-8b" });
  try {
    // Pass the context and the student's answer as an array of prompt inputs.
    const result = await model.generateContent([context, studentAnswer]);
    return result;
  } catch (e: any) {
    throw new Error(e.message);
  }
};
