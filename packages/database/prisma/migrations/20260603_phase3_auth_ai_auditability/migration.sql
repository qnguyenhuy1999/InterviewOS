-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "ExperienceLevel" AS ENUM ('JUNIOR', 'MID', 'SENIOR', 'STAFF', 'PRINCIPAL');

-- CreateEnum
CREATE TYPE "EnglishLevel" AS ENUM ('BEGINNER', 'ELEMENTARY', 'INTERMEDIATE', 'UPPER_INTERMEDIATE', 'ADVANCED', 'NATIVE');

-- CreateEnum
CREATE TYPE "NoteStatus" AS ENUM ('DRAFT', 'REVIEWING', 'NEEDS_PRACTICE', 'INTERVIEW_READY', 'MASTERED', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "NoteType" AS ENUM ('CONCEPT', 'ALGORITHM', 'SYSTEM_DESIGN', 'BEHAVIORAL', 'LANGUAGE_SPECIFIC');

-- CreateEnum
CREATE TYPE "InterviewType" AS ENUM ('TECHNICAL', 'BEHAVIORAL', 'SYSTEM_DESIGN', 'MIXED');

-- CreateEnum
CREATE TYPE "QuestionDifficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD', 'EXPERT');

-- CreateEnum
CREATE TYPE "RecommendationStatus" AS ENUM ('PENDING', 'DISMISSED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "AIValidationStatus" AS ENUM ('SUCCESS', 'VALIDATION_FAILED', 'PROVIDER_ERROR');

-- CreateEnum
CREATE TYPE "EnglishNoteStatus" AS ENUM ('NEEDS_PRACTICE', 'REVIEWING', 'IMPROVED', 'MASTERED');

-- CreateEnum
CREATE TYPE "WeakConceptStatus" AS ENUM ('ACTIVE', 'IMPROVING', 'RESOLVED', 'IGNORED');

-- CreateEnum
CREATE TYPE "ReviewItemType" AS ENUM ('TECHNICAL_NOTE', 'GENERATED_QUESTION', 'ENGLISH_NOTE', 'WEAK_CONCEPT');

-- CreateEnum
CREATE TYPE "ReviewRating" AS ENUM ('AGAIN', 'HARD', 'GOOD', 'EASY');

-- CreateEnum
CREATE TYPE "LearningPathItemStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'SNOOZED', 'SKIPPED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "emailVerifiedAt" TIMESTAMP(3),
    "name" TEXT,
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserLearningProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "targetRole" TEXT NOT NULL,
    "currentLevel" "ExperienceLevel" NOT NULL,
    "targetLevel" "ExperienceLevel" NOT NULL,
    "englishLevel" "EnglishLevel" NOT NULL,
    "techStack" TEXT[],
    "interviewGoals" TEXT[],
    "preferredOutputStyle" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserLearningProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "lastSeenAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuthSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailVerificationToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailVerificationToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TechnicalNote" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "rawInput" TEXT NOT NULL,
    "status" "NoteStatus" NOT NULL DEFAULT 'DRAFT',
    "type" "NoteType" NOT NULL DEFAULT 'CONCEPT',
    "overrideRole" TEXT,
    "overrideLevel" "ExperienceLevel",
    "overrideStack" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "overrideGoals" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "overrideEnglishLevel" "EnglishLevel",
    "preferredOutputStyle" TEXT,
    "structuredContent" JSONB,
    "aiMetadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "TechnicalNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TechnicalNoteSection" (
    "id" TEXT NOT NULL,
    "noteId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "heading" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "aiMetadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TechnicalNoteSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NoteGeneratedQuestion" (
    "id" TEXT NOT NULL,
    "noteId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "expectedAnswer" TEXT,
    "expectedConcepts" TEXT[],
    "difficulty" "QuestionDifficulty" NOT NULL,
    "sourceSection" TEXT NOT NULL,
    "aiMetadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NoteGeneratedQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InterviewSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "InterviewType" NOT NULL,
    "status" "NoteStatus" NOT NULL,
    "noteId" TEXT,
    "sourceQuestionId" TEXT,
    "overrideRole" TEXT,
    "overrideLevel" "ExperienceLevel",
    "overrideStack" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "overrideGoals" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "overrideEnglishLevel" "EnglishLevel",
    "preferredOutputStyle" TEXT,
    "startedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "InterviewSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InterviewQuestion" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "difficulty" "QuestionDifficulty" NOT NULL,
    "expectedConcepts" TEXT[],
    "sourceSection" TEXT NOT NULL,
    "topicTags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InterviewQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InterviewAnswer" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "rawAnswer" TEXT NOT NULL,
    "technicalScore" INTEGER,
    "englishScore" INTEGER,
    "clarityScore" INTEGER,
    "overallScore" INTEGER,
    "aiFeedback" TEXT,
    "technicalFeedback" JSONB,
    "englishFeedback" JSONB,
    "nextRecommendedQuestion" JSONB,
    "recommendedLearning" JSONB,
    "weakConcepts" TEXT[],
    "aiMetadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InterviewAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnglishNote" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "answerId" TEXT NOT NULL,
    "originalSentence" TEXT NOT NULL,
    "correctedSentence" TEXT NOT NULL,
    "naturalVersion" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "grammarTopic" TEXT NOT NULL,
    "recommendedStudyTopics" TEXT[],
    "practicePatterns" TEXT[],
    "status" "EnglishNoteStatus" NOT NULL DEFAULT 'NEEDS_PRACTICE',
    "aiMetadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EnglishNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserWeakConcept" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "concept" TEXT NOT NULL,
    "occurrenceCount" INTEGER NOT NULL DEFAULT 1,
    "status" "WeakConceptStatus" NOT NULL DEFAULT 'ACTIVE',
    "lastSeenAt" TIMESTAMP(3) NOT NULL,
    "sourceAnswerIds" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserWeakConcept_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserEnglishWeakness" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "occurrenceCount" INTEGER NOT NULL DEFAULT 1,
    "lastSeenAt" TIMESTAMP(3) NOT NULL,
    "sourceAnswerIds" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserEnglishWeakness_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningRecommendation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "RecommendationStatus" NOT NULL DEFAULT 'PENDING',
    "type" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "aiMetadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LearningRecommendation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResumeAnalysis" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fileUrl" TEXT,
    "rawText" TEXT,
    "analysisResult" JSONB,
    "aiMetadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ResumeAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIRequestLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "operation" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "promptKey" TEXT NOT NULL,
    "promptVersion" TEXT NOT NULL,
    "schemaKey" TEXT NOT NULL,
    "schemaVersion" TEXT NOT NULL,
    "inputHash" TEXT NOT NULL,
    "validationStatus" "AIValidationStatus" NOT NULL,
    "tokenUsage" JSONB,
    "latencyMs" INTEGER NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIRequestLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "ReviewItemType" NOT NULL,
    "sourceId" TEXT NOT NULL,
    "sourceLabel" TEXT NOT NULL,
    "weaknessScore" INTEGER NOT NULL DEFAULT 0,
    "masteryScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "nextReviewAt" TIMESTAMP(3) NOT NULL,
    "reviewIntervalDays" INTEGER NOT NULL DEFAULT 1,
    "lastReviewedAt" TIMESTAMP(3),
    "lastFailureAt" TIMESTAMP(3),
    "lastRating" "ReviewRating",
    "metadata" JSONB,
    "aiMetadata" JSONB,
    "technicalNoteId" TEXT,
    "generatedQuestionId" TEXT,
    "englishNoteId" TEXT,
    "weakConceptId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReviewItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewAttempt" (
    "id" TEXT NOT NULL,
    "reviewItemId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rating" "ReviewRating" NOT NULL,
    "masteryBefore" DOUBLE PRECISION NOT NULL,
    "masteryAfter" DOUBLE PRECISION NOT NULL,
    "reviewIntervalDays" INTEGER NOT NULL,
    "nextReviewAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReviewAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningPathItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "actionPath" TEXT NOT NULL,
    "status" "LearningPathItemStatus" NOT NULL DEFAULT 'PENDING',
    "priorityScore" DOUBLE PRECISION NOT NULL,
    "availableAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "snoozedUntil" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "skippedAt" TIMESTAMP(3),
    "sourceReviewItemId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LearningPathItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_createdAt_idx" ON "User"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "UserLearningProfile_userId_key" ON "UserLearningProfile"("userId");

-- CreateIndex
CREATE INDEX "UserLearningProfile_userId_idx" ON "UserLearningProfile"("userId");

-- CreateIndex
CREATE INDEX "UserLearningProfile_createdAt_idx" ON "UserLearningProfile"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "AuthSession_tokenHash_key" ON "AuthSession"("tokenHash");

-- CreateIndex
CREATE INDEX "AuthSession_userId_expiresAt_idx" ON "AuthSession"("userId", "expiresAt");

-- CreateIndex
CREATE INDEX "AuthSession_userId_revokedAt_idx" ON "AuthSession"("userId", "revokedAt");

-- CreateIndex
CREATE INDEX "AuthSession_expiresAt_idx" ON "AuthSession"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_tokenHash_key" ON "PasswordResetToken"("tokenHash");

-- CreateIndex
CREATE INDEX "PasswordResetToken_userId_expiresAt_idx" ON "PasswordResetToken"("userId", "expiresAt");

-- CreateIndex
CREATE INDEX "PasswordResetToken_userId_usedAt_idx" ON "PasswordResetToken"("userId", "usedAt");

-- CreateIndex
CREATE INDEX "PasswordResetToken_expiresAt_idx" ON "PasswordResetToken"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "EmailVerificationToken_tokenHash_key" ON "EmailVerificationToken"("tokenHash");

-- CreateIndex
CREATE INDEX "EmailVerificationToken_userId_expiresAt_idx" ON "EmailVerificationToken"("userId", "expiresAt");

-- CreateIndex
CREATE INDEX "EmailVerificationToken_userId_usedAt_idx" ON "EmailVerificationToken"("userId", "usedAt");

-- CreateIndex
CREATE INDEX "EmailVerificationToken_expiresAt_idx" ON "EmailVerificationToken"("expiresAt");

-- CreateIndex
CREATE INDEX "TechnicalNote_userId_status_type_createdAt_idx" ON "TechnicalNote"("userId", "status", "type", "createdAt");

-- CreateIndex
CREATE INDEX "TechnicalNote_userId_idx" ON "TechnicalNote"("userId");

-- CreateIndex
CREATE INDEX "TechnicalNote_status_idx" ON "TechnicalNote"("status");

-- CreateIndex
CREATE INDEX "TechnicalNote_type_idx" ON "TechnicalNote"("type");

-- CreateIndex
CREATE INDEX "TechnicalNote_createdAt_idx" ON "TechnicalNote"("createdAt");

-- CreateIndex
CREATE INDEX "TechnicalNoteSection_noteId_idx" ON "TechnicalNoteSection"("noteId");

-- CreateIndex
CREATE INDEX "TechnicalNoteSection_createdAt_idx" ON "TechnicalNoteSection"("createdAt");

-- CreateIndex
CREATE INDEX "NoteGeneratedQuestion_noteId_idx" ON "NoteGeneratedQuestion"("noteId");

-- CreateIndex
CREATE INDEX "NoteGeneratedQuestion_createdAt_idx" ON "NoteGeneratedQuestion"("createdAt");

-- CreateIndex
CREATE INDEX "InterviewSession_userId_status_type_createdAt_idx" ON "InterviewSession"("userId", "status", "type", "createdAt");

-- CreateIndex
CREATE INDEX "InterviewSession_userId_idx" ON "InterviewSession"("userId");

-- CreateIndex
CREATE INDEX "InterviewSession_status_idx" ON "InterviewSession"("status");

-- CreateIndex
CREATE INDEX "InterviewSession_type_idx" ON "InterviewSession"("type");

-- CreateIndex
CREATE INDEX "InterviewSession_createdAt_idx" ON "InterviewSession"("createdAt");

-- CreateIndex
CREATE INDEX "InterviewQuestion_sessionId_idx" ON "InterviewQuestion"("sessionId");

-- CreateIndex
CREATE INDEX "InterviewQuestion_createdAt_idx" ON "InterviewQuestion"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "InterviewAnswer_questionId_key" ON "InterviewAnswer"("questionId");

-- CreateIndex
CREATE INDEX "InterviewAnswer_questionId_idx" ON "InterviewAnswer"("questionId");

-- CreateIndex
CREATE INDEX "InterviewAnswer_createdAt_idx" ON "InterviewAnswer"("createdAt");

-- CreateIndex
CREATE INDEX "EnglishNote_userId_answerId_idx" ON "EnglishNote"("userId", "answerId");

-- CreateIndex
CREATE INDEX "EnglishNote_userId_idx" ON "EnglishNote"("userId");

-- CreateIndex
CREATE INDEX "EnglishNote_createdAt_idx" ON "EnglishNote"("createdAt");

-- CreateIndex
CREATE INDEX "UserWeakConcept_userId_idx" ON "UserWeakConcept"("userId");

-- CreateIndex
CREATE INDEX "UserWeakConcept_createdAt_idx" ON "UserWeakConcept"("createdAt");

-- CreateIndex
CREATE INDEX "UserEnglishWeakness_userId_idx" ON "UserEnglishWeakness"("userId");

-- CreateIndex
CREATE INDEX "UserEnglishWeakness_createdAt_idx" ON "UserEnglishWeakness"("createdAt");

-- CreateIndex
CREATE INDEX "LearningRecommendation_userId_status_idx" ON "LearningRecommendation"("userId", "status");

-- CreateIndex
CREATE INDEX "LearningRecommendation_userId_idx" ON "LearningRecommendation"("userId");

-- CreateIndex
CREATE INDEX "LearningRecommendation_status_idx" ON "LearningRecommendation"("status");

-- CreateIndex
CREATE INDEX "LearningRecommendation_type_idx" ON "LearningRecommendation"("type");

-- CreateIndex
CREATE INDEX "LearningRecommendation_createdAt_idx" ON "LearningRecommendation"("createdAt");

-- CreateIndex
CREATE INDEX "ResumeAnalysis_userId_idx" ON "ResumeAnalysis"("userId");

-- CreateIndex
CREATE INDEX "ResumeAnalysis_createdAt_idx" ON "ResumeAnalysis"("createdAt");

-- CreateIndex
CREATE INDEX "AIRequestLog_userId_createdAt_idx" ON "AIRequestLog"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "AIRequestLog_operation_createdAt_idx" ON "AIRequestLog"("operation", "createdAt");

-- CreateIndex
CREATE INDEX "AIRequestLog_validationStatus_createdAt_idx" ON "AIRequestLog"("validationStatus", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ReviewItem_userId_type_sourceId_key" ON "ReviewItem"("userId", "type", "sourceId");

-- CreateIndex
CREATE INDEX "ReviewItem_userId_nextReviewAt_idx" ON "ReviewItem"("userId", "nextReviewAt");

-- CreateIndex
CREATE INDEX "ReviewItem_userId_weaknessScore_idx" ON "ReviewItem"("userId", "weaknessScore");

-- CreateIndex
CREATE INDEX "ReviewItem_userId_lastFailureAt_idx" ON "ReviewItem"("userId", "lastFailureAt");

-- CreateIndex
CREATE INDEX "ReviewAttempt_userId_createdAt_idx" ON "ReviewAttempt"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "ReviewAttempt_reviewItemId_createdAt_idx" ON "ReviewAttempt"("reviewItemId", "createdAt");

-- CreateIndex
CREATE INDEX "LearningPathItem_userId_status_availableAt_idx" ON "LearningPathItem"("userId", "status", "availableAt");

-- CreateIndex
CREATE INDEX "LearningPathItem_userId_priorityScore_idx" ON "LearningPathItem"("userId", "priorityScore");

-- AddForeignKey
ALTER TABLE "UserLearningProfile" ADD CONSTRAINT "UserLearningProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthSession" ADD CONSTRAINT "AuthSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailVerificationToken" ADD CONSTRAINT "EmailVerificationToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TechnicalNote" ADD CONSTRAINT "TechnicalNote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TechnicalNoteSection" ADD CONSTRAINT "TechnicalNoteSection_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "TechnicalNote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NoteGeneratedQuestion" ADD CONSTRAINT "NoteGeneratedQuestion_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "TechnicalNote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewSession" ADD CONSTRAINT "InterviewSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewSession" ADD CONSTRAINT "InterviewSession_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "TechnicalNote"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewQuestion" ADD CONSTRAINT "InterviewQuestion_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "InterviewSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewAnswer" ADD CONSTRAINT "InterviewAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "InterviewQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnglishNote" ADD CONSTRAINT "EnglishNote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnglishNote" ADD CONSTRAINT "EnglishNote_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "InterviewAnswer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserWeakConcept" ADD CONSTRAINT "UserWeakConcept_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserEnglishWeakness" ADD CONSTRAINT "UserEnglishWeakness_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningRecommendation" ADD CONSTRAINT "LearningRecommendation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResumeAnalysis" ADD CONSTRAINT "ResumeAnalysis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIRequestLog" ADD CONSTRAINT "AIRequestLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewItem" ADD CONSTRAINT "ReviewItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewItem" ADD CONSTRAINT "ReviewItem_technicalNoteId_fkey" FOREIGN KEY ("technicalNoteId") REFERENCES "TechnicalNote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewItem" ADD CONSTRAINT "ReviewItem_generatedQuestionId_fkey" FOREIGN KEY ("generatedQuestionId") REFERENCES "NoteGeneratedQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewItem" ADD CONSTRAINT "ReviewItem_englishNoteId_fkey" FOREIGN KEY ("englishNoteId") REFERENCES "EnglishNote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewItem" ADD CONSTRAINT "ReviewItem_weakConceptId_fkey" FOREIGN KEY ("weakConceptId") REFERENCES "UserWeakConcept"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewAttempt" ADD CONSTRAINT "ReviewAttempt_reviewItemId_fkey" FOREIGN KEY ("reviewItemId") REFERENCES "ReviewItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewAttempt" ADD CONSTRAINT "ReviewAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningPathItem" ADD CONSTRAINT "LearningPathItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningPathItem" ADD CONSTRAINT "LearningPathItem_sourceReviewItemId_fkey" FOREIGN KEY ("sourceReviewItemId") REFERENCES "ReviewItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;
