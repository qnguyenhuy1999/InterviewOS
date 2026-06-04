-- CreateEnum
CREATE TYPE "TurnRole" AS ENUM ('INTERVIEWER', 'CANDIDATE');

-- CreateEnum
CREATE TYPE "TurnDecision" AS ENUM ('FOLLOW_UP', 'DEEP_DIVE', 'CLARIFY', 'CHALLENGE', 'ESCALATE', 'ADVANCE', 'WRAP_UP', 'EVALUATE');

-- CreateEnum
CREATE TYPE "SessionMode" AS ENUM ('STANDARD', 'MULTI_TURN', 'COMPANY');

-- CreateEnum
CREATE TYPE "EvaluationStatus" AS ENUM ('PENDING', 'COMPLETE', 'FAILED');

-- CreateEnum
CREATE TYPE "StarDimension" AS ENUM ('SITUATION', 'TASK', 'ACTION', 'RESULT');

-- AlterTable
ALTER TABLE "InterviewSession"
ADD COLUMN "mode" "SessionMode" NOT NULL DEFAULT 'STANDARD',
ADD COLUMN "companyModeId" TEXT,
ADD COLUMN "parentSessionId" TEXT,
ADD COLUMN "version" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN "maxTurns" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN "currentTurnNum" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "lastActivityAt" TIMESTAMP(3),
ADD COLUMN "contextSnapshot" JSONB;

-- CreateTable
CREATE TABLE "CompanyMode" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "config" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompanyMode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InterviewTurn" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "turnNumber" INTEGER NOT NULL,
    "role" "TurnRole" NOT NULL,
    "content" TEXT NOT NULL,
    "decision" "TurnDecision",
    "topicTags" TEXT[],
    "reasoning" TEXT,
    "references" JSONB,
    "evaluation" JSONB,
    "aiMetadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InterviewTurn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InterviewEvaluation" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "status" "EvaluationStatus" NOT NULL DEFAULT 'PENDING',
    "overallScore" INTEGER,
    "summary" TEXT,
    "confidence" INTEGER,
    "dimensionScores" JSONB NOT NULL,
    "starScores" JSONB,
    "designScores" JSONB,
    "rubricScores" JSONB,
    "evidence" JSONB,
    "weaknesses" JSONB,
    "recommendations" JSONB,
    "strengths" TEXT[],
    "improvements" TEXT[],
    "coachingNotes" TEXT[],
    "weakConcepts" TEXT[],
    "aiMetadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InterviewEvaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InterviewSummary" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "generatedFromVersion" INTEGER NOT NULL DEFAULT 1,
    "headline" TEXT NOT NULL,
    "keyTakeaways" TEXT[],
    "strengths" TEXT[],
    "weaknesses" TEXT[],
    "recommendations" TEXT[],
    "transcript" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InterviewSummary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InterviewReadinessImpact" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "overallDelta" INTEGER NOT NULL,
    "technicalDelta" INTEGER NOT NULL,
    "behavioralDelta" INTEGER NOT NULL,
    "systemDesignDelta" INTEGER NOT NULL,
    "communicationDelta" INTEGER NOT NULL,
    "consistencyDelta" INTEGER NOT NULL,
    "snapshot" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InterviewReadinessImpact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InterviewAnalytics" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "interviewsCompleted" INTEGER NOT NULL,
    "averageScore" INTEGER,
    "strongConcepts" TEXT[],
    "weakConcepts" TEXT[],
    "trend7d" JSONB,
    "trend30d" JSONB,
    "trend90d" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InterviewAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReadinessSnapshot" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "overallScore" INTEGER NOT NULL,
    "confidenceLevel" DOUBLE PRECISION NOT NULL,
    "technicalMastery" DOUBLE PRECISION NOT NULL,
    "interviewPerformance" DOUBLE PRECISION NOT NULL,
    "behavioralPerformance" DOUBLE PRECISION NOT NULL,
    "systemDesignPerformance" DOUBLE PRECISION NOT NULL,
    "englishCommunication" DOUBLE PRECISION NOT NULL,
    "reviewCompletion" DOUBLE PRECISION NOT NULL,
    "learningProgress" DOUBLE PRECISION NOT NULL,
    "breakdown" JSONB NOT NULL,
    "improvementTrend" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "computedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReadinessSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CompanyMode_slug_key" ON "CompanyMode"("slug");

-- CreateIndex
CREATE INDEX "CompanyMode_slug_idx" ON "CompanyMode"("slug");

-- CreateIndex
CREATE INDEX "CompanyMode_isActive_idx" ON "CompanyMode"("isActive");

-- CreateIndex
CREATE INDEX "InterviewTurn_sessionId_turnNumber_idx" ON "InterviewTurn"("sessionId", "turnNumber");

-- CreateIndex
CREATE INDEX "InterviewTurn_sessionId_role_idx" ON "InterviewTurn"("sessionId", "role");

-- CreateIndex
CREATE UNIQUE INDEX "InterviewEvaluation_sessionId_key" ON "InterviewEvaluation"("sessionId");

-- CreateIndex
CREATE INDEX "InterviewEvaluation_sessionId_idx" ON "InterviewEvaluation"("sessionId");

-- CreateIndex
CREATE INDEX "InterviewEvaluation_status_idx" ON "InterviewEvaluation"("status");

-- CreateIndex
CREATE UNIQUE INDEX "InterviewSummary_sessionId_key" ON "InterviewSummary"("sessionId");

-- CreateIndex
CREATE INDEX "InterviewSummary_sessionId_idx" ON "InterviewSummary"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "InterviewReadinessImpact_sessionId_key" ON "InterviewReadinessImpact"("sessionId");

-- CreateIndex
CREATE INDEX "InterviewReadinessImpact_userId_createdAt_idx" ON "InterviewReadinessImpact"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "InterviewSession_parentSessionId_idx" ON "InterviewSession"("parentSessionId");

-- CreateIndex
CREATE INDEX "InterviewSession_userId_lastActivityAt_idx" ON "InterviewSession"("userId", "lastActivityAt");

-- CreateIndex
CREATE INDEX "InterviewAnalytics_userId_createdAt_idx" ON "InterviewAnalytics"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "ReadinessSnapshot_userId_computedAt_idx" ON "ReadinessSnapshot"("userId", "computedAt");

-- AddForeignKey
ALTER TABLE "InterviewSession" ADD CONSTRAINT "InterviewSession_companyModeId_fkey" FOREIGN KEY ("companyModeId") REFERENCES "CompanyMode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewSession" ADD CONSTRAINT "InterviewSession_parentSessionId_fkey" FOREIGN KEY ("parentSessionId") REFERENCES "InterviewSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewTurn" ADD CONSTRAINT "InterviewTurn_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "InterviewSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewEvaluation" ADD CONSTRAINT "InterviewEvaluation_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "InterviewSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewSummary" ADD CONSTRAINT "InterviewSummary_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "InterviewSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewReadinessImpact" ADD CONSTRAINT "InterviewReadinessImpact_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "InterviewSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewReadinessImpact" ADD CONSTRAINT "InterviewReadinessImpact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewAnalytics" ADD CONSTRAINT "InterviewAnalytics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReadinessSnapshot" ADD CONSTRAINT "ReadinessSnapshot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
