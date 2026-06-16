"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import Onboarding from "@/components/Onboarding";
import LoginScreen from "@/components/LoginScreen";
import AppShell from "@/components/AppShell";

export default function Home() {
  const { userId, onboarded, theme } = useAppStore();
  const [mounted, setMounted] = useState(false);
  const [authMode, setAuthMode] = useState<"signup" | "login">("signup");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen w-full bg-[#0F0F14] flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">∞</div>
          <div className="text-2xl font-bold gradient-text mb-2">LifeOS</div>
          <div className="text-zinc-500 text-sm">Loading your universe...</div>
        </div>
      </div>
    );
  }

  const isDark = theme === "dark";

  // If user is logged in
  if (onboarded && userId) {
    return (
      <div
        className={`h-screen w-screen transition-colors duration-300 ${
          isDark ? "bg-[#0F0F14] text-zinc-100" : "bg-[#FAFBFC] text-zinc-900"
        }`}
      >
        <AppShell />
      </div>
    );
  }

  // Auth screens
  return (
    <div
  className={`min-h-screen w-full transition-colors duration-300 ${
        isDark ? "bg-[#0F0F14] text-zinc-100" : "bg-[#FAFBFC] text-zinc-900"
      }`}
    >
      {authMode === "signup" ? (
        <Onboarding onSwitchToLogin={() => setAuthMode("login")} />
      ) : (
        <LoginScreen onSwitchToSignup={() => setAuthMode("signup")} />
      )}
    </div>
  );
}
