import { db } from "@/db";
import { habits, habitLogs, users } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json([]);

  const result = await db
    .select()
    .from(habits)
    .where(eq(habits.userId, userId))
    .orderBy(desc(habits.createdAt));

  // Get logs for each habit
  const habitsWithLogs = await Promise.all(
    result.map(async (habit) => {
      const logs = await db
        .select()
        .from(habitLogs)
        .where(eq(habitLogs.habitId, habit.id))
        .orderBy(desc(habitLogs.date));
      return { ...habit, logs };
    })
  );

  return NextResponse.json(habitsWithLogs);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const [habit] = await db.insert(habits).values(body).returning();
  return NextResponse.json(habit);
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "No id" }, { status: 400 });
  await db.delete(habitLogs).where(eq(habitLogs.habitId, id));
  await db.delete(habits).where(eq(habits.id, id));
  return NextResponse.json({ success: true });
}
