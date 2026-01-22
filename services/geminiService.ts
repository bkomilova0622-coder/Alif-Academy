import { GoogleGenAI, Type, Modality } from "@google/genai";
import { QuizQuestion } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateMnemonic = async (letterName: string, letterChar: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a short, fun, and memorable mnemonic story for a kid to remember the Arabic letter "${letterChar}" (${letterName}). Keep it under 2 sentences and very friendly.`,
  });
  return response.text;
};

export const generateSpeech = async (text: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });
  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
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