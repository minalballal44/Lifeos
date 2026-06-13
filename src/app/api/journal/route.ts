import { db } from "@/db";
import { journals, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json([]);

  const result = await db
    .select()
    .from(journals)
    .where(eq(journals.userId, userId))
    .orderBy(desc(journals.createdAt));

  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const [entry] = await db.insert(journals).values(body).returning();

  // Add XP for journaling
  if (body.userId) {
    const [user] = await db.select().from(users).where(eq(users.id, body.userId));
    if (user) {
      await db.update(users).set({ xp: user.xp + 15 }).where(eq(users.id, body.userId));
    }
  }

  return NextResponse.json(entry);
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "No id" }, { status: 400 });
  await db.delete(journals).where(eq(journals.id, id));
  return NextResponse.json({ success: true });
}
