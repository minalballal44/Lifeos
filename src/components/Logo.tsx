"use client";

import { motion } from "framer-motion";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export default function Logo({ size = "md", showText = true }: LogoProps) {
  const sizes = {
    sm: { icon: 32, text: "text-lg" },
    md: { icon: 40, text: "text-xl" },
    lg: { icon: 64, text: "text-3xl" },
  };

  const s = sizes[size];

  return (
    <div className="flex items-center gap-3">
      <motion.div
        className="relative"
        whileHover={{ scale: 1.05, rotate: 5 }}
        style={{ width: s.icon, height: s.icon }}
      >
        {/* Outer glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-cyan-500 to-amber-500 rounded-2xl blur-md opacity-50 animate-pulse" />
        
        {/* Main container */}
        <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-600 p-[2px] overflow-hidden">
          <div className="w-full h-full rounded-[14px] bg-[#0c0c10] flex items-center justify-center relative overflow-hidden">
            {/* Inner gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-transparent to-cyan-600/20" />
            
            {/* Animated rings */}
            <motion.div
              className="absolute inset-2 rounded-full border border-purple-500/30"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-3 rounded-full border border-cyan-500/20"
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Center infinity/life symbol */}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-1/2 h-1/2 relative z-10"
            >
              {/* Infinity symbol representing life cycles */}
              <motion.path
                d="M12 12c-2-2-4-3-6-3s-4 1.5-4 4 2 4 4 4c2 0 4-1 6-3 2 2 4 3 6 3s4-1.5 4-4-2-4-4-4c-2 0-4 1-6 3z"
                stroke="url(#logoGradient)"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
              {/* Center dot */}
              <circle cx="12" cy="12" r="2" fill="url(#logoGradient)" />
              <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#A855F7" />
                  <stop offset="50%" stopColor="#06B6D4" />
                  <stop offset="100%" stopColor="#F59E0B" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </motion.div>

      {showText && (
        <div>
          <h1 className={`font-bold ${s.text} tracking-tight`}>
            <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-amber-400 bg-clip-text text-transparent">
              Life
            </span>
            <span className="text-white">OS</span>
          </h1>
          {size !== "sm" && (
            <p className="text-[10px] text-zinc-500 -mt-0.5">Your Life, Optimized</p>
          )}
        </div>
      )}
    </div>
  );
}
