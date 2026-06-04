-- AlterTable
ALTER TABLE "InterviewSession"
ADD COLUMN "parentSessionId" TEXT,
ADD COLUMN "version" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN "lastActivityAt" TIMESTAMP(3),
ADD COLUMN "contextSnapshot" JSONB;

-- AlterTable
ALTER TABLE "InterviewTurn"
ADD COLUMN "reasoning" TEXT,
ADD COLUMN "references" JSONB,
ADD COLUMN "evaluation" JSONB;

-- AlterTable
ALTER TABLE "InterviewEvaluation"
ADD COLUMN "summary" TEXT,
ADD COLUMN "confidence" INTEGER,
ADD COLUMN "rubricScores" JSONB,
ADD COLUMN "evidence" JSONB,
ADD COLUMN "weaknesses" JSONB,
ADD COLUMN "recommendations" JSONB;

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

-- AddForeignKey
ALTER TABLE "InterviewSession" ADD CONSTRAINT "InterviewSession_parentSessionId_fkey" FOREIGN KEY ("parentSessionId") REFERENCES "InterviewSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewSummary" ADD CONSTRAINT "InterviewSummary_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "InterviewSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewReadinessImpact" ADD CONSTRAINT "InterviewReadinessImpact_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "InterviewSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewReadinessImpact" ADD CONSTRAINT "InterviewReadinessImpact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewAnalytics" ADD CONSTRAINT "InterviewAnalytics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
