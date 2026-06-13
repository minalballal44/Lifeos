"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { moodEmojis, moodColors } from "@/lib/utils";

interface MoodEntry {
  id: string;
  mood: string;
  note?: string;
  date: string;
}

interface MoodViewProps {
  userId: string;
  onRefresh: () => void;
}

const moodOptions = [
  { id: "great", emoji: "😊", label: "Great", color: "#22c55e" },
  { id: "good", emoji: "🙂", label: "Good", color: "#84cc16" },
  { id: "okay", emoji: "😐", label: "Okay", color: "#eab308" },
  { id: "sad", emoji: "😔", label: "Sad", color: "#f97316" },
  { id: "stressed", emoji: "😫", label: "Stressed", color: "#ef4444" },
];

export default function MoodView({ userId, onRefresh }: MoodViewProps) {
  const { theme } = useAppStore();
  const isDark = theme === "dark";
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);

  const loadMoods = useCallback(async () => {
    try {
      const res = await fetch(`/api/moods?userId=${userId}`);
      const data = await res.json();
      setMoods(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Failed to load moods:", e);
      setMoods([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      loadMoods();
    }
  }, [userId, loadMoods]);

  const logMood = async (moodId: string) => {
    const today = new Date().toISOString().split("T")[0];
    try {
      await fetch("/api/moods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, mood: moodId, note: note || null, date: today }),
      });
      setNote("");
      loadMoods();
      onRefresh();
    } catch (e) {
      console.error("Failed to log mood:", e);
    }
  };

  const today = new Date().toISOString().split("T")[0];
  const todayMood = moods.find((m) => m.date === today);

  // Generate last 30 days for calendar
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    return d.toISOString().split("T")[0];
  });

  // Mood distribution
  const moodCounts = moodOptions.map((m) => ({
    ...m,
    count: moods.filter((entry) => entry.mood === m.id).length,
  }));
  const totalMoods = moods.length || 1;

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold">😊 Mood Tracker</h2>
        <p className={`text-sm ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
          Track how you feel every day
        </p>
      </div>

      {/* Today's mood */}
      <div
        className={`p-6 rounded-2xl border text-center ${
          isDark ? "bg-white/[0.02] border-white/5" : "bg-white border-zinc-100 shadow-sm"
        }`}
      >
        <h3 className="font-semibold mb-1">How are you feeling today?</h3>
        {todayMood && (
          <p className={`text-sm mb-3 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
            You logged: {moodEmojis[todayMood.mood]}{" "}
            {moodOptions.find((m) => m.id === todayMood.mood)?.label}
          </p>
        )}
        <div className="flex justify-center gap-3 mb-4">
          {moodOptions.map((m) => (
            <motion.button
              key={m.id}
              whileHover={{ scale: 1.15, y: -5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => logMood(m.id)}
              className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-all ${
                todayMood?.mood === m.id
                  ? "shadow-lg"
                  : isDark
                  ? "hover:bg-white/5"
                  : "hover:bg-zinc-50"
              }`}
              style={
                todayMood?.mood === m.id
                  ? {
                      backgroundColor: `${m.color}15`,
                      boxShadow: `0 0 0 2px ${m.color}`,
                    }
                  : {}
              }
            >
              <span className="text-3xl">{m.emoji}</span>
              <span className="text-[10px] font-medium">{m.label}</span>
            </motion.button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Add a note about how you're feeling..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className={`w-full max-w-md mx-auto px-4 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 ${
            isDark
              ? "bg-white/5 border-white/10 text-white placeholder-zinc-500"
              : "bg-zinc-50 border-zinc-200 placeholder-zinc-400"
          }`}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Mood calendar */}
        <div
          className={`p-5 rounded-2xl border ${
            isDark ? "bg-white/[0.02] border-white/5" : "bg-white border-zinc-100 shadow-sm"
          }`}
        >
          <h3 className="font-semibold mb-3">Last 30 Days</h3>
          <div className="grid grid-cols-7 gap-1.5">
            {last30Days.map((day) => {
              const entry = moods.find((m) => m.date === day);
              return (
                <div
                  key={day}
                  className={`aspect-square rounded-lg flex items-center justify-center text-xs ${
                    entry
                      ? ""
                      : isDark
                      ? "bg-white/5"
                      : "bg-zinc-100"
                  }`}
                  style={
                    entry
                      ? { backgroundColor: `${moodColors[entry.mood]}30` }
                      : {}
                  }
                  title={`${day}: ${entry ? moodOptions.find((m) => m.id === entry.mood)?.label : "No log"}`}
                >
                  {entry ? moodEmojis[entry.mood] : ""}
                </div>
              );
            })}
          </div>
        </div>

        {/* Mood distribution */}
        <div
          className={`p-5 rounded-2xl border ${
            isDark ? "bg-white/[0.02] border-white/5" : "bg-white border-zinc-100 shadow-sm"
          }`}
        >
          <h3 className="font-semibold mb-3">Mood Distribution</h3>
          <div className="space-y-3">
            {moodCounts.map((m) => (
              <div key={m.id} className="flex items-center gap-3">
                <span className="text-lg w-8">{m.emoji}</span>
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium">{m.label}</span>
                    <span className={isDark ? "text-zinc-500" : "text-zinc-400"}>
                      {m.count}
                    </span>
                  </div>
                  <div
                    className={`h-2 rounded-full ${
                      isDark ? "bg-white/5" : "bg-zinc-100"
                    }`}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(m.count / totalMoods) * 100}%`,
                      }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: m.color }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent entries */}
      <div
        className={`p-5 rounded-2xl border ${
          isDark ? "bg-white/[0.02] border-white/5" : "bg-white border-zinc-100 shadow-sm"
        }`}
      >
        <h3 className="font-semibold mb-3">Recent Mood Log</h3>
        {loading ? (
          <div className="text-center py-6 text-zinc-500">Loading...</div>
        ) : moods.length === 0 ? (
          <div className="text-center py-6">
            <p className={`text-sm ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
              No moods logged yet. Start tracking today!
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {moods.slice(0, 10).map((entry) => (
              <div
                key={entry.id}
                className={`flex items-center gap-3 p-3 rounded-xl ${
                  isDark ? "bg-white/[0.02]" : "bg-zinc-50"
                }`}
              >
                <span className="text-xl">{moodEmojis[entry.mood]}</span>
                <div className="flex-1">
                  <div className="text-sm font-medium capitalize">
                    {moodOptions.find((m) => m.id === entry.mood)?.label}
                  </div>
                  {entry.note && (
                    <p className={`text-xs ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                      {entry.note}
                    </p>
                  )}
                </div>
                <span className={`text-xs ${isDark ? "text-zinc-600" : "text-zinc-400"}`}>
                  {entry.date}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
