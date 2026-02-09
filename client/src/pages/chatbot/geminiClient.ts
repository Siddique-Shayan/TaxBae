import { GoogleGenAI } from "@google/genai";
import { TAXBAE_SYSTEM_PROMPT } from "./system-prompt";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey });

export async function askGemini(userMessage: string): Promise<string> {
  const prompt = `
${TAXBAE_SYSTEM_PROMPT}

User: ${userMessage}
Assistant:
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash", // ✅ works on free tier
    contents: prompt,
  });

  return response.text || "No response from Gemini";
}
