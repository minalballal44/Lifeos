"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";

interface Goal {
  id: string;
  title: string;
  description?: string;
  type: string;
  category?: string;
  progress: number;
  target: number;
  milestones: { title: string; done: boolean }[];
  completed: boolean;
  deadline?: string;
  createdAt: string;
}

interface GoalsViewProps {
  userId: string;
  onRefresh: () => void;
}

const goalTypes = [
  { id: "weekly", label: "Weekly", icon: "📅" },
  { id: "monthly", label: "Monthly", icon: "📆" },
  { id: "quarterly", label: "Quarterly", icon: "📊" },
  { id: "yearly", label: "1 Year", icon: "🎯" },
  { id: "3year", label: "3 Years", icon: "🚀" },
  { id: "5year", label: "5 Years", icon: "🌟" },
];

export default function GoalsView({ userId, onRefresh }: GoalsViewProps) {
  const { theme } = useAppStore();
  const isDark = theme === "dark";
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("monthly");
  const [activeType, setActiveType] = useState("all");
  const [loading, setLoading] = useState(true);

  const loadGoals = useCallback(async () => {
    try {
      const res = await fetch(`/api/goals?userId=${userId}`);
      const data = await res.json();
      setGoals(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Failed to load goals:", e);
      setGoals([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      loadGoals();
    }
  }, [userId, loadGoals]);

  const addGoal = async () => {
    if (!title.trim()) return;
    try {
      await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, title, type }),
      });
      setTitle("");
      setShowForm(false);
      loadGoals();
      onRefresh();
    } catch (e) {
      console.error("Failed to add goal:", e);
    }
  };

  const updateProgress = async (goal: Goal, delta: number) => {
    const newProgress = Math.min(goal.target, Math.max(0, goal.progress + delta));
    try {
      await fetch("/api/goals", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: goal.id,
          userId,
          progress: newProgress,
          completed: newProgress >= goal.target,
        }),
      });
      loadGoals();
      onRefresh();
    } catch (e) {
      console.error("Failed to update goal:", e);
    }
  };

  const deleteGoal = async (id: string) => {
    try {
      await fetch(`/api/goals?id=${id}`, { method: "DELETE" });
      loadGoals();
      onRefresh();
    } catch (e) {
      console.error("Failed to delete goal:", e);
    }
  };

  const filteredGoals = activeType === "all" ? goals : goals.filter((g) => g.type === activeType);

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">🎯 Goals</h2>
          <p className={`text-sm ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
            {goals.filter((g) => g.completed).length}/{goals.length} completed
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white text-sm font-medium"
        >
          + New Goal
        </motion.button>
      </div>

      {/* Type filter */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setActiveType("all")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeType === "all"
              ? "bg-purple-500/20 text-purple-400"
              : isDark
              ? "bg-white/5 text-zinc-400"
              : "bg-zinc-100 text-zinc-600"
          }`}
        >
          All
        </button>
        {goalTypes.map((gt) => (
          <button
            key={gt.id}
            onClick={() => setActiveType(gt.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeType === gt.id
                ? "bg-purple-500/20 text-purple-400"
                : isDark
                ? "bg-white/5 text-zinc-400"
                : "bg-zinc-100 text-zinc-600"
            }`}
          >
            {gt.icon} {gt.label}
          </button>
        ))}
      </div>

      {/* Add form */}
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
              <input
                type="text"
                placeholder="What's your goal?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addGoal()}
                className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 ${
                  isDark
                    ? "bg-white/5 border-white/10 text-white placeholder-zinc-500"
                    : "bg-zinc-50 border-zinc-200 text-zinc-900 placeholder-zinc-400"
                }`}
                autoFocus
              />
              <div className="flex items-center gap-2 flex-wrap">
                {goalTypes.map((gt) => (
                  <button
                    key={gt.id}
                    onClick={() => setType(gt.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                      type === gt.id
                        ? "bg-purple-500/20 text-purple-400"
                        : isDark
                        ? "bg-white/5 text-zinc-400"
                        : "bg-zinc-100 text-zinc-600"
                    }`}
                  >
                    {gt.icon} {gt.label}
                  </button>
                ))}
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={addGoal}
                  className="ml-auto px-4 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-medium"
                >
                  Add Goal
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Goals list */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-12 text-zinc-500">Loading goals...</div>
        ) : filteredGoals.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-center py-12 rounded-2xl border ${
              isDark ? "bg-white/[0.02] border-white/5" : "bg-white border-zinc-100"
            }`}
          >
            <div className="text-4xl mb-3">🎯</div>
            <div className="font-medium">No goals yet</div>
            <p className={`text-sm ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
              Set your first goal and start achieving
            </p>
          </motion.div>
        ) : (
          filteredGoals.map((goal) => (
            <motion.div
              key={goal.id}
              layout
              className={`group p-4 rounded-2xl border transition-all ${
                isDark
                  ? "bg-white/[0.02] border-white/5 hover:bg-white/[0.04]"
                  : "bg-white border-zinc-100 hover:bg-zinc-50 shadow-sm"
              } ${goal.completed ? "opacity-60" : ""}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{goal.title}</span>
                    {goal.completed && <span className="text-green-500 text-xs">✓ Done</span>}
                  </div>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded capitalize ${
                      isDark ? "bg-white/5 text-zinc-400" : "bg-zinc-100 text-zinc-500"
                    }`}
                  >
                    {goalTypes.find((gt) => gt.id === goal.type)?.icon}{" "}
                    {goalTypes.find((gt) => gt.id === goal.type)?.label || goal.type}
                  </span>
                </div>
                <button
                  onClick={() => deleteGoal(goal.id)}
                  className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400 transition-all p-1"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {/* Progress bar */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateProgress(goal, -10)}
                  className={`text-xs px-2 py-1 rounded-lg ${
                    isDark ? "bg-white/5 text-zinc-400" : "bg-zinc-100 text-zinc-600"
                  }`}
                >
                  −
                </button>
                <div className="flex-1">
                  <div className={`h-2.5 rounded-full ${isDark ? "bg-white/10" : "bg-zinc-200"}`}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${Math.min(100, (goal.progress / goal.target) * 100)}%`,
                      }}
                      className={`h-full rounded-full ${
                        goal.completed
                          ? "bg-green-500"
                          : "bg-gradient-to-r from-purple-500 to-cyan-500"
                      }`}
                    />
                  </div>
                </div>
                <button
                  onClick={() => updateProgress(goal, 10)}
                  className={`text-xs px-2 py-1 rounded-lg ${
                    isDark ? "bg-white/5 text-zinc-400" : "bg-zinc-100 text-zinc-600"
                  }`}
                >
                  +
                </button>
                <span className="text-sm font-medium w-12 text-right">
                  {Math.round((goal.progress / goal.target) * 100)}%
                </span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
