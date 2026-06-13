"use client";

import { motion } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { moodEmojis } from "@/lib/utils";

interface AnalyticsViewProps {
  userId: string;
  onRefresh: () => void;
  stats: Record<string, unknown> | null;
}

export default function AnalyticsView({ stats }: AnalyticsViewProps) {
  const { theme } = useAppStore();
  const isDark = theme === "dark";

  const productivityScore = (stats?.productivityScore as number) || 0;
  const moodScore = (stats?.moodScore as number) || 0;
  const recentMoods = (stats?.recentMoods as Array<{ mood: string; date: string }>) || [];

  const chartData = [
    { label: "Tasks", value: productivityScore, color: "#8B5CF6", icon: "✅" },
    { label: "Goals", value: (stats?.goalProgress as number) || 0, color: "#06B6D4", icon: "🎯" },
    { label: "Mood", value: moodScore, color: "#22c55e", icon: "😊" },
    {
      label: "Habits",
      value:
        (stats?.totalHabits as number) && (stats?.totalStreaks as number)
          ? Math.min(100, Math.round(((stats?.totalStreaks as number) / ((stats?.totalHabits as number) * 7)) * 100))
          : 0,
      color: "#F59E0B",
      icon: "🔥",
    },
  ];

  const lifeAreas = [
    { label: "Productivity", score: productivityScore, color: "#8B5CF6" },
    { label: "Mental Health", score: moodScore, color: "#22c55e" },
    { label: "Learning", score: Math.min(100, ((stats?.totalJournals as number) || 0) * 10), color: "#06B6D4" },
    { label: "Focus", score: Math.min(100, Math.round(((stats?.totalFocusMinutes as number) || 0) / 60 * 10)), color: "#F59E0B" },
    { label: "Consistency", score: Math.min(100, ((stats?.totalStreaks as number) || 0) * 14), color: "#EF4444" },
    { label: "Growth", score: Math.round((productivityScore + moodScore) / 2), color: "#EC4899" },
  ];

  const overallScore = Math.round(
    lifeAreas.reduce((s, a) => s + a.score, 0) / lifeAreas.length
  );

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold">📊 Analytics Center</h2>
        <p className={`text-sm ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
          Track your progress across all areas of life
        </p>
      </div>

      {/* Overall score */}
      <div
        className={`p-8 rounded-3xl border text-center relative overflow-hidden ${
          isDark ? "bg-white/[0.02] border-white/5" : "bg-white border-zinc-100 shadow-sm"
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-cyan-600/5 to-amber-500/5" />
        <div className="relative z-10">
          <h3 className={`text-sm font-medium mb-4 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
            Life Improvement Score
          </h3>
          <div className="relative w-36 h-36 mx-auto mb-4">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}
                strokeWidth="8"
              />
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 52}`}
                strokeDashoffset={`${2 * Math.PI * 52 * (1 - overallScore / 100)}`}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold">{overallScore}</span>
              <span className={`text-xs ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                / 100
              </span>
            </div>
          </div>
          <p className={`text-sm ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
            {overallScore >= 80
              ? "🌟 You're crushing it!"
              : overallScore >= 60
              ? "💪 Great progress! Keep it up!"
              : overallScore >= 40
              ? "📈 Building momentum!"
              : "🚀 Every journey starts with a step!"}
          </p>
        </div>
      </div>

      {/* Main metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {chartData.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-4 rounded-2xl border ${
              isDark ? "bg-white/[0.02] border-white/5" : "bg-white border-zinc-100 shadow-sm"
            }`}
          >
            <div className="text-xl mb-2">{item.icon}</div>
            <div className="text-2xl font-bold mb-1">{item.value}%</div>
            <div className={`text-xs ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
              {item.label}
            </div>
            <div className={`h-1.5 rounded-full mt-2 ${isDark ? "bg-white/5" : "bg-zinc-100"}`}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.value}%` }}
                transition={{ delay: i * 0.1 + 0.3 }}
                className="h-full rounded-full"
                style={{ backgroundColor: item.color }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Life areas */}
      <div
        className={`p-5 rounded-2xl border ${
          isDark ? "bg-white/[0.02] border-white/5" : "bg-white border-zinc-100 shadow-sm"
        }`}
      >
        <h3 className="font-semibold mb-4">Life Improvement Areas</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {lifeAreas.map((area, i) => (
            <motion.div
              key={area.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3"
            >
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{area.label}</span>
                  <span style={{ color: area.color }}>{area.score}%</span>
                </div>
                <div className={`h-2 rounded-full ${isDark ? "bg-white/5" : "bg-zinc-100"}`}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${area.score}%` }}
                    transition={{ delay: i * 0.05 + 0.3 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: area.color }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stats overview */}
      <div className="grid md:grid-cols-3 gap-3">
        {[
          { label: "Total Tasks", value: (stats?.totalTasks as number) || 0, icon: "📋" },
          { label: "Completed Tasks", value: (stats?.completedTasks as number) || 0, icon: "✅" },
          { label: "Total Goals", value: (stats?.totalGoals as number) || 0, icon: "🎯" },
          { label: "Goals Completed", value: (stats?.completedGoals as number) || 0, icon: "🏆" },
          { label: "Total Habits", value: (stats?.totalHabits as number) || 0, icon: "🔥" },
          { label: "Focus Minutes", value: (stats?.totalFocusMinutes as number) || 0, icon: "⏱️" },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`p-4 rounded-xl border flex items-center gap-3 ${
              isDark ? "bg-white/[0.02] border-white/5" : "bg-white border-zinc-100 shadow-sm"
            }`}
          >
            <span className="text-xl">{stat.icon}</span>
            <div>
              <div className="text-lg font-bold">{stat.value}</div>
              <div className={`text-xs ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mood trend */}
      {recentMoods.length > 0 && (
        <div
          className={`p-5 rounded-2xl border ${
            isDark ? "bg-white/[0.02] border-white/5" : "bg-white border-zinc-100 shadow-sm"
          }`}
        >
          <h3 className="font-semibold mb-3">Recent Mood Trend</h3>
          <div className="flex items-end gap-3 h-20 justify-center">
            {recentMoods.slice(0, 7).reverse().map((m, i) => {
              const moodValues: Record<string, number> = {
                great: 100,
                good: 80,
                okay: 60,
                sad: 40,
                stressed: 20,
              };
              const value = moodValues[m.mood] || 60;
              return (
                <div key={i} className="flex flex-col items-center gap-1">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${value}%` }}
                    transition={{ delay: i * 0.05 }}
                    className="w-8 rounded-t-lg"
                    style={{
                      backgroundColor:
                        m.mood === "great"
                          ? "#22c55e"
                          : m.mood === "good"
                          ? "#84cc16"
                          : m.mood === "okay"
                          ? "#eab308"
                          : m.mood === "sad"
                          ? "#f97316"
                          : "#ef4444",
                    }}
                  />
                  <span className="text-xs">{moodEmojis[m.mood]}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
