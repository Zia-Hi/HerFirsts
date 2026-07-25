import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getPrisma } from "@/lib/prisma";

// Force dynamic rendering to prevent build-time errors
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const cookie = request.headers.get("cookie");
    const token = cookie?.split("; ").find((c) => c.startsWith("auth_token="))?.split("=")[1];

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; username: string };

    const prisma = await getPrisma();
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { gameProgress: true },
    });

    if (!user) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    return NextResponse.json({
      authenticated: true,
      id: user.id,
      username: user.username,
      email: user.email,
      gameProgress: user.gameProgress,
    });
  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }
}
