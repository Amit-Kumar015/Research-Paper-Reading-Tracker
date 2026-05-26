-- CreateEnum
CREATE TYPE "ResearchDomain" AS ENUM ('COMPUTER_SCIENCE', 'BIOLOGY', 'PHYSICS', 'CHEMISTRY', 'MATHEMATICS', 'SOCIAL_SCIENCES');

-- CreateEnum
CREATE TYPE "ReadingStage" AS ENUM ('ABSTRACT_READ', 'INTRODUCTION_DONE', 'METHODOLOGY_DONE', 'RESULTS_ANALYZED', 'FULLY_READ', 'NOTES_COMPLETED');

-- CreateEnum
CREATE TYPE "ImpactScore" AS ENUM ('HIGH_IMPACT', 'MEDIUM_IMPACT', 'LOW_IMPACT', 'UNKNOWN');

-- CreateTable
CREATE TABLE "Paper" (
    "id" TEXT NOT NULL,
    "paperTitle" TEXT NOT NULL,
    "firstAuthorName" TEXT NOT NULL,
    "researchDomain" "ResearchDomain" NOT NULL,
    "readingStage" "ReadingStage" NOT NULL,
    "impactScore" "ImpactScore" NOT NULL,
    "citationCount" INTEGER NOT NULL,
    "dateAdded" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Paper_pkey" PRIMARY KEY ("id")
);
