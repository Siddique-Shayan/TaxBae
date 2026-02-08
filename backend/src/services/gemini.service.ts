import { GoogleGenAI } from "@google/genai";
import { Env } from "../config/env.config";
import { TAXBAE_SYSTEM_PROMPT } from "./system-prompt";

const ai = new GoogleGenAI({
  apiKey: Env.GEMINI_API_KEY,
});

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export class GeminiService {
  static async generateReply(messages: ChatMessage[]): Promise<string> {
    try {
      // 🧠 Build a single contextual prompt (ChatGPT-style)
      const prompt = [
        TAXBAE_SYSTEM_PROMPT,
        ...messages.map(
          (m) =>
            `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`
        ),
        "Assistant:",
      ].join("\n");

      // ✅ Use the new SDK entry point
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const text = response.text?.trim();

      if (!text) {
        throw new Error("Empty response from Gemini");
      }

      return text;
    } catch (error: any) {
      console.error("Gemini Error:", {
        name: error?.name,
        message: error?.message,
        status: error?.status,
      });

      throw new Error("Failed to generate AI response");
    }
  }
}
