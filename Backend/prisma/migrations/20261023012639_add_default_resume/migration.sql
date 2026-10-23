-- AlterTable
ALTER TABLE "UserPreferences" ADD COLUMN     "defaultResumeId" INTEGER;

-- AddForeignKey
ALTER TABLE "UserPreferences" ADD CONSTRAINT "UserPreferences_defaultResumeId_fkey" FOREIGN KEY ("defaultResumeId") REFERENCES "Resume"("id") ON DELETE SET NULL ON UPDATE CASCADE;
