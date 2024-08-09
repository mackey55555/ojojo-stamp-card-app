/*
  Warnings:

  - You are about to drop the column `stampImage` on the `StampCard` table. All the data in the column will be lost.
  - You are about to drop the column `stamps` on the `StampCard` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "StampCard" DROP COLUMN "stampImage",
DROP COLUMN "stamps";

-- CreateTable
CREATE TABLE "Stamp" (
    "id" SERIAL NOT NULL,
    "stampCardId" INTEGER NOT NULL,
    "stampImage" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Stamp_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Stamp" ADD CONSTRAINT "Stamp_stampCardId_fkey" FOREIGN KEY ("stampCardId") REFERENCES "StampCard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
