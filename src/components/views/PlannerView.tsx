"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";

interface PlannerViewProps {
  userId: string;
  onRefresh: () => void;
}

const timeSlots = Array.from({ length: 16 }, (_, i) => {
  const hour = i + 6;
  return `${String(hour).padStart(2, "0")}:00`;
});

const colors = [
  "#8B5CF6",
  "#06B6D4",
  "#22c55e",
  "#F59E0B",
  "#EF4444",
  "#EC4899",
  "#6366F1",
  "#14B8A6",
];

export default function PlannerView({ userId, onRefresh }: PlannerViewProps) {
  const { theme } = useAppStore();
  const isDark = theme === "dark";
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [color, setColor] = useState("#8B5CF6");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [blocks, setBlocks] = useState<Array<{id: string; title: string; startTime: string; endTime: string; color: string}>>([]);

  const addBlock = async () => {
    if (!title.trim()) return;
    try {
      // Save as task with time info
      await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          title: `[${startTime}-${endTime}] ${title}`,
          category: "planner",
          priority: "medium",
        }),
      });
      
      // Add to local state for display
      setBlocks(prev => [...prev, {
        id: Date.now().toString(),
        title,
        startTime,
        endTime,
        color
      }]);
      
      setTitle("");
      setShowForm(false);
      onRefresh();
    } catch (e) {
      console.error("Failed to add block:", e);
    }
  };

  // Generate week days
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - d.getDay() + i);
    return {
      date: d.toISOString().split("T")[0],
      day: d.toLocaleDateString("en-US", { weekday: "short" }),
      num: d.getDate(),
      isToday: d.toISOString().split("T")[0] === new Date().toISOString().split("T")[0],
    };
  });

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">📅 Daily Planner</h2>
          <p className={`text-sm ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
            Plan your day, own your time
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white text-sm font-medium"
        >
          + Time Block
        </motion.button>
      </div>

      {/* Week selector */}
      <div className="flex gap-2 justify-center">
        {weekDays.map((day) => (
          <button
            key={day.date}
            onClick={() => setSelectedDate(day.date)}
            className={`flex flex-col items-center p-2 rounded-xl w-14 transition-all ${
              selectedDate === day.date
                ? "bg-gradient-to-b from-purple-600 to-cyan-600 text-white"
                : day.isToday
                ? isDark
                  ? "bg-white/10 text-white"
                  : "bg-zinc-100 text-zinc-900"
                : isDark
                ? "text-zinc-400 hover:bg-white/5"
                : "text-zinc-600 hover:bg-zinc-50"
            }`}
          >
            <span className="text-[10px] uppercase">{day.day}</span>
            <span className="text-lg font-bold">{day.num}</span>
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
                placeholder="What are you working on?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 ${
                  isDark
                    ? "bg-white/5 border-white/10 text-white placeholder-zinc-500"
                    : "bg-zinc-50 border-zinc-200 text-zinc-900 placeholder-zinc-400"
                }`}
                autoFocus
              />
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className={`px-3 py-1.5 rounded-lg border text-xs ${
                      isDark
                        ? "bg-white/5 border-white/10 text-white"
                        : "bg-zinc-50 border-zinc-200"
                    }`}
                  />
                  <span className={`text-xs ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                    to
                  </span>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className={`px-3 py-1.5 rounded-lg border text-xs ${
                      isDark
                        ? "bg-white/5 border-white/10 text-white"
                        : "bg-zinc-50 border-zinc-200"
                    }`}
                  />
                </div>
                <div className="flex gap-1">
                  {colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={`w-6 h-6 rounded-full transition-all ${
                        color === c ? "ring-2 ring-offset-2 ring-purple-400" : ""
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={addBlock}
                  className="ml-auto px-4 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-medium"
                >
                  Add Block
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Time grid */}
      <div
        className={`rounded-2xl border overflow-hidden ${
          isDark ? "bg-white/[0.02] border-white/5" : "bg-white border-zinc-100 shadow-sm"
        }`}
      >
        <div className={`divide-y ${isDark ? "divide-white/5" : "divide-zinc-100"}`}>
          {timeSlots.map((slot) => {
            const block = blocks.find((b) => b.startTime === slot);
            return (
              <div key={slot} className="flex items-stretch min-h-[48px]">
                <div
                  className={`w-16 flex-shrink-0 flex items-center justify-center text-xs border-r ${
                    isDark
                      ? "text-zinc-600 border-white/5"
                      : "text-zinc-400 border-zinc-100"
                  }`}
                >
                  {slot}
                </div>
                <div className="flex-1 p-1.5">
                  {block ? (
                    <div
                      className="rounded-lg px-3 py-2 text-white text-xs font-medium"
                      style={{ backgroundColor: block.color }}
                    >
                      {block.title}
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily tips */}
      <div
        className={`p-5 rounded-2xl border ${
          isDark ? "bg-white/[0.02] border-white/5" : "bg-white border-zinc-100 shadow-sm"
        }`}
      >
        <h3 className="font-semibold mb-2">💡 Planning Tips</h3>
        <ul className={`space-y-1 text-sm ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
          <li>• Block your most important work during your peak energy hours</li>
          <li>• Leave buffer time between blocks for transitions</li>
          <li>• Schedule breaks — they boost productivity</li>
          <li>• Review your plan at the end of each day</li>
        </ul>
      </div>
    </div>
  );
}
