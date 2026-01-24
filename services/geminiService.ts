import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateMnemonic = async (letterName: string, letterChar: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `You are a world-class Arabic teacher for 5-year-old children. 
    Generate a "Memory Magic" visual mnemonic for the Arabic letter "${letterChar}" (called ${letterName}). 
    Your mnemonic MUST be relevant to the SHAPE of the letter. 
    For example, 'Ba' (ب) looks like a boat with a dot below it, or 'Ta' (ت) looks like a smiley face with two eyes.
    Use simple, fun, and encouraging language. 
    Keep it to exactly one short, memorable sentence.`,
  });
  return response.text;
};

export const generateQuizQuestions = async (letters: string[]): Promise<QuizQuestion[]> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate 5 extremely simple quiz questions for children learning Arabic. 
    Focus on these letters: ${letters.join(', ')}.
    The 'question' field should be just the name of the letter in capital letters (e.g., "ALIF" or "BA").
    The 'options' should be 4 Arabic characters.
    The 'correctAnswer' must be the character corresponding to the name in 'question'.
    The 'letter' field should be the name of the letter for TTS purposes.
    Format as JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING, description: "Just the letter name, e.g. 'BA'" },
            options: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            correctAnswer: { type: Type.STRING },
            letter: { type: Type.STRING }
          },
          required: ["question", "options", "correctAnswer", "letter"]
        }
      }
    }
  });
  
  try {
    const jsonStr = response.text || '[]';
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("Failed to parse quiz response", e);
    return [];
  }
};