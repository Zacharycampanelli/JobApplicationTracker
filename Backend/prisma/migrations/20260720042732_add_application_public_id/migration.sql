/*
  Warnings:

  - A unique constraint covering the columns `[publicId]` on the table `JobApplication` will be added. If there are existing duplicate values, this will fail.
  - The required column `publicId` was added to the `JobApplication` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- Add the column as optional for the existing rows.
ALTER TABLE "JobApplication"
ADD COLUMN "publicId" TEXT;

-- Give every existing application a random identifier.
UPDATE "JobApplication"
SET "publicId" = gen_random_uuid()::text
WHERE "publicId" IS NULL;

-- Now that every row has a value, make it required.
ALTER TABLE "JobApplication"
ALTER COLUMN "publicId" SET NOT NULL;

-- Enforce uniqueness.
CREATE UNIQUE INDEX "JobApplication_publicId_key"
ON "JobApplication"("publicId");