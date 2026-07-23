"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { X, Send } from "lucide-react";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";

export interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatResponse {
  reply?: string;
  error?: string;
  message?: string;
}

export function ChatWindow({ isOpen, onClose }: ChatWindowProps) {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!inputValue.trim() || isLoading) {
      return;
    }

    const userText = inputValue.trim();

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: userText,
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInputValue("");
    setIsLoading(true);
    setError("");

    try {
      console.log("[CHAT] Sending:", updatedMessages);

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      });

      let data: ChatResponse = {};

      try {
        data = await response.json();
      } catch (e) {
        console.error("JSON parse error:", e);
        throw new Error("Invalid server response");
      }

      console.log("[CHAT] Server response:", data);

      if (!response.ok) {
        throw new Error(data?.error ?? data?.message ?? `Server error ${response.status}`);
      }

      if (!data.reply) {
        throw new Error("No AI reply received");
      }

      const aiMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.reply,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: unknown) {
      console.error("[CHAT ERROR]", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-24 right-6 w-[360px] max-h-[500px] bg-[#F7E8E1]/95 rounded-3xl shadow-2xl overflow-hidden z-50"
          >
            <div className="bg-gradient-to-r from-[#A97D67] to-[#E9CFC3] px-6 py-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-white font-semibold text-lg">Her</h3>
                  <p className="text-white/80 text-xs">Your companion for every first.</p>
                </div>
                <button onClick={onClose}>
                  <X className="text-white w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="h-[380px] overflow-y-auto p-4">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg.content} isUser={msg.role === "user"} />
              ))}
              {isLoading && <TypingIndicator />}
              {error && (
                <div className="text-red-500 text-sm text-center py-2">{error}</div>
              )}
              <div ref={bottomRef} />
            </div>

            <div className="border-t border-[#E9CFC3]/50 p-4">
              <div className="flex gap-2">
                <input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything..."
                  disabled={isLoading}
                  className="flex-1 bg-white/70 rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !inputValue.trim()}
                  className="w-10 h-10 bg-[#A97D67] rounded-xl flex items-center justify-center text-white disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
