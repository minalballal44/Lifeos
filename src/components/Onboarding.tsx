"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";
import Logo from "./Logo";

interface OnboardingProps {
  onSwitchToLogin?: () => void;
}

const roles = [
  { id: "student", label: "Student", icon: "📚", desc: "High school or younger" },
  { id: "college", label: "College Student", icon: "🎓", desc: "University / College" },
  { id: "professional", label: "Working Professional", icon: "💼", desc: "9–5 and beyond" },
  { id: "entrepreneur", label: "Entrepreneur", icon: "🚀", desc: "Building something" },
  { id: "homemaker", label: "Homemaker", icon: "🏠", desc: "Managing home & family" },
  { id: "freelancer", label: "Freelancer", icon: "✨", desc: "Independent work" },
  { id: "creator", label: "Content Creator", icon: "🎥", desc: "Creating content" },
  { id: "jobseeker", label: "Job Seeker", icon: "🔍", desc: "Finding opportunities" },
];

const goalOptions = [
  { id: "study", label: "Study More", icon: "📖" },
  { id: "grades", label: "Better Grades", icon: "🏆" },
  { id: "fitness", label: "Fitness", icon: "💪" },
  { id: "productivity", label: "Productivity", icon: "⚡" },
  { id: "career", label: "Career Growth", icon: "📈" },
  { id: "business", label: "Build Business", icon: "🏗️" },
  { id: "mental_health", label: "Mental Health", icon: "🧘" },
  { id: "skills", label: "Learn Skills", icon: "🎯" },
];

export default function Onboarding({ onSwitchToLogin }: OnboardingProps) {
  const { setUserId, setUserName, setOnboarded } = useAppStore();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleGoal = (id: string) => {
    setSelectedGoals((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const handleComplete = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email: email.trim() || `${name.toLowerCase().replace(/\s+/g, ".")}@lifeos.app`,
          role,
          goals: selectedGoals,
        }),
      });
      const user = await res.json();
      
      if (user.id) {
        setUserId(user.id);
        setUserName(user.name);
        setOnboarded(true);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (e) {
      console.error(e);
      setError("Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex justify-center relative overflow-y-auto py-8">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative z-10 text-center max-w-lg mx-auto px-6 py-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="flex justify-center mb-6"
            >
              <Logo size="lg" />
            </motion.div>
            <p className="text-zinc-400 text-lg mb-8">
              Your complete life management system. Organize everything. Achieve
              anything.
            </p>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="What's your name?"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all text-lg"
              />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => name.trim() && setStep(1)}
              disabled={!name.trim()}
              className="mt-6 w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-cyan-600 to-amber-500 text-white font-semibold text-lg disabled:opacity-40 transition-opacity"
            >
              Get Started →
            </motion.button>

            {/* Login link */}
            {onSwitchToLogin && (
              <p className="mt-6 text-zinc-400 text-sm">
                Already have an account?{" "}
                <button
                  onClick={onSwitchToLogin}
                  className="text-purple-400 hover:text-purple-300 font-medium"
                >
                  Login
                </button>
              </p>
            )}
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="role"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative z-10 text-center max-w-lg mx-auto px-6 py-8"
          >
            <h2 className="text-3xl font-bold text-center mb-2">
              Who are you, <span className="gradient-text">{name}</span>?
            </h2>
            <p className="text-zinc-400 text-center mb-8">
              This helps us personalize your experience
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {roles.map((r) => (
                <motion.button
                  key={r.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setRole(r.id)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    role === r.id
                      ? "bg-purple-500/20 border-purple-500/50 shadow-lg shadow-purple-500/10"
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  }`}
                >
                  <div className="text-2xl mb-2">{r.icon}</div>
                  <div className="font-medium text-sm">{r.label}</div>
                  <div className="text-xs text-zinc-500">{r.desc}</div>
                </motion.button>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep(0)}
                className="px-6 py-4 rounded-2xl bg-white/5 text-white font-medium"
              >
                ← Back
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => role && setStep(2)}
                disabled={!role}
                className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-cyan-600 to-amber-500 text-white font-semibold text-lg disabled:opacity-40 transition-opacity"
              >
                Continue →
              </motion.button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="goals"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative z-10 text-center max-w-lg mx-auto px-6 py-8"
          >
            <h2 className="text-3xl font-bold text-center mb-2">
              What are your main goals?
            </h2>
            <p className="text-zinc-400 text-center mb-8">
              Select all that apply
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {goalOptions.map((g) => (
                <motion.button
                  key={g.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => toggleGoal(g.id)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    selectedGoals.includes(g.id)
                      ? "bg-purple-500/20 border-purple-500/50 shadow-lg shadow-purple-500/10"
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  }`}
                >
                  <div className="text-lg mb-2">{g.icon}</div>
                  <div className="font-medium text-sm">{g.label}</div>
                </motion.button>
              ))}
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 text-red-400 text-sm text-center bg-red-500/10 rounded-lg py-2"
              >
                {error}
              </motion.p>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-4 rounded-2xl bg-white/5 text-white font-medium"
              >
                ← Back
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleComplete}
                disabled={selectedGoals.length === 0 || loading}
                className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-cyan-600 to-amber-500 text-white font-semibold text-lg disabled:opacity-40 transition-opacity"
              >
                {loading ? "Setting up your universe..." : "Launch LifeOS 🚀"}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
