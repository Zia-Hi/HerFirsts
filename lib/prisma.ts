import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Lazy initialization - only creates PrismaClient when actually needed
// This prevents build-time errors on platforms like Vercel where DATABASE_URL is not available during build
export async function getPrisma() {
  if (global.prisma) {
    return global.prisma;
  }
  
  // Check if DATABASE_URL is defined
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not defined");
  }
  
  const prisma = new PrismaClient();
  
  if (process.env.NODE_ENV !== "production") {
    global.prisma = prisma;
  }
  
  return prisma;
}
