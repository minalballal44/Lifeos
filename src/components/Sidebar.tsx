"use client";

import { motion } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { getXPProgress, getLevelFromXP } from "@/lib/utils";
import Logo from "./Logo";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: "🏠" },
  { id: "tasks", label: "Tasks", icon: "✅" },
  { id: "goals", label: "Goals", icon: "🎯" },
  { id: "habits", label: "Habits", icon: "🔥" },
  { id: "journal", label: "Journal", icon: "📝" },
  { id: "mood", label: "Mood", icon: "😊" },
  { id: "focus", label: "Focus", icon: "🎧" },
  { id: "notes", label: "Knowledge", icon: "💡" },
  { id: "analytics", label: "Analytics", icon: "📊" },
  { id: "planner", label: "Planner", icon: "📅" },
];

interface SidebarProps {
  xp?: number;
  onOpenAICoach?: () => void;
  onOpenProfile?: () => void;
}

export default function Sidebar({ xp = 0, onOpenAICoach, onOpenProfile }: SidebarProps) {
  const { activeView, setActiveView, theme, toggleTheme, sidebarOpen, setSidebarOpen, userName } =
    useAppStore();
  const isDark = theme === "dark";
  const level = getLevelFromXP(xp);
  const progress = getXPProgress(xp);

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <motion.aside
        initial={false}
        animate={{ x: sidebarOpen ? 0 : -280 }}
        className={`fixed md:relative z-50 h-full w-[260px] flex flex-col border-r transition-colors duration-300 ${
          isDark
            ? "bg-[#0A0A0F] border-white/5"
            : "bg-white border-zinc-200"
        }`}
      >
        {/* Logo */}
        <div className="p-4">
          <Logo size="md" />
        </div>

        {/* Level card */}
        <div className={`mx-3 mb-3 p-3 rounded-xl ${isDark ? "bg-white/5" : "bg-zinc-50"}`}>
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <span className="text-lg">⭐</span>
              <span className="text-sm font-semibold">Level {level}</span>
            </div>
            <span className={`text-xs ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>{xp} XP</span>
          </div>
          <div className={`h-2 rounded-full ${isDark ? "bg-white/10" : "bg-zinc-200"}`}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full rounded-full bg-gradient-to-r from-purple-500 via-cyan-500 to-amber-500"
            />
          </div>
        </div>

        {/* AI Coach Button */}
        {onOpenAICoach && (
          <div className="mx-3 mb-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenAICoach}
              className="w-full p-3 rounded-xl bg-gradient-to-r from-purple-600/20 via-cyan-600/20 to-amber-500/20 border border-purple-500/20 flex items-center gap-3 group transition-all hover:border-purple-500/40"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                🤖
              </div>
              <div className="text-left">
                <div className="text-sm font-medium">AI Life Coach</div>
                <div className={`text-[10px] ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                  Get personalized help
                </div>
              </div>
              <div className="ml-auto">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              </div>
            </motion.button>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => (
            <motion.button
              key={item.id}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setActiveView(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                activeView === item.id
                  ? isDark
                    ? "bg-purple-500/15 text-purple-300"
                    : "bg-purple-50 text-purple-700"
                  : isDark
                  ? "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                  : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
              {activeView === item.id && (
                <motion.div
                  layoutId="activeNav"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-500"
                />
              )}
            </motion.button>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="p-3 space-y-1.5 border-t border-white/5">
          <button
            onClick={toggleTheme}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
              isDark
                ? "text-zinc-400 hover:bg-white/5"
                : "text-zinc-600 hover:bg-zinc-50"
            }`}
          >
            <span className="text-lg">{isDark ? "🌙" : "☀️"}</span>
            <span className="font-medium">{isDark ? "Dark Mode" : "Light Mode"}</span>
          </button>
          
          {/* Profile Button */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={onOpenProfile}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
              isDark
                ? "bg-white/5 hover:bg-white/10"
                : "bg-zinc-50 hover:bg-zinc-100"
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 via-cyan-500 to-amber-500 flex items-center justify-center text-white text-xs font-bold shadow-lg">
              {(userName || "U").charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 text-left">
              <div className="font-medium text-sm">{userName || "User"}</div>
              <div className={`text-[10px] ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                View Profile
              </div>
            </div>
            <svg className={`w-4 h-4 ${isDark ? "text-zinc-600" : "text-zinc-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>
      </motion.aside>
    </>
  );
}
