"use client";

import { motion } from "framer-motion";
import { useAppStore } from "@/lib/store";
import {
  getGreeting,
  getLevelFromXP,
  getXPProgress,
  moodEmojis,
} from "@/lib/utils";

interface DashboardProps {
  userId: string;
  onRefresh: () => void;
  stats: Record<string, unknown> | null;
  xp: number;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.3 },
  }),
};

export default function Dashboard({ stats, xp }: DashboardProps) {
  const { userName, theme, setActiveView } = useAppStore();
  const isDark = theme === "dark";
  const level = getLevelFromXP(xp);
  const progress = getXPProgress(xp);

  const statCards = [
    {
      label: "Productivity",
      value: `${(stats?.productivityScore as number) || 0}%`,
      icon: "⚡",
      gradient: "from-purple-600 to-purple-400",
      bg: isDark ? "bg-purple-500/10" : "bg-purple-50",
    },
    {
      label: "Tasks Done",
      value: `${(stats?.completedTasks as number) || 0}/${(stats?.totalTasks as number) || 0}`,
      icon: "✅",
      gradient: "from-green-600 to-green-400",
      bg: isDark ? "bg-green-500/10" : "bg-green-50",
    },
    {
      label: "Goals Progress",
      value: `${(stats?.goalProgress as number) || 0}%`,
      icon: "🎯",
      gradient: "from-amber-600 to-amber-400",
      bg: isDark ? "bg-amber-500/10" : "bg-amber-50",
    },
    {
      label: "Mood Score",
      value: `${(stats?.moodScore as number) || 0}%`,
      icon: "😊",
      gradient: "from-cyan-600 to-cyan-400",
      bg: isDark ? "bg-cyan-500/10" : "bg-cyan-50",
    },
    {
      label: "Focus Time",
      value: `${(stats?.totalFocusMinutes as number) || 0}m`,
      icon: "🎧",
      gradient: "from-pink-600 to-pink-400",
      bg: isDark ? "bg-pink-500/10" : "bg-pink-50",
    },
    {
      label: "Streaks",
      value: `${(stats?.totalStreaks as number) || 0}`,
      icon: "🔥",
      gradient: "from-orange-600 to-orange-400",
      bg: isDark ? "bg-orange-500/10" : "bg-orange-50",
    },
    {
      label: "Journals",
      value: `${(stats?.totalJournals as number) || 0}`,
      icon: "📝",
      gradient: "from-indigo-600 to-indigo-400",
      bg: isDark ? "bg-indigo-500/10" : "bg-indigo-50",
    },
    {
      label: "Weekly Done",
      value: `${(stats?.weeklyCompleted as number) || 0}`,
      icon: "📊",
      gradient: "from-teal-600 to-teal-400",
      bg: isDark ? "bg-teal-500/10" : "bg-teal-50",
    },
  ];

  const quickActions = [
    { label: "Add Task", icon: "✅", view: "tasks" },
    { label: "Set Goal", icon: "🎯", view: "goals" },
    { label: "Track Habit", icon: "🔥", view: "habits" },
    { label: "Write Journal", icon: "📝", view: "journal" },
    { label: "Log Mood", icon: "😊", view: "mood" },
    { label: "Start Focus", icon: "🎧", view: "focus" },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl p-6 md:p-8"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-cyan-600/20 to-amber-500/20 animate-gradient" />
        <div
          className={`absolute inset-0 ${
            isDark ? "bg-[#12121A]/80" : "bg-white/80"
          } backdrop-blur-sm`}
        />
        <div className="relative z-10">
          <h1 className="text-2xl md:text-4xl font-bold mb-1">
            {getGreeting()}, <span className="gradient-text">{userName}</span> 👋
          </h1>
          <p className={`${isDark ? "text-zinc-400" : "text-zinc-600"} mb-4`}>
            Ready to crush your goals today? Let&apos;s make it count.
          </p>
          <div className="flex items-center gap-4 flex-wrap">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
                isDark ? "bg-white/5" : "bg-zinc-100"
              }`}
            >
              <span>⭐</span>
              <span className="font-medium">Level {level}</span>
              <div className={`w-20 h-1.5 rounded-full ${isDark ? "bg-white/10" : "bg-zinc-200"}`}>
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs text-zinc-500">{xp} XP</span>
            </div>
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
                isDark ? "bg-white/5" : "bg-zinc-100"
              }`}
            >
              <span>🔥</span>
              <span className="font-medium">{(stats?.totalStreaks as number) || 0} day streak</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className={`p-4 rounded-2xl border transition-colors ${
              isDark
                ? "bg-white/[0.02] border-white/5 hover:bg-white/[0.05]"
                : "bg-white border-zinc-100 hover:bg-zinc-50 shadow-sm"
            }`}
          >
            <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center text-xl mb-3`}>
              {card.icon}
            </div>
            <div className="text-2xl font-bold mb-0.5">{card.value}</div>
            <div className={`text-xs ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
              {card.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className={`text-sm font-medium mb-3 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
          Quick Actions
        </h3>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {quickActions.map((action) => (
            <motion.button
              key={action.label}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveView(action.view)}
              className={`p-3 rounded-xl border text-center transition-all ${
                isDark
                  ? "bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-purple-500/30"
                  : "bg-white border-zinc-100 hover:bg-purple-50 hover:border-purple-200 shadow-sm"
              }`}
            >
              <div className="text-xl mb-1">{action.icon}</div>
              <div className="text-xs font-medium">{action.label}</div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Achievements preview */}
      <div
        className={`p-5 rounded-2xl border ${
          isDark
            ? "bg-white/[0.02] border-white/5"
            : "bg-white border-zinc-100 shadow-sm"
        }`}
      >
        <h3 className="font-semibold mb-3">🏆 Achievements</h3>
        <div className="flex flex-wrap gap-3">
          {[
            { icon: "🌟", title: "Getting Started", desc: "Created your account" },
            {
              icon: "📝",
              title: "First Task",
              desc: "Created your first task",
              locked: (stats?.totalTasks as number) === 0,
            },
            {
              icon: "🎯",
              title: "Goal Setter",
              desc: "Set your first goal",
              locked: (stats?.totalGoals as number) === 0,
            },
            {
              icon: "🔥",
              title: "Streak Master",
              desc: "7 day streak",
              locked: ((stats?.totalStreaks as number) || 0) < 7,
            },
            {
              icon: "⚡",
              title: "Productivity Pro",
              desc: "Score 80%+",
              locked: ((stats?.productivityScore as number) || 0) < 80,
            },
          ].map((ach) => (
            <div
              key={ach.title}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm ${
                ach.locked
                  ? isDark
                    ? "bg-white/[0.02] text-zinc-600"
                    : "bg-zinc-50 text-zinc-400"
                  : isDark
                  ? "bg-purple-500/10 text-purple-300"
                  : "bg-purple-50 text-purple-700"
              }`}
            >
              <span className={`text-lg ${ach.locked ? "grayscale opacity-40" : ""}`}>
                {ach.icon}
              </span>
              <div>
                <div className="font-medium text-xs">{ach.title}</div>
                <div className="text-[10px] opacity-60">{ach.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
