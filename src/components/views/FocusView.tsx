"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/lib/store";

interface FocusViewProps {
  userId: string;
  onRefresh: () => void;
}

export default function FocusView({ userId, onRefresh }: FocusViewProps) {
  const { theme } = useAppStore();
  const isDark = theme === "dark";
  const [mode, setMode] = useState<"idle" | "running" | "break">("idle");
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [duration, setDuration] = useState(25);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [totalFocusToday, setTotalFocusToday] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const saveFocusSession = useCallback(async (mins: number) => {
    await fetch("/api/focus", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, duration: mins }),
    });
    onRefresh();
  }, [userId, onRefresh]);

  useEffect(() => {
    // Load today's sessions
    const loadSessions = async () => {
      const res = await fetch(`/api/focus?userId=${userId}`);
      const data = await res.json();
      const todayStr = new Date().toISOString().split("T")[0];
      const todaySessions = data.filter(
        (s: { completedAt: string }) =>
          s.completedAt && s.completedAt.startsWith(todayStr)
      );
      setTotalFocusToday(
        todaySessions.reduce((s: number, f: { duration: number }) => s + f.duration, 0)
      );
      setSessionsCompleted(todaySessions.length);
    };
    loadSessions();
  }, [userId]);

  useEffect(() => {
    if (mode === "running" || mode === "break") {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (mode === "running") {
              saveFocusSession(duration);
              setSessionsCompleted((s) => s + 1);
              setTotalFocusToday((t) => t + duration);
              setMode("break");
              return 5 * 60; // 5 min break
            } else {
              setMode("idle");
              return duration * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [mode, duration, saveFocusSession]);

  const startFocus = () => {
    setTimeLeft(duration * 60);
    setMode("running");
  };

  const stopFocus = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setMode("idle");
    setTimeLeft(duration * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress =
    mode === "running"
      ? ((duration * 60 - timeLeft) / (duration * 60)) * 100
      : mode === "break"
      ? ((5 * 60 - timeLeft) / (5 * 60)) * 100
      : 0;

  const durations = [15, 25, 30, 45, 60];

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">🎧 Focus Mode</h2>
        <p className={`text-sm ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
          Deep work, distraction-free
        </p>
      </div>

      {/* Timer */}
      <div
        className={`p-8 md:p-12 rounded-3xl border text-center relative overflow-hidden ${
          isDark ? "bg-white/[0.02] border-white/5" : "bg-white border-zinc-100 shadow-sm"
        }`}
      >
        {/* Background glow */}
        {mode === "running" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
          </div>
        )}
        {mode === "break" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 bg-green-500/10 rounded-full blur-3xl animate-pulse" />
          </div>
        )}

        <div className="relative z-10">
          {/* Mode label */}
          <div
            className={`text-xs font-medium mb-6 uppercase tracking-wider ${
              mode === "running"
                ? "text-purple-400"
                : mode === "break"
                ? "text-green-400"
                : isDark
                ? "text-zinc-500"
                : "text-zinc-400"
            }`}
          >
            {mode === "running"
              ? "Focus Time"
              : mode === "break"
              ? "Break Time"
              : "Ready to Focus"}
          </div>

          {/* Circular progress */}
          <div className="relative w-52 h-52 mx-auto mb-8">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}
                strokeWidth="6"
              />
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke={mode === "break" ? "#22c55e" : "#8B5CF6"}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 52}`}
                strokeDashoffset={`${2 * Math.PI * 52 * (1 - progress / 100)}`}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-bold tabular-nums">
                {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* Duration selector */}
          {mode === "idle" && (
            <div className="flex justify-center gap-2 mb-6">
              {durations.map((d) => (
                <button
                  key={d}
                  onClick={() => {
                    setDuration(d);
                    setTimeLeft(d * 60);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    duration === d
                      ? "bg-purple-500/20 text-purple-400"
                      : isDark
                      ? "bg-white/5 text-zinc-400"
                      : "bg-zinc-100 text-zinc-600"
                  }`}
                >
                  {d}m
                </button>
              ))}
            </div>
          )}

          {/* Controls */}
          <div className="flex justify-center gap-3">
            {mode === "idle" ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startFocus}
                className="px-8 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold"
              >
                Start Focus
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={stopFocus}
                className={`px-8 py-3 rounded-2xl font-semibold ${
                  isDark
                    ? "bg-white/10 text-white"
                    : "bg-zinc-200 text-zinc-800"
                }`}
              >
                Stop
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            label: "Sessions Today",
            value: sessionsCompleted,
            icon: "🎯",
          },
          {
            label: "Focus Minutes",
            value: `${totalFocusToday}m`,
            icon: "⏱️",
          },
          {
            label: "Focus Hours",
            value: `${(totalFocusToday / 60).toFixed(1)}h`,
            icon: "📊",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`p-4 rounded-2xl border text-center ${
              isDark
                ? "bg-white/[0.02] border-white/5"
                : "bg-white border-zinc-100 shadow-sm"
            }`}
          >
            <div className="text-xl mb-1">{stat.icon}</div>
            <div className="text-xl font-bold">{stat.value}</div>
            <div className={`text-[10px] ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Ambient sounds hint */}
      <div
        className={`p-4 rounded-2xl border text-center ${
          isDark ? "bg-white/[0.02] border-white/5" : "bg-white border-zinc-100 shadow-sm"
        }`}
      >
        <div className="flex items-center justify-center gap-4 flex-wrap">
          {["🌧️ Rain", "🌊 Ocean", "🔥 Fireplace", "🌲 Forest", "☕ Café"].map((sound) => (
            <button
              key={sound}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                isDark ? "bg-white/5 text-zinc-400 hover:bg-white/10" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              {sound}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
