/*
  Warnings:

  - The primary key for the `Registrant` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Registrant` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_teamOneId_fkey";

-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_teamTwoId_fkey";

-- DropIndex
DROP INDEX "Registrant_id_key";

-- AlterTable
ALTER TABLE "Registrant" DROP CONSTRAINT "Registrant_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Registrant_pkey" PRIMARY KEY ("tournamentId", "teamId");

-- CreateTable
CREATE TABLE "TeamMatch" (
    "tournamentId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,

    CONSTRAINT "TeamMatch_pkey" PRIMARY KEY ("tournamentId","teamId","matchId")
);

-- AddForeignKey
ALTER TABLE "TeamMatch" ADD CONSTRAINT "TeamMatch_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMatch" ADD CONSTRAINT "TeamMatch_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
