import { db } from "@/db";
import { tasks, goals, habits, journals, moods, focusSessions, achievements } from "@/db/schema";
import { eq, and, gte, desc, count, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "No userId" }, { status: 400 });

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Tasks stats
  const allTasks = await db.select().from(tasks).where(eq(tasks.userId, userId));
  const completedTasks = allTasks.filter((t) => t.completed);
  const recentCompleted = completedTasks.filter(
    (t) => t.completedAt && new Date(t.completedAt) >= weekAgo
  );

  // Goals stats
  const allGoals = await db.select().from(goals).where(eq(goals.userId, userId));
  const completedGoals = allGoals.filter((g) => g.completed);

  // Habits stats
  const allHabits = await db.select().from(habits).where(eq(habits.userId, userId));
  const totalStreaks = allHabits.reduce((s, h) => s + h.currentStreak, 0);

  // Mood stats
  const recentMoods = await db
    .select()
    .from(moods)
    .where(and(eq(moods.userId, userId)))
    .orderBy(desc(moods.date))
    .limit(7);

  const moodValues: Record<string, number> = {
    great: 5,
    good: 4,
    okay: 3,
    sad: 2,
    stressed: 1,
  };
  const avgMood =
    recentMoods.length > 0
      ? recentMoods.reduce((s, m) => s + (moodValues[m.mood] || 3), 0) / recentMoods.length
      : 3;

  // Focus sessions
  const sessions = await db
    .select()
    .from(focusSessions)
    .where(eq(focusSessions.userId, userId));
  const totalFocusMinutes = sessions.reduce((s, f) => s + f.duration, 0);

  // Journal count
  const journalEntries = await db.select().from(journals).where(eq(journals.userId, userId));

  // Productivity score (weighted)
  const taskScore = allTasks.length > 0 ? (completedTasks.length / allTasks.length) * 100 : 0;
  const goalScore = allGoals.length > 0 ? (completedGoals.length / allGoals.length) * 100 : 0;
  const habitScore =
    allHabits.length > 0
      ? allHabits.reduce((s, h) => s + (h.totalCompletions > 0 ? 1 : 0), 0) /
        allHabits.length *
        100
      : 0;
  const productivityScore = Math.round((taskScore * 0.4 + goalScore * 0.3 + habitScore * 0.3));

  // Achievements
  const userAchievements = await db
    .select()
    .from(achievements)
    .where(eq(achievements.userId, userId));

  return NextResponse.json({
    totalTasks: allTasks.length,
    completedTasks: completedTasks.length,
    weeklyCompleted: recentCompleted.length,
    totalGoals: allGoals.length,
    completedGoals: completedGoals.length,
    goalProgress: allGoals.length > 0 ? Math.round(allGoals.reduce((s, g) => s + g.progress, 0) / allGoals.length) : 0,
    totalHabits: allHabits.length,
    totalStreaks,
    avgMood: Math.round(avgMood * 10) / 10,
    moodScore: Math.round((avgMood / 5) * 100),
    totalFocusMinutes,
    totalJournals: journalEntries.length,
    productivityScore,
    achievements: userAchievements,
    recentMoods,
  });
}
