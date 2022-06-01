/*
  Warnings:

  - You are about to drop the `TeamMatch` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TeamMatch" DROP CONSTRAINT "TeamMatch_matchId_fkey";

-- DropForeignKey
ALTER TABLE "TeamMatch" DROP CONSTRAINT "TeamMatch_teamId_fkey";

-- DropTable
DROP TABLE "TeamMatch";
