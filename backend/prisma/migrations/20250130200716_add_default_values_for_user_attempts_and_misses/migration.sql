/*
  Warnings:

  - Made the column `attempts` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `misses` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "attempts" SET NOT NULL,
ALTER COLUMN "attempts" SET DEFAULT 1,
ALTER COLUMN "misses" SET NOT NULL,
ALTER COLUMN "misses" SET DEFAULT 0;
