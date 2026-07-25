import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getPrisma } from "@/lib/prisma";

// Force dynamic rendering to prevent build-time errors
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const cookie = request.headers.get("cookie");
    const token = cookie?.split("; ").find((c) => c.startsWith("auth_token="))?.split("=")[1];

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

    const { progress } = await request.json();

    const prisma = await getPrisma();
    const updatedProgress = await prisma.gameProgress.update({
      where: { userId: decoded.userId },
      data: {
        completedMissions: progress.completedMissions || [],
        mission2Started: progress.mission2Started || false,
        mission4Started: progress.mission4Started || false,
        lightingEventShown: progress.lightingEventShown || false,
        lightingToolsCollected: progress.lightingToolsCollected || false,
        lightingPrecautionShown: progress.lightingPrecautionShown || false,
        chapter1LetterPending: progress.chapter1LetterPending || false,
        chapter1LetterShown: progress.chapter1LetterShown || false,
        chapter2LetterPending: progress.chapter2LetterPending || false,
        chapter2LetterShown: progress.chapter2LetterShown || false,
        chapter3LetterPending: progress.chapter3LetterPending || false,
        chapter3LetterShown: progress.chapter3LetterShown || false,
        endingShown: progress.endingShown || false,
      },
    });

    return NextResponse.json({ success: true, progress: updatedProgress });
  } catch (error) {
    console.error("Save progress error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
