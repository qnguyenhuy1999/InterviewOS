-- CreateEnum
CREATE TYPE "InterviewStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'ABANDONED');

-- AlterTable: migrate InterviewSession.status from NoteStatus to InterviewStatus
ALTER TABLE "InterviewSession"
  ADD COLUMN "new_status" "InterviewStatus" NOT NULL DEFAULT 'PENDING';

UPDATE "InterviewSession"
  SET "new_status" = CASE status::text
    WHEN 'DRAFT'           THEN 'PENDING'::"InterviewStatus"
    WHEN 'REVIEWING'       THEN 'IN_PROGRESS'::"InterviewStatus"
    WHEN 'NEEDS_PRACTICE'  THEN 'IN_PROGRESS'::"InterviewStatus"
    WHEN 'INTERVIEW_READY' THEN 'COMPLETED'::"InterviewStatus"
    WHEN 'MASTERED'        THEN 'COMPLETED'::"InterviewStatus"
    WHEN 'PUBLISHED'       THEN 'COMPLETED'::"InterviewStatus"
    WHEN 'ARCHIVED'        THEN 'ABANDONED'::"InterviewStatus"
    ELSE 'PENDING'::"InterviewStatus"
  END;

ALTER TABLE "InterviewSession" DROP COLUMN "status";
ALTER TABLE "InterviewSession" RENAME COLUMN "new_status" TO "status";

-- Rebuild affected indexes
DROP INDEX IF EXISTS "InterviewSession_userId_status_type_createdAt_idx";
DROP INDEX IF EXISTS "InterviewSession_status_idx";

CREATE INDEX "InterviewSession_userId_status_type_createdAt_idx" ON "InterviewSession"("userId", "status", "type", "createdAt");
CREATE INDEX "InterviewSession_status_idx" ON "InterviewSession"("status");

-- AlterTable: add cost tracking to AIRequestLog
ALTER TABLE "AIRequestLog"
  ADD COLUMN "estimatedCostUsd" DOUBLE PRECISION;
