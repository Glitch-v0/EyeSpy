/*
  Warnings:

  - A unique constraint covering the columns `[jwt]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Score" DROP CONSTRAINT "Score_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "currentGuessCoordinates" JSONB[],
ADD COLUMN     "jwt" TEXT,
ALTER COLUMN "initials" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_jwt_key" ON "User"("jwt");

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
