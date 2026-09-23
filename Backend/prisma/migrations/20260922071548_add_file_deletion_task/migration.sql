-- CreateTable
CREATE TABLE "FileDeletionTask" (
    "id" SERIAL NOT NULL,
    "filePath" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FileDeletionTask_pkey" PRIMARY KEY ("id")
);
