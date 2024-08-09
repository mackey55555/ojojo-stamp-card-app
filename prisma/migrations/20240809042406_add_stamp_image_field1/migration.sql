/*
  Warnings:

  - You are about to drop the column `stampImages` on the `StampCard` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "StampCard" DROP COLUMN "stampImages",
ADD COLUMN     "stampImage" TEXT NOT NULL DEFAULT '/stamp.png';
