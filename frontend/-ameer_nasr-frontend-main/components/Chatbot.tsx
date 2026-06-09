"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, X, Instagram, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { BsMessenger, BsWhatsapp } from "react-icons/bs";
import { SiLivechat } from "react-icons/si";
import { onChatOpen } from "@/lib/chatEvents";

type ChatMessage = {
  id: string;
  role: "user" | "bot";
  content: string;
  createdAt: Date;
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  // Open the chat panel when any other component fires
  // `openChat()` (e.g. the GetInTouch "Chat Now!" tile).
  useEffect(() => onChatOpen(() => setIsOpen(true)), []);

  async function handleSend() {
    if (!input.trim()) return;
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: input,
      createdAt: new Date(),
    };
    setMessages((p) => [...p, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.content }),
      });
      const data = await res.json();
      const botMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "bot",
        content: data.reply || "Sorry, I didn't understand that.",
        createdAt: new Date(),
      };
      setMessages((p) => [...p, botMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Floating AI Assistant Button with the Figma "Questions? Chat
          with us!" pill anchored to its left so it reads as a single
          unit on desktop. The pill collapses on phones (<sm) to keep
          the corner clean. */}
      {!isOpen && (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center rounded-full bg-white shadow-md ring-1 ring-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors"
            aria-label="Questions? Chat with us"
          >
            Questions? <span className="text-emerald-600 ml-1">Chat with us!</span>
          </button>
          <Button
            size="icon"
            onClick={() => setIsOpen(true)}
            className="rounded-full w-14 h-14 shadow-lg bg-gradient-to-br from-primary-500 to-emerald-500 hover:from-primary-600 hover:to-emerald-600"
            aria-label="Open AI assistant"
          >
            <Sparkles className="w-6 h-6 text-white" aria-hidden />
          </Button>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-80 h-[480px] bg-white border-gray-100 flex flex-col shadow-2xl border rounded-2xl overflow-hidden">
          <CardHeader className="flex items-center justify-between py-3 border-b bg-primary-500">
            <h4 className="font-semibold text-sm text-white">
              Questions? Chat with us!
            </h4>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea ref={scrollRef} className="flex-1 p-3">
              <div className="space-y-3">
                {messages.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center mt-20">
                    👋 Hi! How can I help you today?
                  </p>
                )}
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={cn(
                      "flex",
                      m.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "px-3 py-2 rounded-xl text-sm max-w-[80%]",
                        m.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      )}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <p className="text-xs text-muted-foreground">Thinking...</p>
                )}
              </div>
            </ScrollArea>

            <div className="flex items-center gap-2 border-t p-2">
              <Input
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="text-sm"
              />
              <Button
                size="icon"
                disabled={loading || !input.trim()}
                onClick={handleSend}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
                <div className="flex gap-0.5 justify-between px-4 py-4 ">
                  <span>
                  <BsWhatsapp className="w-6 h-6 text-[#22a628] cursor-pointer" />
                  </span>
                  <span>
                  <BsMessenger className="w-6 h-6 text-blue-500 cursor-pointer" />
                  </span>
                  <span>
                 <Instagram className="w-6 h-6 bg-[linear-gradient(to_right,#405de6,#833ab4,#c13584,#e1306c)] cursor-pointer text-white" />
                  </span>
                  <span>
                 <SiLivechat className="w-6 h-6 cursor-pointer" />
                  </span>
                  <span>
                  <Mail className="w-6 h-6 cursor-pointer" />
                  </span>
                  <span>
                  <Phone className="w-6 h-6 cursor-pointer" />
                  </span>
                 
                </div>
        </div>
      )}
    </div>
  );
}
