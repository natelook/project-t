/*
  Warnings:

  - You are about to drop the column `teamMatchId` on the `Match` table. All the data in the column will be lost.
  - Added the required column `round` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `game` to the `Tournament` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Match" DROP COLUMN "teamMatchId",
ADD COLUMN     "matchIdentifier" SERIAL NOT NULL,
ADD COLUMN     "nextMatch" INTEGER,
ADD COLUMN     "round" INTEGER NOT NULL,
ALTER COLUMN "teamOneId" DROP NOT NULL,
ALTER COLUMN "teamTwoId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Tournament" ADD COLUMN     "game" TEXT NOT NULL;
