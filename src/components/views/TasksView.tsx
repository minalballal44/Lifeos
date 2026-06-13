"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { priorityColors } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  description?: string;
  priority: string;
  status: string;
  category?: string;
  tags: string[];
  dueDate?: string;
  completed: boolean;
  createdAt: string;
}

interface TasksViewProps {
  userId: string;
  onRefresh: () => void;
}

export default function TasksView({ userId, onRefresh }: TasksViewProps) {
  const { theme } = useAppStore();
  const isDark = theme === "dark";
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const loadTasks = useCallback(async () => {
    try {
      const res = await fetch(`/api/tasks?userId=${userId}`);
      const data = await res.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Failed to load tasks:", e);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      loadTasks();
    }
  }, [userId, loadTasks]);

  const addTask = async () => {
    if (!title.trim()) return;
    try {
      await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, title, priority, category: category || null }),
      });
      setTitle("");
      setPriority("medium");
      setCategory("");
      setShowForm(false);
      loadTasks();
      onRefresh();
    } catch (e) {
      console.error("Failed to add task:", e);
    }
  };

  const toggleTask = async (task: Task) => {
    try {
      await fetch("/api/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: task.id,
          completed: !task.completed,
          userId,
          priority: task.priority,
        }),
      });
      loadTasks();
      onRefresh();
    } catch (e) {
      console.error("Failed to toggle task:", e);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await fetch(`/api/tasks?id=${id}`, { method: "DELETE" });
      loadTasks();
      onRefresh();
    } catch (e) {
      console.error("Failed to delete task:", e);
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "done") return t.completed;
    return true;
  });

  const priorities = ["low", "medium", "high", "urgent"];

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">✅ Tasks</h2>
          <p className={`text-sm ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
            {tasks.filter((t) => !t.completed).length} pending · {tasks.filter((t) => t.completed).length} completed
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white text-sm font-medium"
        >
          + New Task
        </motion.button>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {["all", "active", "done"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
              filter === f
                ? "bg-purple-500/20 text-purple-400"
                : isDark
                ? "bg-white/5 text-zinc-400 hover:bg-white/10"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            {f}
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
                placeholder="What needs to be done?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTask()}
                className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 ${
                  isDark
                    ? "bg-white/5 border-white/10 text-white placeholder-zinc-500"
                    : "bg-zinc-50 border-zinc-200 text-zinc-900 placeholder-zinc-400"
                }`}
                autoFocus
              />
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex gap-1">
                  {priorities.map((p) => (
                    <button
                      key={p}
                      onClick={() => setPriority(p)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-all ${
                        priority === p
                          ? "text-white"
                          : isDark
                          ? "bg-white/5 text-zinc-400"
                          : "bg-zinc-100 text-zinc-600"
                      }`}
                      style={priority === p ? { backgroundColor: priorityColors[p] } : {}}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs border focus:outline-none ${
                    isDark
                      ? "bg-white/5 border-white/10 text-white placeholder-zinc-500"
                      : "bg-zinc-50 border-zinc-200 placeholder-zinc-400"
                  }`}
                />
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={addTask}
                  className="ml-auto px-4 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-medium"
                >
                  Add Task
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tasks list */}
      <div className="space-y-2">
        {loading ? (
          <div className="text-center py-12 text-zinc-500">Loading tasks...</div>
        ) : filteredTasks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-center py-12 rounded-2xl border ${
              isDark ? "bg-white/[0.02] border-white/5" : "bg-white border-zinc-100"
            }`}
          >
            <div className="text-4xl mb-3">📋</div>
            <div className="font-medium">No tasks yet</div>
            <p className={`text-sm ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
              Create your first task to get started
            </p>
          </motion.div>
        ) : (
          <AnimatePresence>
            {filteredTasks.map((task) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className={`group flex items-center gap-3 p-4 rounded-xl border transition-all ${
                  isDark
                    ? "bg-white/[0.02] border-white/5 hover:bg-white/[0.04]"
                    : "bg-white border-zinc-100 hover:bg-zinc-50 shadow-sm"
                } ${task.completed ? "opacity-60" : ""}`}
              >
                <button
                  onClick={() => toggleTask(task)}
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                    task.completed
                      ? "bg-purple-500 border-purple-500"
                      : `border-zinc-400 hover:border-purple-500`
                  }`}
                >
                  {task.completed && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <div
                    className={`font-medium text-sm ${
                      task.completed ? "line-through" : ""
                    }`}
                  >
                    {task.title}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded font-medium uppercase"
                      style={{
                        backgroundColor: `${priorityColors[task.priority]}20`,
                        color: priorityColors[task.priority],
                      }}
                    >
                      {task.priority}
                    </span>
                    {task.category && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded ${
                          isDark ? "bg-white/5 text-zinc-400" : "bg-zinc-100 text-zinc-500"
                        }`}
                      >
                        {task.category}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400 transition-all p-1"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
