"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { formatDate } from "@/lib/utils";

interface Note {
  id: string;
  title: string;
  content: string;
  type: string;
  tags: string[];
  pinned: boolean;
  createdAt: string;
}

interface NotesViewProps {
  userId: string;
  onRefresh: () => void;
}

const NOTE_TYPES = [
  { id: "note", label: "Note", icon: "📝" },
  { id: "idea", label: "Idea", icon: "💡" },
  { id: "quote", label: "Quote", icon: "💬" },
  { id: "resource", label: "Resource", icon: "🔗" },
  { id: "book", label: "Book", icon: "📖" },
  { id: "course", label: "Course", icon: "🎓" },
];

export default function NotesView({ userId, onRefresh }: NotesViewProps) {
  const { theme } = useAppStore();
  const isDark = theme === "dark";
  const [notes, setNotes] = useState<Note[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("note");
  const [activeType, setActiveType] = useState("all");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);

  const loadNotes = async () => {
    const res = await fetch(`/api/notes?userId=${userId}`);
    const data = await res.json();
    setNotes(data);
    setLoading(false);
  };

  useEffect(() => {
    loadNotes();
  }, [userId]);

  const addNote = async () => {
    if (!title.trim() || !content.trim()) return;
    await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, title, content, type }),
    });
    setTitle("");
    setContent("");
    setShowForm(false);
    loadNotes();
  };

  const togglePin = async (note: Note) => {
    await fetch("/api/notes", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: note.id, pinned: !note.pinned }),
    });
    loadNotes();
  };

  const deleteNote = async (id: string) => {
    await fetch(`/api/notes?id=${id}`, { method: "DELETE" });
    setSelectedNote(null);
    loadNotes();
  };

  const filteredNotes = activeType === "all" ? notes : notes.filter((n) => n.type === activeType);
  const pinnedNotes = filteredNotes.filter((n) => n.pinned);
  const regularNotes = filteredNotes.filter((n) => !n.pinned);

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">💡 Knowledge Vault</h2>
          <p className={`text-sm ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
            Your personal knowledge base
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => { setShowForm(!showForm); setSelectedNote(null); }}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white text-sm font-medium"
        >
          + New Note
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
        {NOTE_TYPES.map((nt) => (
          <button
            key={nt.id}
            onClick={() => setActiveType(nt.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeType === nt.id
                ? "bg-purple-500/20 text-purple-400"
                : isDark
                ? "bg-white/5 text-zinc-400"
                : "bg-zinc-100 text-zinc-600"
            }`}
          >
            {nt.icon} {nt.label}
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
              <div className="flex gap-2 flex-wrap">
                {NOTE_TYPES.map((nt) => (
                  <button
                    key={nt.id}
                    onClick={() => setType(nt.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      type === nt.id
                        ? "bg-purple-500/20 text-purple-400"
                        : isDark
                        ? "bg-white/5 text-zinc-400"
                        : "bg-zinc-100 text-zinc-600"
                    }`}
                  >
                    {nt.icon} {nt.label}
                  </button>
                ))}
              </div>
              <input
                type="text"
                placeholder="Title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 ${
                  isDark
                    ? "bg-white/5 border-white/10 text-white placeholder-zinc-500"
                    : "bg-zinc-50 border-zinc-200 text-zinc-900 placeholder-zinc-400"
                }`}
              />
              <textarea
                placeholder="Write your note..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 resize-none ${
                  isDark
                    ? "bg-white/5 border-white/10 text-white placeholder-zinc-500"
                    : "bg-zinc-50 border-zinc-200 text-zinc-900 placeholder-zinc-400"
                }`}
              />
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={addNote}
                className="w-full py-3 rounded-xl bg-purple-600 text-white text-sm font-medium"
              >
                Save Note
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected note */}
      <AnimatePresence>
        {selectedNote && (
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
                  <span>{NOTE_TYPES.find((t) => t.id === selectedNote.type)?.icon}</span>
                  <h3 className="font-semibold text-lg">{selectedNote.title}</h3>
                </div>
                <p className={`text-xs ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                  {formatDate(selectedNote.createdAt)}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => togglePin(selectedNote)}
                  className={`text-xs px-2 py-1 ${selectedNote.pinned ? "text-amber-400" : "text-zinc-500"}`}
                >
                  {selectedNote.pinned ? "📌 Pinned" : "📌 Pin"}
                </button>
                <button
                  onClick={() => deleteNote(selectedNote.id)}
                  className="text-red-400 text-xs px-2 py-1"
                >
                  Delete
                </button>
                <button
                  onClick={() => setSelectedNote(null)}
                  className="text-zinc-500 text-xs px-2 py-1"
                >
                  Close
                </button>
              </div>
            </div>
            <div className={`whitespace-pre-wrap text-sm leading-relaxed ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
              {selectedNote.content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notes grid */}
      {loading ? (
        <div className="text-center py-12 text-zinc-500">Loading notes...</div>
      ) : filteredNotes.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`text-center py-12 rounded-2xl border ${
            isDark ? "bg-white/[0.02] border-white/5" : "bg-white border-zinc-100"
          }`}
        >
          <div className="text-4xl mb-3">💡</div>
          <div className="font-medium">No notes yet</div>
          <p className={`text-sm ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
            Start building your knowledge vault
          </p>
        </motion.div>
      ) : (
        <>
          {pinnedNotes.length > 0 && (
            <div>
              <h3 className={`text-xs font-medium mb-2 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                📌 Pinned
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {pinnedNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    isDark={isDark}
                    onClick={() => { setSelectedNote(note); setShowForm(false); }}
                    selected={selectedNote?.id === note.id}
                  />
                ))}
              </div>
            </div>
          )}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {regularNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                isDark={isDark}
                onClick={() => { setSelectedNote(note); setShowForm(false); }}
                selected={selectedNote?.id === note.id}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function NoteCard({
  note,
  isDark,
  onClick,
  selected,
}: {
  note: Note;
  isDark: boolean;
  onClick: () => void;
  selected: boolean;
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      onClick={onClick}
      className={`cursor-pointer p-4 rounded-xl border transition-all ${
        isDark
          ? "bg-white/[0.02] border-white/5 hover:bg-white/[0.04]"
          : "bg-white border-zinc-100 hover:bg-zinc-50 shadow-sm"
      } ${selected ? "ring-1 ring-purple-500/50" : ""}`}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm">
          {NOTE_TYPES.find((t) => t.id === note.type)?.icon || "📝"}
        </span>
        <span className="font-medium text-sm truncate flex-1">{note.title}</span>
        {note.pinned && <span className="text-xs">📌</span>}
      </div>
      <p className={`text-xs line-clamp-3 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
        {note.content}
      </p>
      <div className={`text-[10px] mt-2 ${isDark ? "text-zinc-600" : "text-zinc-400"}`}>
        {formatDate(note.createdAt)}
      </div>
    </motion.div>
  );
}
