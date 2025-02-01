/*
  Warnings:

  - You are about to drop the column `picturesFound` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "picturesFound",
ADD COLUMN     "picturesComplete" TEXT[];
