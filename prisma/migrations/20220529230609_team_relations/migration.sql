/*
  Warnings:

  - The primary key for the `Registrant` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `TeamMatch` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[id]` on the table `Registrant` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `TeamMatch` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `Registrant` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `TeamMatch` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Registrant" DROP CONSTRAINT "Registrant_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Registrant_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "TeamMatch" DROP CONSTRAINT "TeamMatch_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "TeamMatch_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Registrant_id_key" ON "Registrant"("id");

-- CreateIndex
CREATE UNIQUE INDEX "TeamMatch_id_key" ON "TeamMatch"("id");

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_teamOneId_fkey" FOREIGN KEY ("teamOneId") REFERENCES "Registrant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_teamTwoId_fkey" FOREIGN KEY ("teamTwoId") REFERENCES "Registrant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
