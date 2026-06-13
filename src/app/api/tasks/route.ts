import { db } from "@/db";
import { tasks, users } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json([]);

  const result = await db
    .select()
    .from(tasks)
    .where(eq(tasks.userId, userId))
    .orderBy(desc(tasks.createdAt));

  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const [task] = await db.insert(tasks).values(body).returning();

  // Add XP for creating task
  if (body.userId) {
    const [user] = await db.select().from(users).where(eq(users.id, body.userId));
    if (user) {
      await db.update(users).set({ xp: user.xp + 5 }).where(eq(users.id, body.userId));
    }
  }

  return NextResponse.json(task);
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, ...data } = body;
  if (!id) return NextResponse.json({ error: "No id" }, { status: 400 });

  if (data.completed === true) {
    data.completedAt = new Date();
    // Add XP for completing task
    if (data.userId) {
      const [user] = await db.select().from(users).where(eq(users.id, data.userId));
      if (user) {
        const xpGain = data.priority === "urgent" ? 30 : data.priority === "high" ? 20 : 10;
        await db.update(users).set({ xp: user.xp + xpGain }).where(eq(users.id, data.userId));
      }
      delete data.userId;
    }
  }

  const [task] = await db.update(tasks).set(data).where(eq(tasks.id, id)).returning();
  return NextResponse.json(task);
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "No id" }, { status: 400 });
  await db.delete(tasks).where(eq(tasks.id, id));
  return NextResponse.json({ success: true });
}
