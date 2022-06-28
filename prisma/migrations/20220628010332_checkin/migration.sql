-- AlterTable
ALTER TABLE "Registrant" ADD COLUMN     "checkedIn" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Tournament" ADD COLUMN     "checkInStarted" BOOLEAN NOT NULL DEFAULT false;
