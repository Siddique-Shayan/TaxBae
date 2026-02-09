import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GoogleGenAI } from "@google/genai";

/* ---------------- SYSTEM PROMPT ---------------- */
const TAXBAE_SYSTEM_PROMPT = `
You are TaxBae, a professional Indian financial advisor.

You help users with:
- Income tax planning (India)
- Investments (PPF, ELSS, Mutual Funds, FD, NPS)
- Loans & EMIs
- Personal finance & budgeting

Rules:
- Be clear and structured
- Use simple language
- Assume Indian tax laws
- No legal disclaimers
- If unsure, say so honestly
- Keep answers concise and practical
`;

/* ---------------- GEMINI CLIENT ---------------- */
const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

async function askGemini(userMessage: string): Promise<string> {
  const prompt = `
${TAXBAE_SYSTEM_PROMPT}

User: ${userMessage}
Assistant:
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash", // ✅ free-tier friendly
    contents: prompt,
  });

  return response.text || "No response from AI";
}

/* ---------------- COMPONENT ---------------- */
export default function Chatbot() {
  const [messages, setMessages] = useState<
    { role: "user" | "bot"; text: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const quickQuestions = [
    "How can I save tax this year?",
    "Explain Section 80C benefits",
    "Should I choose old or new tax regime?",
    "When should I file my ITR?",
    "Best investment options for tax saving",
  ];

  const sendTypedMessage = async (text?: string) => {
    const userText = text ?? input;
    if (!userText.trim() || loading) return;

    setInput("");
    setLoading(true);

    // add user message
    setMessages((prev) => [...prev, { role: "user", text: userText }]);

    // add thinking placeholder
    setMessages((prev) => [...prev, { role: "bot", text: "Thinking..." }]);

    try {
      const reply = await askGemini(userText);

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "bot",
          text: reply,
        };
        return updated;
      });
    } catch (err) {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "bot",
          text: "⚠️ Something went wrong. Please try again.",
        };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-[calc(100vh-64px)] bg-background text-foreground">
      <div className="h-full max-w-7xl mx-auto px-6 py-6">
        <div className="h-full grid grid-cols-12 gap-6">

          {/* LEFT PANEL */}
          <aside className="col-span-12 md:col-span-3 bg-card border border-border rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-semibold">AI Tax Assistant</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Demo Mode • Gemini Free Tier
              </p>
            </div>

            <Button
              variant="outline"
              className="mt-6"
              onClick={() => setMessages([])}
            >
              New Chat
            </Button>
          </aside>

          {/* CHAT PANEL */}
          <section className="col-span-12 md:col-span-9 bg-card border border-border rounded-2xl flex flex-col overflow-hidden">

            {/* Messages */}
            <div className="flex-1 p-6 overflow-y-auto no-scrollbar space-y-4">

              {/* Welcome */}
              <div className="bg-muted/60 border border-border rounded-xl p-5">
                <h3 className="text-lg font-semibold mb-2">
                  ✨ Hello there! 👋 Welcome to TaxBae AI!
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  I can help you with:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Tax planning & savings 💰</li>
                  <li>• Investment guidance 📈</li>
                  <li>• ITR filing 📝</li>
                  <li>• Financial decisions 🎯</li>
                </ul>
              </div>

              {/* Messages */}
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={
                    msg.role === "user"
                      ? "ml-auto max-w-[70%] bg-blue-600 text-white p-3 rounded-lg"
                      : "max-w-[80%] bg-muted border border-border p-3 rounded-lg"
                  }
                >
                  {msg.text}
                </div>
              ))}

              {/* Quick Questions */}
              <div className="pt-4 flex flex-wrap gap-2">
                {quickQuestions.map((q) => (
                  <Button
                    key={q}
                    size="sm"
                    variant="outline"
                    className="rounded-full"
                    onClick={() => sendTypedMessage(q)}
                  >
                    {q}
                  </Button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="border-t border-border p-4 flex items-center gap-3 bg-background">
              <Input
                placeholder="Ask me about taxes, investments, or finance..."
                className="flex-1"
                value={input}
                disabled={loading}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendTypedMessage()}
              />
              <Button
                onClick={() => sendTypedMessage()}
                disabled={loading}
                className="px-6"
              >
                {loading ? "..." : "Send"}
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
