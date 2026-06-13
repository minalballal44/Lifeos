import { db } from "@/db";
import { moods } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json([]);

  const result = await db
    .select()
    .from(moods)
    .where(eq(moods.userId, userId))
    .orderBy(desc(moods.date));

  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const [entry] = await db.insert(moods).values(body).returning();
  return NextResponse.json(entry);
}
