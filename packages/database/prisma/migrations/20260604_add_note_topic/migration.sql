ALTER TABLE "TechnicalNote"
ADD COLUMN "topic" TEXT;

CREATE INDEX "TechnicalNote_userId_topic_idx" ON "TechnicalNote"("userId", "topic");
