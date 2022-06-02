/*
  Warnings:

  - You are about to drop the column `roundWinConditions` on the `Match` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Match" DROP COLUMN "roundWinConditions";

-- AlterTable
ALTER TABLE "Tournament" ADD COLUMN     "roundWinConditions" INTEGER[];
