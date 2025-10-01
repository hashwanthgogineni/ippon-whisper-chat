import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Bot } from "lucide-react";

interface WhisperBotProps {
  onClose: () => void;
}

export const WhisperBot: React.FC<WhisperBotProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<
    { from: "user" | "bot"; text: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const HF_API_URL = "https://router.huggingface.co/v1/chat/completions";
  const HF_API_KEY = import.meta.env.VITE_HF_API_KEY;

  // 🔹 Query DeepSeek
  const queryDeepSeek = async (userMessage: string) => {
    const response = await fetch(HF_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek-ai/DeepSeek-R1:novita",
        messages: [
          {
            role: "system",
            content: `You are WhisperBot. 
Always reply in a witty, concise way. 
Do not include <think> or explanations. 
Just return the final witty response.`,
          },
          { role: "user", content: userMessage },
        ],
        max_tokens: 120,
        temperature: 0.8,
      }),
    });

    if (!response.ok) throw new Error(`DeepSeek API returned ${response.status}`);
    const data = await response.json();
    let reply = data.choices?.[0]?.message?.content?.trim() || "⚠️ No response from DeepSeek.";

    reply = reply
      .replace(/<think>[\s\S]*?<\/think>/gi, "")
      .replace(/^Okay.*?(response\.)?/i, "")
      .trim();

    return reply;
  };

  // 🔹 Local fallback
  const generateLocalResponse = (userMessage: string) => {
    const templates = [
      `Sorry... I am Offline`,
    ];
    return templates[Math.floor(Math.random() * templates.length)];
  };

  // 🔹 Handle send
  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    setMessages((prev) => [...prev, { from: "user", text: trimmed }]);
    const userMessage = trimmed;
    setInput("");
    setLoading(true);

    let reply = "";
    try {
      reply = await queryDeepSeek(userMessage);
    } catch (err) {
      console.error("DeepSeek call failed:", err);
      reply = generateLocalResponse(userMessage);
    }

    setMessages((prev) => [...prev, { from: "bot", text: reply }]);
    setLoading(false);
  };

  return (
    <div className="fixed bottom-20 right-5 w-80 z-50">
      <Card className="shadow-lg rounded-xl overflow-hidden border border-white/20 bg-background/70 backdrop-blur-md">
        {/* Header */}
        <div className="flex justify-between items-center p-3 bg-primary text-primary-foreground">
          <span className="flex items-center gap-2 font-semibold">
            <Bot className="h-4 w-4" /> Whisper Witty Bot
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0 text-primary-foreground hover:bg-primary/50"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Messages */}
        <CardContent className="p-3">
          <div className="h-40 overflow-y-auto mb-3 border rounded-md p-2 bg-muted/20 text-sm">
            {messages.length === 0 ? (
              <p className="text-muted-foreground text-center">
                Ask me anything… it is always has a witty take! ✨
              </p>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className={`mb-2`}>
                  <span className="font-medium">
                    {msg.from === "user" ? "You" : "Whisper Witty Bot"}:
                  </span>{" "}
                  {msg.text}
                </div>
              ))
            )}
            {loading && <p className="text-muted-foreground">Thinking...</p>}
          </div>

          {/* Input */}
          <div className="flex space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type here..."
              className="flex-1 bg-background text-foreground"
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <Button onClick={handleSend} disabled={loading || !input.trim()}>
              {loading ? "..." : "Go"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
