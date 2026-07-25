-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_progress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "completedMissions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "mission2Started" BOOLEAN NOT NULL DEFAULT false,
    "mission4Started" BOOLEAN NOT NULL DEFAULT false,
    "lightingEventShown" BOOLEAN NOT NULL DEFAULT false,
    "lightingToolsCollected" BOOLEAN NOT NULL DEFAULT false,
    "lightingPrecautionShown" BOOLEAN NOT NULL DEFAULT false,
    "chapter1LetterPending" BOOLEAN NOT NULL DEFAULT false,
    "chapter1LetterShown" BOOLEAN NOT NULL DEFAULT false,
    "chapter2LetterPending" BOOLEAN NOT NULL DEFAULT false,
    "chapter2LetterShown" BOOLEAN NOT NULL DEFAULT false,
    "chapter3LetterPending" BOOLEAN NOT NULL DEFAULT false,
    "chapter3LetterShown" BOOLEAN NOT NULL DEFAULT false,
    "endingShown" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "game_progress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "game_progress_userId_key" ON "game_progress"("userId");

-- AddForeignKey
ALTER TABLE "game_progress" ADD CONSTRAINT "game_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
