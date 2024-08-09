/*
  Warnings:

  - You are about to drop the `Stamp` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Stamp" DROP CONSTRAINT "Stamp_stampCardId_fkey";

-- AlterTable
ALTER TABLE "StampCard" ADD COLUMN     "stamps" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "Stamp";
