/*
  Warnings:

  - You are about to drop the column `stream` on the `Tournament` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Tournament" DROP COLUMN "stream",
ADD COLUMN     "mainStream" TEXT;
