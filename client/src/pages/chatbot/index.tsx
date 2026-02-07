import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Chatbot() {
  const [messages, setMessages] = useState<
    { role: "user" | "bot"; text: string }[]
  >([]);
  const [input, setInput] = useState("");

  const quickAnswers: Record<string, string> = {
    "How can I save tax this year?":
      "You can save tax using Section 80C (₹1.5L), ELSS funds, PPF, NPS additional ₹50,000 under 80CCD(1B), health insurance under 80D, and home loan deductions under 24B and 80EE/80EEA.",
    "Explain Section 80C benefits":
      "Section 80C allows deductions up to ₹1.5L for investments like ELSS, PPF, EPF, life insurance premiums, home loan principal, Sukanya Samriddhi Yojana, and tax-saving FDs.",
    "Should I choose old or new tax regime?":
      "Choose the old regime if you claim many deductions. Choose the new regime if deductions are low — it offers lower tax slabs.",
    "When should I file my ITR?":
      "For most individuals, the ITR filing deadline is 31st July. If audit applies, it is 31st October.",
    "Best investment options for tax saving":
      "ELSS mutual funds, PPF, NPS, tax-saving FDs, and life insurance are the best tax-saving options.",
  };

  const sendMessage = (msg: string) => {
    setMessages((prev) => [...prev, { role: "user", text: msg }]);
    if (quickAnswers[msg]) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: quickAnswers[msg] },
      ]);
    }
  };

  const sendTypedMessage = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  const quickQuestions = Object.keys(quickAnswers);

  return (
    <div className="w-full h-[calc(100vh-64px)] bg-background text-foreground">
      {/* Page Container */}
      <div className="h-full max-w-7xl mx-auto px-6 py-6">
        <div className="h-full grid grid-cols-12 gap-6">

          {/* ---------------- LEFT PANEL ---------------- */}
          <aside className="col-span-12 md:col-span-3 bg-card border border-border rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-semibold">AI Tax Assistant</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Connected • RAG Powered
              </p>
            </div>

            <Button variant="outline" className="mt-6">
              New Chat
            </Button>
          </aside>

          {/* ---------------- CHAT PANEL ---------------- */}
          <section className="col-span-12 md:col-span-9 bg-card border border-border rounded-2xl flex flex-col overflow-hidden">

            {/* Messages */}
            <div className="flex-1 p-6 overflow-y-auto no-scrollbar space-y-4">

              {/* Welcome Card */}
              <div className="bg-muted/60 border border-border rounded-xl p-5">
                <h3 className="text-lg font-semibold mb-2">
                  ✨ Hello there! 👋 Welcome to TaxBae AI!
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  I'm here to help you with:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Tax planning & saving strategies 💰</li>
                  <li>• Investment guidance 📈</li>
                  <li>• ITR filing assistance 📝</li>
                  <li>• Section-wise deduction explanations 📚</li>
                  <li>• Personalized financial advice 🎯</li>
                </ul>
              </div>

              {/* Chat Messages */}
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
                    onClick={() => sendMessage(q)}
                  >
                    {q}
                  </Button>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="border-t border-border p-4 flex items-center gap-3 bg-background">
              <Input
                placeholder="Ask me about taxes, investments, or financial planning..."
                className="flex-1"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendTypedMessage()}
              />
              <Button onClick={sendTypedMessage} className="px-6">
                Send
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
