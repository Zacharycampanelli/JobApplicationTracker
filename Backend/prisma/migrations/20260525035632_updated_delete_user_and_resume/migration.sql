/*
  Warnings:

  - Added the required column `mimeType` to the `Resume` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "JobApplication" DROP CONSTRAINT "JobApplication_resumeId_fkey";

-- DropForeignKey
ALTER TABLE "JobApplication" DROP CONSTRAINT "JobApplication_userId_fkey";

-- DropForeignKey
ALTER TABLE "Resume" DROP CONSTRAINT "Resume_userId_fkey";

-- AlterTable
ALTER TABLE "JobApplication" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Resume" ADD COLUMN     "mimeType" TEXT NOT NULL,
ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "JobApplication" ADD CONSTRAINT "JobApplication_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobApplication" ADD CONSTRAINT "JobApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resume" ADD CONSTRAINT "Resume_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
