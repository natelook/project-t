/*
  Warnings:

  - The required column `slug` was added to the `Tournament` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Tournament" ADD COLUMN     "slug" TEXT NOT NULL;
