import { db } from "@/db";
import { goals, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json([]);

  const result = await db
    .select()
    .from(goals)
    .where(eq(goals.userId, userId))
    .orderBy(desc(goals.createdAt));

  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const [goal] = await db.insert(goals).values(body).returning();
  return NextResponse.json(goal);
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, userId, ...data } = body;
  if (!id) return NextResponse.json({ error: "No id" }, { status: 400 });

  if (data.completed === true && userId) {
    data.completedAt = new Date();
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (user) {
      await db.update(users).set({ xp: user.xp + 50 }).where(eq(users.id, userId));
    }
  }

  const [goal] = await db.update(goals).set(data).where(eq(goals.id, id)).returning();
  return NextResponse.json(goal);
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "No id" }, { status: 400 });
  await db.delete(goals).where(eq(goals.id, id));
  return NextResponse.json({ success: true });
}
