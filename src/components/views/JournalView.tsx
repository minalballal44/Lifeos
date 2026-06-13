"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { formatDate, moodEmojis } from "@/lib/utils";

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  type: string;
  mood?: string;
  tags: string[];
  createdAt: string;
}

interface JournalViewProps {
  userId: string;
  onRefresh: () => void;
}

const journalTypes = [
  { id: "daily", label: "Daily", icon: "📝", prompt: "How was your day?" },
  { id: "gratitude", label: "Gratitude", icon: "🙏", prompt: "What are you grateful for today?" },
  { id: "reflection", label: "Reflection", icon: "🪞", prompt: "What did you learn today?" },
  { id: "success", label: "Success", icon: "🏆", prompt: "What did you accomplish today?" },
  { id: "mood", label: "Mood", icon: "😊", prompt: "How are you feeling right now?" },
];

const moods = [
  { id: "great", emoji: "😊", label: "Great" },
  { id: "good", emoji: "🙂", label: "Good" },
  { id: "okay", emoji: "😐", label: "Okay" },
  { id: "sad", emoji: "😔", label: "Sad" },
  { id: "stressed", emoji: "😫", label: "Stressed" },
];

export default function JournalView({ userId, onRefresh }: JournalViewProps) {
  const { theme } = useAppStore();
  const isDark = theme === "dark";
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("daily");
  const [mood, setMood] = useState("");
  const [activeType, setActiveType] = useState("all");
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [loading, setLoading] = useState(true);

  const loadEntries = useCallback(async () => {
    try {
      const res = await fetch(`/api/journal?userId=${userId}`);
      const data = await res.json();
      setEntries(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Failed to load journal:", e);
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      loadEntries();
    }
  }, [userId, loadEntries]);

  const addEntry = async () => {
    if (!content.trim()) return;
    try {
      await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          title: title || journalTypes.find((t) => t.id === type)?.prompt || "Journal Entry",
          content,
          type,
          mood: mood || null,
        }),
      });
      setTitle("");
      setContent("");
      setMood("");
      setShowForm(false);
      loadEntries();
      onRefresh();
    } catch (e) {
      console.error("Failed to add entry:", e);
    }
  };

  const deleteEntry = async (id: string) => {
    try {
      await fetch(`/api/journal?id=${id}`, { method: "DELETE" });
      setSelectedEntry(null);
      loadEntries();
    } catch (e) {
      console.error("Failed to delete entry:", e);
    }
  };

  const filteredEntries =
    activeType === "all" ? entries : entries.filter((e) => e.type === activeType);

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">📝 Journal</h2>
          <p className={`text-sm ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
            Your private space for reflection
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => { setShowForm(!showForm); setSelectedEntry(null); }}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white text-sm font-medium"
        >
          + New Entry
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
        {journalTypes.map((jt) => (
          <button
            key={jt.id}
            onClick={() => setActiveType(jt.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeType === jt.id
                ? "bg-purple-500/20 text-purple-400"
                : isDark
                ? "bg-white/5 text-zinc-400"
                : "bg-zinc-100 text-zinc-600"
            }`}
          >
            {jt.icon} {jt.label}
          </button>
        ))}
      </div>

      {/* Write form */}
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
              {/* Type selector */}
              <div className="flex gap-2 flex-wrap">
                {journalTypes.map((jt) => (
                  <button
                    key={jt.id}
                    onClick={() => setType(jt.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      type === jt.id
                        ? "bg-purple-500/20 text-purple-400"
                        : isDark
                        ? "bg-white/5 text-zinc-400"
                        : "bg-zinc-100 text-zinc-600"
                    }`}
                  >
                    {jt.icon} {jt.label}
                  </button>
                ))}
              </div>
              <input
                type="text"
                placeholder={journalTypes.find((t) => t.id === type)?.prompt || "Title..."}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 ${
                  isDark
                    ? "bg-white/5 border-white/10 text-white placeholder-zinc-500"
                    : "bg-zinc-50 border-zinc-200 text-zinc-900 placeholder-zinc-400"
                }`}
              />
              <textarea
                placeholder="Write your thoughts..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 resize-none ${
                  isDark
                    ? "bg-white/5 border-white/10 text-white placeholder-zinc-500"
                    : "bg-zinc-50 border-zinc-200 text-zinc-900 placeholder-zinc-400"
                }`}
              />
              {/* Mood selector */}
              <div className="flex items-center gap-2">
                <span className={`text-xs ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                  Mood:
                </span>
                {moods.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMood(m.id)}
                    className={`text-lg p-1 rounded-lg transition-all ${
                      mood === m.id
                        ? "bg-purple-500/20 scale-110"
                        : "hover:bg-white/5"
                    }`}
                    title={m.label}
                  >
                    {m.emoji}
                  </button>
                ))}
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={addEntry}
                className="w-full py-3 rounded-xl bg-purple-600 text-white text-sm font-medium"
              >
                Save Entry
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected entry detail */}
      <AnimatePresence>
        {selectedEntry && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`rounded-2xl border p-6 ${
              isDark ? "bg-white/[0.02] border-white/5" : "bg-white border-zinc-100 shadow-sm"
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span>
                    {journalTypes.find((t) => t.id === selectedEntry.type)?.icon}
                  </span>
                  <h3 className="font-semibold text-lg">{selectedEntry.title}</h3>
                  {selectedEntry.mood && (
                    <span className="text-lg">{moodEmojis[selectedEntry.mood]}</span>
                  )}
                </div>
                <p className={`text-xs ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                  {formatDate(selectedEntry.createdAt)}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => deleteEntry(selectedEntry.id)}
                  className="text-red-400 hover:text-red-300 text-xs px-2 py-1"
                >
                  Delete
                </button>
                <button
                  onClick={() => setSelectedEntry(null)}
                  className="text-zinc-500 hover:text-zinc-300 text-xs px-2 py-1"
                >
                  Close
                </button>
              </div>
            </div>
            <div className={`whitespace-pre-wrap text-sm leading-relaxed ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
              {selectedEntry.content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Entries list */}
      <div className="space-y-2">
        {loading ? (
          <div className="text-center py-12 text-zinc-500">Loading journal...</div>
        ) : filteredEntries.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-center py-12 rounded-2xl border ${
              isDark ? "bg-white/[0.02] border-white/5" : "bg-white border-zinc-100"
            }`}
          >
            <div className="text-4xl mb-3">📝</div>
            <div className="font-medium">Your journal is empty</div>
            <p className={`text-sm ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
              Start writing to capture your thoughts
            </p>
          </motion.div>
        ) : (
          filteredEntries.map((entry) => (
            <motion.div
              key={entry.id}
              whileHover={{ x: 2 }}
              onClick={() => { setSelectedEntry(entry); setShowForm(false); }}
              className={`cursor-pointer p-4 rounded-xl border transition-all ${
                isDark
                  ? "bg-white/[0.02] border-white/5 hover:bg-white/[0.04]"
                  : "bg-white border-zinc-100 hover:bg-zinc-50 shadow-sm"
              } ${selectedEntry?.id === entry.id ? "ring-1 ring-purple-500/50" : ""}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm">
                  {journalTypes.find((t) => t.id === entry.type)?.icon}
                </span>
                <span className="font-medium text-sm truncate">{entry.title}</span>
                {entry.mood && (
                  <span className="text-sm">{moodEmojis[entry.mood]}</span>
                )}
                <span className={`ml-auto text-xs ${isDark ? "text-zinc-600" : "text-zinc-400"}`}>
                  {formatDate(entry.createdAt)}
                </span>
              </div>
              <p
                className={`text-xs truncate ${
                  isDark ? "text-zinc-500" : "text-zinc-400"
                }`}
              >
                {entry.content.length > 120 ? entry.content.substring(0, 120) + "..." : entry.content}
              </p>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
