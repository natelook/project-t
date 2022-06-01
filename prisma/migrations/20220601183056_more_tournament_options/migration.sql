-- AlterTable
ALTER TABLE "Tournament" ADD COLUMN     "maxRegistrants" INTEGER NOT NULL DEFAULT 32,
ADD COLUMN     "stream" TEXT;
