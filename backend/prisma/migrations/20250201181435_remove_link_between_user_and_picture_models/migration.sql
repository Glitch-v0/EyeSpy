/*
  Warnings:

  - You are about to drop the column `userId` on the `Picture` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Picture" DROP CONSTRAINT "Picture_userId_fkey";

-- AlterTable
ALTER TABLE "Picture" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "picturesGuessed" TEXT[];
