"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppState {
  userId: string | null;
  userName: string;
  theme: "dark" | "light";
  onboarded: boolean;
  sidebarOpen: boolean;
  activeView: string;
  setUserId: (id: string) => void;
  setUserName: (name: string) => void;
  toggleTheme: () => void;
  setTheme: (t: "dark" | "light") => void;
  setOnboarded: (v: boolean) => void;
  setSidebarOpen: (v: boolean) => void;
  setActiveView: (v: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      userId: null,
      userName: "",
      theme: "dark",
      onboarded: false,
      sidebarOpen: true,
      activeView: "dashboard",
      setUserId: (id) => set({ userId: id }),
      setUserName: (name) => set({ userName: name }),
      toggleTheme: () =>
        set((s) => ({ theme: s.theme === "dark" ? "light" : "dark" })),
      setTheme: (t) => set({ theme: t }),
      setOnboarded: (v) => set({ onboarded: v }),
      setSidebarOpen: (v) => set({ sidebarOpen: v }),
      setActiveView: (v) => set({ activeView: v }),
    }),
    { name: "lifeos-store" }
  )
);
