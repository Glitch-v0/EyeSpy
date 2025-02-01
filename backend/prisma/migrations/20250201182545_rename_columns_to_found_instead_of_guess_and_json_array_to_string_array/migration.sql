/*
  Warnings:

  - You are about to drop the column `currentGuessCoordinates` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `picturesGuessed` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "currentGuessCoordinates",
DROP COLUMN "picturesGuessed",
ADD COLUMN     "eyesFound" TEXT[],
ADD COLUMN     "picturesFound" TEXT[];
