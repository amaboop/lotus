
import { GoogleGenAI, Type } from "@google/genai";
import { SeedResponse, AnalysisResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getDailySeed = async (): Promise<SeedResponse> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: 'Generate a short, poetic, and mindful writing prompt for a daily ritual. Keep it under 20 words.',
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            prompt: { type: Type.STRING },
            theme: { type: Type.STRING }
          },
          required: ['prompt', 'theme']
        }
      }
    });

    return JSON.parse(response.text || '{"prompt": "Let the words flow like water.", "theme": "Serenity"}');
  } catch (error) {
    console.error("Error fetching daily seed:", error);
    return { prompt: "Reflect on a moment of quiet peace from your day.", theme: "Peace" };
  }
};

export const analyzeReflection = async (text: string): Promise<AnalysisResponse> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze this personal reflection and provide a one-sentence poetic summary and a single word representing the mood: "${text}"`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            mood: { type: Type.STRING }
          },
          required: ['summary', 'mood']
        }
      }
    });

    return JSON.parse(response.text || '{"summary": "A ripple in the pond of thought.", "mood": "Reflective"}');
  } catch (error) {
    console.error("Error analyzing reflection:", error);
    return { summary: "Words released to the water.", mood: "Quiet Contemplation" };
  }
};
