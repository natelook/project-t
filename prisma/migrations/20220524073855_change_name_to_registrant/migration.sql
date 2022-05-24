/*
  Warnings:

  - You are about to drop the `TeamOnTournament` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TeamOnTournament" DROP CONSTRAINT "TeamOnTournament_teamId_fkey";

-- DropForeignKey
ALTER TABLE "TeamOnTournament" DROP CONSTRAINT "TeamOnTournament_tournamentId_fkey";

-- DropForeignKey
ALTER TABLE "TeamOnTournament" DROP CONSTRAINT "TeamOnTournament_user_id_fkey";

-- DropTable
DROP TABLE "TeamOnTournament";

-- CreateTable
CREATE TABLE "Registrant" (
    "tournamentId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "registeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Registrant_pkey" PRIMARY KEY ("tournamentId","teamId")
);

-- AddForeignKey
ALTER TABLE "Registrant" ADD CONSTRAINT "Registrant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Registrant" ADD CONSTRAINT "Registrant_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Registrant" ADD CONSTRAINT "Registrant_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
