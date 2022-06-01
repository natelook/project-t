/*
  Warnings:

  - The primary key for the `Match` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `matchIdentifier` on the `Match` table. All the data in the column will be lost.
  - Added the required column `matchId` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Made the column `nextMatch` on table `Match` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Match_id_key";

-- AlterTable
ALTER TABLE "Match" DROP CONSTRAINT "Match_pkey",
DROP COLUMN "id",
DROP COLUMN "matchIdentifier",
ADD COLUMN     "matchId" INTEGER NOT NULL,
ALTER COLUMN "nextMatch" SET NOT NULL,
ADD CONSTRAINT "Match_pkey" PRIMARY KEY ("tournamentId", "matchId");
