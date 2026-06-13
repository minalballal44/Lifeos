import { db } from "@/db";
import { habitLogs, habits, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { habitId, userId, date } = body;

  // Check if already logged
  const existing = await db
    .select()
    .from(habitLogs)
    .where(and(eq(habitLogs.habitId, habitId), eq(habitLogs.date, date)));

  if (existing.length > 0) {
    // Remove log (toggle off)
    await db.delete(habitLogs).where(eq(habitLogs.id, existing[0].id));

    // Decrease streak
    const [habit] = await db.select().from(habits).where(eq(habits.id, habitId));
    if (habit) {
      await db
        .update(habits)
        .set({
          currentStreak: Math.max(0, habit.currentStreak - 1),
          totalCompletions: Math.max(0, habit.totalCompletions - 1),
        })
        .where(eq(habits.id, habitId));
    }

    return NextResponse.json({ toggled: false });
  }

  // Add log
  await db.insert(habitLogs).values({ habitId, userId, date });

  // Update streak
  const [habit] = await db.select().from(habits).where(eq(habits.id, habitId));
  if (habit) {
    const newStreak = habit.currentStreak + 1;
    await db
      .update(habits)
      .set({
        currentStreak: newStreak,
        longestStreak: Math.max(newStreak, habit.longestStreak),
        totalCompletions: habit.totalCompletions + 1,
      })
      .where(eq(habits.id, habitId));
  }

  // Add XP
  if (userId) {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (user) {
      await db.update(users).set({ xp: user.xp + 10 }).where(eq(users.id, userId));
    }
  }

  return NextResponse.json({ toggled: true });
}
