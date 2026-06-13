"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/lib/store";
import Sidebar from "./Sidebar";
import AICoach from "./AICoach";
import ProfileModal from "./ProfileModal";
import Dashboard from "./views/Dashboard";
import TasksView from "./views/TasksView";
import GoalsView from "./views/GoalsView";
import HabitsView from "./views/HabitsView";
import JournalView from "./views/JournalView";
import MoodView from "./views/MoodView";
import FocusView from "./views/FocusView";
import NotesView from "./views/NotesView";
import AnalyticsView from "./views/AnalyticsView";
import PlannerView from "./views/PlannerView";

export default function AppShell() {
  const { activeView, userId, theme, sidebarOpen, setSidebarOpen, userName } = useAppStore();
  const [stats, setStats] = useState<Record<string, unknown> | null>(null);
  const [userXP, setUserXP] = useState(0);
  const [aiCoachOpen, setAICoachOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const isDark = theme === "dark";

  const loadStats = useCallback(async () => {
    if (!userId) return;
    try {
      const [statsRes, userRes] = await Promise.all([
        fetch(`/api/stats?userId=${userId}`),
        fetch(`/api/user?id=${userId}`)
      ]);
      
      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data);
      }
      
      if (userRes.ok) {
        const user = await userRes.json();
        setUserXP(user.xp || 0);
      }
    } catch (e) {
      console.error("Failed to load stats:", e);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      loadStats();
    }
  }, [userId, loadStats]);

  const renderView = () => {
    if (!userId) return null;
    
    const props = { userId, onRefresh: loadStats };
    
    switch (activeView) {
      case "dashboard":
        return <Dashboard {...props} stats={stats} xp={userXP} />;
      case "tasks":
        return <TasksView {...props} />;
      case "goals":
        return <GoalsView {...props} />;
      case "habits":
        return <HabitsView {...props} />;
      case "journal":
        return <JournalView {...props} />;
      case "mood":
        return <MoodView {...props} />;
      case "focus":
        return <FocusView {...props} />;
      case "notes":
        return <NotesView {...props} />;
      case "analytics":
        return <AnalyticsView {...props} stats={stats} />;
      case "planner":
        return <PlannerView {...props} />;
      default:
        return <Dashboard {...props} stats={stats} xp={userXP} />;
    }
  };

  return (
    <div className="h-full flex">
      <Sidebar 
        xp={userXP} 
        onOpenAICoach={() => setAICoachOpen(true)} 
        onOpenProfile={() => setProfileOpen(true)}
      />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div
          className={`flex items-center gap-3 px-4 py-3 border-b transition-colors duration-300 ${
            isDark ? "border-white/5" : "border-zinc-200"
          }`}
        >
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-2 rounded-lg transition-colors ${
              isDark ? "hover:bg-white/5 text-zinc-400" : "hover:bg-zinc-100 text-zinc-600"
            }`}
          >
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
          
          <div className="flex-1" />
          
          {/* AI Coach floating button for mobile */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setAICoachOpen(true)}
            className="md:hidden flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white text-xs font-medium"
          >
            <span>🤖</span>
            <span>AI Coach</span>
          </motion.button>
          
          <div
            className={`text-xs ${
              isDark ? "text-zinc-500" : "text-zinc-400"
            }`}
          >
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </div>

          {/* Profile button in top bar */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setProfileOpen(true)}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 via-cyan-500 to-amber-500 flex items-center justify-center text-white text-xs font-bold shadow-lg"
          >
            {(userName || "U").charAt(0).toUpperCase()}
          </motion.button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {renderView()}
          </motion.div>
        </div>
      </main>

      {/* Floating AI Coach Button */}
      {!aiCoachOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setAICoachOpen(true)}
          className="hidden md:flex fixed bottom-6 right-6 w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 via-cyan-600 to-amber-500 items-center justify-center text-2xl shadow-lg shadow-purple-500/25 z-40"
        >
          🤖
        </motion.button>
      )}

      {/* AI Coach Chat */}
      <AICoach isOpen={aiCoachOpen} onClose={() => setAICoachOpen(false)} />

      {/* Profile Modal */}
      <ProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
    </div>
  );
}
