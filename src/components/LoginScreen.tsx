"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/lib/store";
import Logo from "./Logo";

interface LoginScreenProps {
  onSwitchToSignup: () => void;
}

export default function LoginScreen({ onSwitchToSignup }: LoginScreenProps) {
  const { setUserId, setUserName, setOnboarded } = useAppStore();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Try to find user by email
      const res = await fetch("/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok && data.id) {
        setUserId(data.id);
        setUserName(data.name);
        setOnboarded(true);
      } else {
        setError(data.error || "User not found. Please sign up first.");
      }
    } catch (e) {
      console.error(e);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full w-full flex items-center justify-center relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md mx-auto px-6"
      >
        <div className="flex justify-center mb-8">
          <Logo size="lg" />
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
          <h2 className="text-2xl font-bold text-center mb-2">Welcome Back! 👋</h2>
          <p className="text-zinc-400 text-center text-sm mb-6">
            Login to continue your journey
          </p>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-zinc-400 mb-1.5 block">Email Address</label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm text-center bg-red-500/10 rounded-lg py-2"
              >
                {error}
              </motion.p>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-cyan-600 to-amber-500 text-white font-semibold disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login →"}
            </motion.button>
          </div>

          <div className="mt-6 pt-6 border-t border-white/5 text-center">
            <p className="text-zinc-400 text-sm">
              Don&apos;t have an account?{" "}
              <button
                onClick={onSwitchToSignup}
                className="text-purple-400 hover:text-purple-300 font-medium"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
