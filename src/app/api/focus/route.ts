import { db } from "@/db";
import { focusSessions, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json([]);

  const result = await db
    .select()
    .from(focusSessions)
    .where(eq(focusSessions.userId, userId))
    .orderBy(desc(focusSessions.completedAt));

  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const [session] = await db.insert(focusSessions).values(body).returning();

  // Add XP
  if (body.userId) {
    const [user] = await db.select().from(users).where(eq(users.id, body.userId));
    if (user) {
      const xpGain = Math.floor(body.duration / 5) * 5;
      await db.update(users).set({ xp: user.xp + xpGain }).where(eq(users.id, body.userId));
    }
  }

  return NextResponse.json(session);
}
