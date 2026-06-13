"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AICoachProps {
  isOpen: boolean;
  onClose: () => void;
}

const quickPrompts = [
  "I'm feeling unproductive today",
  "How do I build better habits?",
  "I can't focus on my tasks",
  "Help me set meaningful goals",
  "I'm feeling stressed and overwhelmed",
  "How to manage my time better?",
];

export default function AICoach({ isOpen, onClose }: AICoachProps) {
  const { theme, userName } = useAppStore();
  const isDark = theme === "dark";
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Hey ${userName || "there"}! 👋 I'm your AI Life Coach. I'm here to help you improve your life using LifeOS.\n\nTell me what's on your mind - whether it's productivity struggles, habit building, goal setting, or just feeling overwhelmed. I'll guide you to the right tools and strategies! 🚀`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = (userMessage: string): string => {
    const msg = userMessage.toLowerCase();

    // Productivity issues
    if (msg.includes("unproductive") || msg.includes("lazy") || msg.includes("procrastinat")) {
      return `I understand that feeling, ${userName || "friend"}. Productivity slumps happen to everyone! Here's what I suggest:\n\n🎯 **Start Small**: Go to the **Tasks** section and add just ONE small task you can complete in 5 minutes.\n\n🎧 **Use Focus Mode**: Try a 15-minute Pomodoro session in **Focus Mode**. Short bursts work better than long marathons!\n\n📊 **Track Your Wins**: Check your **Dashboard** to see your progress. Sometimes we forget how much we've actually accomplished!\n\n💡 **Pro Tip**: Break big tasks into smaller subtasks. Completing small tasks releases dopamine and builds momentum!\n\nWant me to help you plan your next productive session?`;
    }

    // Habit building
    if (msg.includes("habit") || msg.includes("routine") || msg.includes("consistent")) {
      return `Building habits is a game-changer! Here's the science-backed approach using LifeOS:\n\n🔥 **Start with Habits Section**: Add just 2-3 habits to track. Don't overwhelm yourself!\n\n📌 **The 2-Minute Rule**: Make habits so easy you can't say no. "Read 1 page" not "Read 30 minutes".\n\n🗓️ **Streak Power**: Your habit calendar shows your progress. Don't break the chain!\n\n⭐ **Stack Habits**: Link new habits to existing ones. "After I brush my teeth, I'll meditate for 2 minutes."\n\n🏆 **Celebrate Wins**: Each habit completion gives you XP. Watch your level grow!\n\n**Suggested habits to start:**\n• 💧 Drink water (8 glasses)\n• 📖 Read (10 mins)\n• 🧘 Meditate (5 mins)\n\nWhich habit do you want to build first?`;
    }

    // Focus issues
    if (msg.includes("focus") || msg.includes("distract") || msg.includes("concentrat") || msg.includes("attention")) {
      return `Focus is a skill that can be trained! Let me help you:\n\n🎧 **Focus Mode is Your Friend**: Head to **Focus Mode** and try the Pomodoro technique:\n• 25 mins work → 5 mins break\n• After 4 sessions → 15 mins break\n\n🌊 **Ambient Sounds**: Use the ambient sounds (Rain, Ocean, Café) to create a focus environment.\n\n📵 **Remove Distractions**: Before starting:\n• Put phone on silent\n• Close unnecessary tabs\n• Tell others you're focusing\n\n🎯 **Single-Task**: Pick ONE task from your **Tasks** list. Multitasking is a myth!\n\n⏰ **Time-Block**: Use the **Planner** to schedule focused work blocks.\n\n💡 **Quick Win**: Start with just a 15-minute focus session. Build up gradually!\n\nReady to try a focus session right now?`;
    }

    // Goals
    if (msg.includes("goal") || msg.includes("dream") || msg.includes("achieve") || msg.includes("ambition")) {
      return `Setting meaningful goals is the foundation of success! Here's how LifeOS helps:\n\n🎯 **Goals Section**: You can set goals for different timeframes:\n• 📅 Weekly goals (quick wins)\n• 📆 Monthly goals (building momentum)\n• 🗓️ Quarterly goals (major milestones)\n• 🎯 Yearly goals (big achievements)\n• 🚀 3-5 Year goals (life vision)\n\n✍️ **SMART Goals**: Make them:\n• **S**pecific - Clear and defined\n• **M**easurable - Track progress with %\n• **A**chievable - Challenging but realistic\n• **R**elevant - Aligned with your values\n• **T**ime-bound - Has a deadline\n\n📊 **Track Progress**: Use the +/- buttons to update progress as you work!\n\n🏆 **Celebrate Milestones**: Each completed goal earns you 50 XP!\n\n**Example Goal Breakdown:**\n"Get fit" → "Exercise 3x/week for 30 mins" → Track in Habits!\n\nWhat's one goal you want to set right now?`;
    }

    // Stress & overwhelm
    if (msg.includes("stress") || msg.includes("overwhelm") || msg.includes("anxious") || msg.includes("anxiety") || msg.includes("worried")) {
      return `I hear you. Feeling overwhelmed is tough, but you're not alone. Let's work through this together:\n\n😊 **Log Your Mood**: Go to **Mood Tracker** and log how you're feeling. Awareness is the first step.\n\n📝 **Journal It Out**: Open **Journal** and write freely. Try the "Reflection" or "Gratitude" journal types.\n\n🧘 **Breathe**: Try this right now:\n• Breathe in for 4 seconds\n• Hold for 4 seconds\n• Breathe out for 6 seconds\n• Repeat 5 times\n\n📋 **Brain Dump**: Go to **Tasks** and dump everything on your mind. Getting it out of your head helps!\n\n🎯 **Pick Just One**: From your tasks, choose ONE thing to focus on. Everything else can wait.\n\n🙏 **Gratitude Practice**: Write 3 things you're grateful for in your **Gratitude Journal**.\n\n💜 **Remember**: It's okay to not be okay. Progress, not perfection.\n\nWant to talk more about what's bothering you?`;
    }

    // Time management
    if (msg.includes("time") || msg.includes("busy") || msg.includes("schedule") || msg.includes("plan")) {
      return `Time management is about priorities, not squeezing more in! Here's your LifeOS strategy:\n\n📅 **Daily Planner**: Use the **Planner** to time-block your day:\n• Morning: High-priority deep work\n• Afternoon: Meetings & collaboration\n• Evening: Light tasks & wind down\n\n✅ **Task Priorities**: In **Tasks**, mark priorities:\n• 🔴 Urgent - Do first\n• 🟠 High - Do today\n• 🟡 Medium - Do this week\n• 🟢 Low - Can wait\n\n⏰ **Time Boxing**: Allocate specific time slots for tasks. When time's up, move on!\n\n🚫 **Learn to Say No**: Not everything deserves your time.\n\n📊 **Weekly Review**: Check **Analytics** every Sunday to see where your time went.\n\n💡 **The 2-Minute Rule**: If it takes less than 2 minutes, do it now!\n\n**Morning Routine Suggestion:**\n1. Review today's plan (5 mins)\n2. Top 3 priorities (identify)\n3. First task (start immediately)\n\nWant help planning your day?`;
    }

    // Motivation
    if (msg.includes("motivat") || msg.includes("inspir") || msg.includes("give up") || msg.includes("quit")) {
      return `Motivation comes and goes, but systems last! Here's the truth:\n\n🔥 **Discipline > Motivation**: Build habits in the **Habits** section. They work even when motivation doesn't.\n\n🏆 **Celebrate Small Wins**: Check your **Dashboard** - look at all your completed tasks and streaks!\n\n⭐ **XP System**: You're already earning XP! Keep going to level up. You're at Level ${Math.floor(Math.random() * 5) + 1}!\n\n📈 **Progress Photos**: Check **Analytics** to see how far you've come.\n\n📝 **Success Journal**: Write about wins in your **Success Journal**. Reading past wins boosts motivation!\n\n🎯 **Remember Your Why**: Go to **Goals** and look at your long-term vision. Why did you start?\n\n💪 **Motivational Truth**:\n"You don't have to be motivated to start. But starting creates motivation."\n\n🌟 **Action Step**: Right now, complete just ONE small task. The momentum will follow!\n\nWhat's one small thing you can do in the next 5 minutes?`;
    }

    // Learning & Skills
    if (msg.includes("learn") || msg.includes("skill") || msg.includes("study") || msg.includes("course")) {
      return `Learning is a superpower! Here's how to use LifeOS for growth:\n\n💡 **Knowledge Vault**: Save everything you learn in the **Knowledge** section:\n• 📝 Notes from courses\n• 💡 Ideas & insights\n• 📖 Book summaries\n• 🔗 Useful resources\n\n📚 **Study Habits**: Add learning habits:\n• "Study 30 mins daily"\n• "Read 10 pages"\n• "Practice skill 1 hour"\n\n🎯 **Learning Goals**: Set specific goals:\n• "Complete Python course by March"\n• "Read 12 books this year"\n\n🎧 **Deep Learning**: Use **Focus Mode** for distraction-free study sessions.\n\n📝 **Teach to Learn**: Write what you learned in your **Reflection Journal**.\n\n💡 **Spaced Repetition**: Review your **Knowledge Vault** notes regularly!\n\nWhat skill are you excited to learn?`;
    }

    // Default response
    return `Thanks for sharing that with me! 💜\n\nBased on what you said, here's how LifeOS can help:\n\n📋 **Tasks**: Break down what you need to do into actionable items\n\n🎯 **Goals**: Set clear targets to work towards\n\n🔥 **Habits**: Build daily routines that support your objectives\n\n📝 **Journal**: Process your thoughts and reflect on your journey\n\n😊 **Mood**: Track your emotional patterns\n\n🎧 **Focus**: Get into deep work mode\n\n📊 **Analytics**: See your progress over time\n\n**Quick tip**: Start with just ONE area. Master it, then expand!\n\nTell me more specifically what's on your mind, and I'll give you a personalized action plan! 🚀`;
  };

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI thinking
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));

    const response = generateResponse(content);
    
    const assistantMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: response,
      timestamp: new Date(),
    };

    setIsTyping(false);
    setMessages((prev) => [...prev, assistantMsg]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Chat Window */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`fixed bottom-4 right-4 md:bottom-6 md:right-6 w-[calc(100%-2rem)] md:w-[440px] h-[600px] max-h-[80vh] rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden ${
              isDark
                ? "bg-[#0F0F14] border border-white/10"
                : "bg-white border border-zinc-200"
            }`}
          >
            {/* Header */}
            <div className="p-4 border-b border-white/5 flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 via-cyan-600 to-amber-500 flex items-center justify-center">
                  <span className="text-2xl">🤖</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#0F0F14]" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">AI Life Coach</h3>
                <p className={`text-xs ${isDark ? "text-green-400" : "text-green-600"}`}>
                  Online • Ready to help
                </p>
              </div>
              <button
                onClick={onClose}
                className={`p-2 rounded-xl transition-colors ${
                  isDark ? "hover:bg-white/5 text-zinc-400" : "hover:bg-zinc-100 text-zinc-600"
                }`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white"
                        : isDark
                        ? "bg-white/5 text-zinc-200"
                        : "bg-zinc-100 text-zinc-800"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className={`rounded-2xl px-4 py-3 ${isDark ? "bg-white/5" : "bg-zinc-100"}`}>
                    <div className="flex gap-1">
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                        className="w-2 h-2 rounded-full bg-purple-500"
                      />
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                        className="w-2 h-2 rounded-full bg-cyan-500"
                      />
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                        className="w-2 h-2 rounded-full bg-amber-500"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick prompts */}
            {messages.length <= 2 && (
              <div className="px-4 pb-2">
                <p className={`text-xs mb-2 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                  Quick topics:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {quickPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => sendMessage(prompt)}
                      className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                        isDark
                          ? "bg-white/5 text-zinc-300 hover:bg-white/10"
                          : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                      }`}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-white/5">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                  placeholder="Tell me what's on your mind..."
                  className={`flex-1 px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 ${
                    isDark
                      ? "bg-white/5 border-white/10 text-white placeholder-zinc-500"
                      : "bg-zinc-50 border-zinc-200 placeholder-zinc-400"
                  }`}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || isTyping}
                  className="px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white disabled:opacity-50"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
