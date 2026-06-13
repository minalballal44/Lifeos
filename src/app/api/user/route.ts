import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, role, goals } = body;

  // Check if user exists
  const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (existing.length > 0) {
    return NextResponse.json(existing[0]);
  }

  const [user] = await db.insert(users).values({
    name,
    email,
    role: role || "student",
    goals: goals || [],
    onboarded: true,
  }).returning();

  return NextResponse.json(user);
}

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("id");
  if (!userId) return NextResponse.json({ error: "No id" }, { status: 400 });

  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(user);
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, ...data } = body;
  if (!id) return NextResponse.json({ error: "No id" }, { status: 400 });

  const [user] = await db.update(users).set(data).where(eq(users.id, id)).returning();
  return NextResponse.json(user);
}
