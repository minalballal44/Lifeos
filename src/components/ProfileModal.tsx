"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { getLevelFromXP, getXPProgress } from "@/lib/utils";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  goals: string[];
  xp: number;
  level: number;
  streak: number;
  createdAt: string;
}

const roleLabels: Record<string, string> = {
  student: "📚 Student",
  college: "🎓 College Student",
  professional: "💼 Working Professional",
  entrepreneur: "🚀 Entrepreneur",
  homemaker: "🏠 Homemaker",
  freelancer: "✨ Freelancer",
  creator: "🎥 Content Creator",
  jobseeker: "🔍 Job Seeker",
};

const goalLabels: Record<string, string> = {
  study: "📖 Study More",
  grades: "🏆 Better Grades",
  fitness: "💪 Fitness",
  productivity: "⚡ Productivity",
  career: "📈 Career Growth",
  business: "🏗️ Build Business",
  mental_health: "🧘 Mental Health",
  skills: "🎯 Learn Skills",
};

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { theme, userId, userName, setUserId, setUserName, setOnboarded } = useAppStore();
  const isDark = theme === "dark";
  const [userData, setUserData] = useState<UserData | null>(null);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    if (isOpen && userId) {
      loadUserData();
    }
  }, [isOpen, userId]);

  const loadUserData = async () => {
    setLoading(true);
    try {
      const [userRes, statsRes] = await Promise.all([
        fetch(`/api/user?id=${userId}`),
        fetch(`/api/stats?userId=${userId}`)
      ]);

      if (userRes.ok) {
        const user = await userRes.json();
        setUserData(user);
      }

      if (statsRes.ok) {
        const s = await statsRes.json();
        setStats(s);
      }
    } catch (e) {
      console.error("Failed to load user data:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUserId(null as unknown as string);
    setUserName("");
    setOnboarded(false);
    localStorage.removeItem("lifeos-store");
    onClose();
    window.location.reload();
  };

  if (!isOpen) return null;

  const level = userData ? getLevelFromXP(userData.xp) : 1;
  const xpProgress = userData ? getXPProgress(userData.xp) : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-md rounded-3xl shadow-2xl z-50 overflow-hidden ${
              isDark ? "bg-[#0F0F14]" : "bg-white"
            }`}
          >
            {loading ? (
              <div className="p-8 text-center">
                <div className="text-4xl mb-3 animate-pulse">👤</div>
                <p className="text-zinc-500">Loading profile...</p>
              </div>
            ) : userData ? (
              <>
                {/* Header with gradient */}
                <div className="relative h-28 bg-gradient-to-r from-purple-600 via-cyan-600 to-amber-500">
                  <div className="absolute inset-0 bg-black/20" />
                  <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full bg-black/20 text-white/80 hover:bg-black/40 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Avatar */}
                <div className="relative -mt-12 px-6">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500 via-cyan-500 to-amber-500 p-[3px] shadow-xl">
                    <div className={`w-full h-full rounded-[13px] flex items-center justify-center text-4xl font-bold ${isDark ? "bg-[#0F0F14]" : "bg-white"}`}>
                      {userName?.charAt(0).toUpperCase() || "U"}
                    </div>
                  </div>
                </div>

                {/* User Info */}
                <div className="px-6 pt-4 pb-6">
                  <h2 className="text-2xl font-bold">{userData.name}</h2>
                  <p className={`text-sm ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                    {userData.email}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${isDark ? "bg-white/5" : "bg-zinc-100"}`}>
                      {roleLabels[userData.role] || userData.role}
                    </span>
                  </div>

                  {/* XP & Level */}
                  <div className={`mt-4 p-4 rounded-2xl ${isDark ? "bg-white/5" : "bg-zinc-50"}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">⭐</span>
                        <span className="font-bold text-lg">Level {level}</span>
                      </div>
                      <span className={`text-sm ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                        {userData.xp} XP
                      </span>
                    </div>
                    <div className={`h-3 rounded-full ${isDark ? "bg-white/10" : "bg-zinc-200"}`}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${xpProgress}%` }}
                        className="h-full rounded-full bg-gradient-to-r from-purple-500 via-cyan-500 to-amber-500"
                      />
                    </div>
                    <p className={`text-xs mt-1 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                      {Math.round(xpProgress)}% to Level {level + 1}
                    </p>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {[
                      { label: "Tasks", value: stats.completedTasks || 0, icon: "✅" },
                      { label: "Goals", value: stats.completedGoals || 0, icon: "🎯" },
                      { label: "Streaks", value: stats.totalStreaks || 0, icon: "🔥" },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className={`p-3 rounded-xl text-center ${isDark ? "bg-white/5" : "bg-zinc-50"}`}
                      >
                        <div className="text-lg">{stat.icon}</div>
                        <div className="text-xl font-bold">{stat.value}</div>
                        <div className={`text-[10px] ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Goals */}
                  {userData.goals && userData.goals.length > 0 && (
                    <div className="mt-4">
                      <h3 className={`text-xs font-medium mb-2 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                        Your Goals
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {userData.goals.map((goal) => (
                          <span
                            key={goal}
                            className={`text-xs px-2 py-1 rounded-full ${isDark ? "bg-purple-500/20 text-purple-300" : "bg-purple-50 text-purple-700"}`}
                          >
                            {goalLabels[goal] || goal}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Member since */}
                  <p className={`text-xs mt-4 ${isDark ? "text-zinc-600" : "text-zinc-400"}`}>
                    Member since {new Date(userData.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric"
                    })}
                  </p>

                  {/* Logout Button */}
                  <div className="mt-6 pt-4 border-t border-white/5">
                    {!showLogoutConfirm ? (
                      <button
                        onClick={() => setShowLogoutConfirm(true)}
                        className={`w-full py-3 rounded-xl text-sm font-medium transition-colors ${
                          isDark
                            ? "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                            : "bg-red-50 text-red-600 hover:bg-red-100"
                        }`}
                      >
                        🚪 Logout
                      </button>
                    ) : (
                      <div className="space-y-2">
                        <p className={`text-sm text-center ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                          Are you sure you want to logout?
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setShowLogoutConfirm(false)}
                            className={`flex-1 py-2 rounded-xl text-sm font-medium ${
                              isDark ? "bg-white/5 text-zinc-300" : "bg-zinc-100 text-zinc-700"
                            }`}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleLogout}
                            className="flex-1 py-2 rounded-xl text-sm font-medium bg-red-500 text-white"
                          >
                            Yes, Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="p-8 text-center">
                <div className="text-4xl mb-3">❌</div>
                <p className="text-zinc-500">Failed to load profile</p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
