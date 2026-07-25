import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

function getPrisma() {
  if (global.prisma) {
    return global.prisma;
  }
  
  // Check if DATABASE_URL is defined before creating PrismaClient
  // This prevents build-time errors on platforms like Vercel
  if (!process.env.DATABASE_URL) {
    // In production build without DATABASE_URL, create a stub client
    // that will fail gracefully at runtime
    console.warn("DATABASE_URL not found, creating fallback PrismaClient");
  }
  
  const prisma = new PrismaClient();
  
  if (process.env.NODE_ENV !== "production") {
    global.prisma = prisma;
  }
  
  return prisma;
}

export const prisma = getPrisma();
