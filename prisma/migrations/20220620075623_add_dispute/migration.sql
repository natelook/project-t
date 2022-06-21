-- CreateTable
CREATE TABLE "Dispute" (
    "id" TEXT NOT NULL,
    "reporterId" TEXT NOT NULL,
    "matchId" INTEGER NOT NULL,
    "tournamentId" TEXT NOT NULL,
    "message" TEXT,

    CONSTRAINT "Dispute_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Dispute_id_key" ON "Dispute"("id");

-- AddForeignKey
ALTER TABLE "Dispute" ADD CONSTRAINT "Dispute_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dispute" ADD CONSTRAINT "Dispute_matchId_tournamentId_fkey" FOREIGN KEY ("matchId", "tournamentId") REFERENCES "Match"("matchId", "tournamentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dispute" ADD CONSTRAINT "Dispute_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
