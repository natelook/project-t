-- CreateTable
CREATE TABLE "CSGOMatch" (
    "id" TEXT NOT NULL,
    "team1Players" TEXT[],
    "team2Players" TEXT[],
    "team1Score" INTEGER NOT NULL DEFAULT 0,
    "team2Score" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip" TEXT,
    "serverMatchId" TEXT,
    "playerStats" TEXT,
    "started" BOOLEAN NOT NULL DEFAULT false,
    "finished" BOOLEAN NOT NULL DEFAULT false,
    "roundsPlayed" INTEGER NOT NULL DEFAULT 0,
    "maps" JSONB NOT NULL,

    CONSTRAINT "CSGOMatch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CSGOMatch_id_key" ON "CSGOMatch"("id");
