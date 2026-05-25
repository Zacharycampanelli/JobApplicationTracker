/*
  Warnings:

  - Made the column `userId` on table `JobApplication` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `Resume` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "JobApplication" DROP CONSTRAINT "JobApplication_userId_fkey";

-- DropForeignKey
ALTER TABLE "Resume" DROP CONSTRAINT "Resume_userId_fkey";

-- AlterTable
ALTER TABLE "JobApplication" ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Resume" ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "JobApplication" ADD CONSTRAINT "JobApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resume" ADD CONSTRAINT "Resume_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
