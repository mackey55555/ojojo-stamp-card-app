/*
  Warnings:

  - The `stampImages` column on the `StampCard` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "StampCard" DROP COLUMN "stampImages",
ADD COLUMN     "stampImages" JSONB NOT NULL DEFAULT '[]';
