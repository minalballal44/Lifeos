"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";

interface HabitLog {
  id: string;
  date: string;
  completed: boolean;
}

interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  logs: HabitLog[];
}

interface HabitsViewProps {
  userId: string;
  onRefresh: () => void;
}

const habitPresets = [
  { name: "Exercise", icon: "💪", color: "#EF4444" },
  { name: "Reading", icon: "📖", color: "#3B82F6" },
  { name: "Meditation", icon: "🧘", color: "#8B5CF6" },
  { name: "Study", icon: "📚", color: "#F59E0B" },
  { name: "Water", icon: "💧", color: "#06B6D4" },
  { name: "Sleep", icon: "😴", color: "#6366F1" },
  { name: "Journal", icon: "📝", color: "#10B981" },
  { name: "Walk", icon: "🚶", color: "#F97316" },
];

export default function HabitsView({ userId, onRefresh }: HabitsViewProps) {
  const { theme } = useAppStore();
  const isDark = theme === "dark";
  const [habits, setHabits] = useState<Habit[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  const loadHabits = useCallback(async () => {
    try {
      const res = await fetch(`/api/habits?userId=${userId}`);
      const data = await res.json();
      setHabits(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Failed to load habits:", e);
      setHabits([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      loadHabits();
    }
  }, [userId, loadHabits]);

  const addHabit = async (preset?: { name: string; icon: string; color: string }) => {
    const n = preset?.name || name;
    if (!n.trim()) return;
    try {
      await fetch("/api/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          name: n,
          icon: preset?.icon || "⭐",
          color: preset?.color || "#8B5CF6",
        }),
      });
      setName("");
      setShowForm(false);
      loadHabits();
    } catch (e) {
      console.error("Failed to add habit:", e);
    }
  };

  const toggleHabit = async (habitId: string) => {
    const today = new Date().toISOString().split("T")[0];
    try {
      await fetch("/api/habits/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ habitId, userId, date: today }),
      });
      loadHabits();
      onRefresh();
    } catch (e) {
      console.error("Failed to toggle habit:", e);
    }
  };

  const deleteHabit = async (id: string) => {
    try {
      await fetch(`/api/habits?id=${id}`, { method: "DELETE" });
      loadHabits();
      onRefresh();
    } catch (e) {
      console.error("Failed to delete habit:", e);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  // Generate last 7 days for the mini calendar
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split("T")[0];
  });

  const dayLabels = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">🔥 Habits</h2>
          <p className={`text-sm ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
            Build consistency, one day at a time
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white text-sm font-medium"
        >
          + New Habit
        </motion.button>
      </div>

      {/* Quick add presets */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`rounded-2xl border overflow-hidden ${
              isDark ? "bg-white/[0.02] border-white/5" : "bg-white border-zinc-100 shadow-sm"
            }`}
          >
            <div className="p-4 space-y-3">
              <p className={`text-xs font-medium ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                Quick Add
              </p>
              <div className="grid grid-cols-4 gap-2">
                {habitPresets.map((preset) => (
                  <motion.button
                    key={preset.name}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => addHabit(preset)}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      isDark
                        ? "bg-white/[0.02] border-white/5 hover:bg-white/[0.05]"
                        : "bg-zinc-50 border-zinc-200 hover:bg-zinc-100"
                    }`}
                  >
                    <div className="text-xl mb-1">{preset.icon}</div>
                    <div className="text-[10px] font-medium">{preset.name}</div>
                  </motion.button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Custom habit..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addHabit()}
                  className={`flex-1 px-3 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 ${
                    isDark
                      ? "bg-white/5 border-white/10 text-white placeholder-zinc-500"
                      : "bg-zinc-50 border-zinc-200 placeholder-zinc-400"
                  }`}
                />
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => addHabit()}
                  className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-medium"
                >
                  Add
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Habits grid */}
      {loading ? (
        <div className="text-center py-12 text-zinc-500">Loading habits...</div>
      ) : habits.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`text-center py-12 rounded-2xl border ${
            isDark ? "bg-white/[0.02] border-white/5" : "bg-white border-zinc-100"
          }`}
        >
          <div className="text-4xl mb-3">🔥</div>
          <div className="font-medium">No habits tracked</div>
          <p className={`text-sm ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
            Start building habits today
          </p>
        </motion.div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {habits.map((habit) => {
            const isCompletedToday = habit.logs?.some((l) => l.date === today) || false;
            return (
              <motion.div
                key={habit.id}
                layout
                className={`group p-4 rounded-2xl border transition-all ${
                  isDark
                    ? "bg-white/[0.02] border-white/5"
                    : "bg-white border-zinc-100 shadow-sm"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                      style={{ backgroundColor: `${habit.color}20` }}
                    >
                      {habit.icon}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{habit.name}</div>
                      <div className={`text-xs ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                        🔥 {habit.currentStreak} streak · {habit.totalCompletions} total
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleHabit(habit.id)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                        isCompletedToday
                          ? "bg-green-500 text-white shadow-lg shadow-green-500/25"
                          : isDark
                          ? "bg-white/5 text-zinc-400 hover:bg-white/10"
                          : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                      }`}
                    >
                      {isCompletedToday ? "✓" : "○"}
                    </motion.button>
                    <button
                      onClick={() => deleteHabit(habit.id)}
                      className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400 transition-all p-1"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                {/* Mini weekly calendar */}
                <div className="flex gap-1">
                  {last7Days.map((day) => {
                    const done = habit.logs?.some((l) => l.date === day) || false;
                    const dayOfWeek = new Date(day + "T00:00:00").getDay();
                    return (
                      <div key={day} className="flex-1 text-center">
                        <div className={`text-[9px] mb-1 ${isDark ? "text-zinc-600" : "text-zinc-400"}`}>
                          {dayLabels[dayOfWeek]}
                        </div>
                        <div
                          className={`w-full aspect-square rounded-lg flex items-center justify-center text-[10px] ${
                            done
                              ? "text-white"
                              : isDark
                              ? "bg-white/5 text-zinc-600"
                              : "bg-zinc-100 text-zinc-400"
                          }`}
                          style={done ? { backgroundColor: habit.color } : {}}
                        >
                          {done ? "✓" : "·"}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
