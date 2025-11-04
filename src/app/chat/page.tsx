                                                                                                                                                                             "use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeftIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { BookOpenIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/components/AuthContext";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { AnimatedButton } from "@/components/ui/animated-button";
import { AIInputWithLoading } from "@/components/ui/ai-input-with-loading";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatPage() {
  const router = useRouter();
  const { user, isGuest } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hey there! 👋 I'm NCERT Cool Tutor, your super fun AI study buddy! 🚀✨\n\nI'm here to make learning absolutely awesome! Whether you're struggling with a tough concept, need help with NCERT topics (Classes 6-12), want some killer study tips, or just want to chat about your subjects - I've got you covered! 😎\n\nI explain things in a fun, easy way with real examples. Think of me as your cool teacher friend who makes everything click! 🎯\n\nSo, what would you like to learn today? Fire away with any question! 💪"
    }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(userMessage: string) {
    if (!userMessage.trim() || loading) return;

    const trimmedMessage = userMessage.trim();
    setMessages(prev => [...prev, { role: "user", content: trimmedMessage }]);
    setLoading(true);

    try {
      const conversationHistory = messages
        .filter(m => !(m.role === "assistant" && m.content.includes("Hey there! 👋")))
        .slice(-6)
        .map(m => ({
          role: m.role,
          content: m.content
        }));

      console.log("[Chat Frontend] Sending message:", trimmedMessage);
      console.log("[Chat Frontend] History being sent:", conversationHistory.length, "messages");
      
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmedMessage,
          conversationHistory: conversationHistory
        })
      });

      const data = await response.json();
      
      console.log("[Chat Frontend] Response status:", response.status);
      console.log("[Chat Frontend] Response data:", data);

      if (!response.ok) {
        console.error("[Chat Frontend] API error:", data);
        throw new Error(data.error || "Failed to get response");
      }

      if (data.response && typeof data.response === "string" && data.response.trim().length > 0) {
        console.log("[Chat Frontend] ✅ Got valid response:", data.response.substring(0, 50));
        setMessages(prev => [...prev, { role: "assistant", content: data.response }]);
      } else {
        console.error("[Chat Frontend] ❌ Invalid response:", data);
        throw new Error("No valid response from API");
      }
    } catch (error: any) {
      console.error("[Chat Frontend] Error:", error);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Oops! 😅 Something went wrong there. But hey, don't worry - I'm still here! Want to try asking me again? Or maybe we can chat about something else? Make sure your GEMINI_API_KEY is set in .env.local and check the server console for errors! 💬"
      }]);
    } finally {
      setLoading(false);
    }
  }

  const userName = user?.name || (isGuest ? 'Guest User' : 'User');
  const userLabel = isGuest ? '(Guest)' : '';

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 flex flex-col relative">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-50">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4"
        >
          <div className="flex items-center gap-4">
            <AnimatedButton
              onClick={() => router.back()}
              animation="slideOut"
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex-shrink-0"
            >
              <ArrowLeftIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 dark:text-gray-300" />
            </AnimatedButton>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 flex-1"
            >
              <motion.div
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-violet-400 to-cyan-300 flex items-center justify-center"
              >
                <SparklesIcon className="w-6 h-6 sm:w-7 sm:h-7 text-gray-900 dark:text-white" />
              </motion.div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">NCERT Cool Tutor</h1>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Your awesome study buddy! 😎</p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <ThemeToggle />
            </motion.div>
          </div>
        </motion.div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-800 p-4 sm:p-6 relative">
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 relative">
          <AnimatePresence>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className={`flex gap-3 sm:gap-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", delay: idx * 0.1 }}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-violet-400 to-cyan-300 flex items-center justify-center flex-shrink-0"
                  >
                    <SparklesIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-900 dark:text-white" />
                  </motion.div>
                )}
                <motion.div
                  initial={{ opacity: 0, x: msg.role === "user" ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3 sm:p-4 ${
                    msg.role === "user"
                      ? "bg-gray-900 dark:bg-blue-600 text-white dark:text-white border border-gray-800 dark:border-blue-500 shadow-sm"
                      : "bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 shadow-sm"
                  }`}
                >
                  <p className={`text-sm sm:text-base leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "text-white dark:text-white"
                      : "text-gray-900 dark:text-white"
                  }`}>{msg.content}</p>
                </motion.div>
                {msg.role === "user" && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: idx * 0.1 }}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center flex-shrink-0 border border-gray-300 dark:border-gray-500"
                  >
                    <span className="text-sm sm:text-base font-bold text-gray-700 dark:text-gray-300">
                      {(user?.name || (isGuest ? "Guest" : "You"))[0].toUpperCase()}
                    </span>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3 sm:gap-4 justify-start"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-violet-400 to-cyan-300 flex items-center justify-center flex-shrink-0"
              >
                <SparklesIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-900 dark:text-white" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl p-3 sm:p-4 shadow-sm"
              >
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                      className="w-2 h-2 bg-gray-400 dark:bg-gray-300 rounded-full"
                    />
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <AIInputWithLoading
          placeholder="Ask me anything about your studies! 😊"
          onSubmit={handleSend}
          loadingDuration={3000}
          minHeight={56}
          maxHeight={200}
          isLoading={loading}
          onLoadingChange={setLoading}
          className="px-4 sm:px-6"
        />
      </div>
    </main>
  );
}