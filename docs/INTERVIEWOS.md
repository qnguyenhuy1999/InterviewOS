# InterviewOS

## Product Overview

InterviewOS is an interview-preparation platform for software engineers who need to improve both technical interview performance and English communication. The current product combines a technical notebook, AI-assisted interview practice, review queues, learning-path generation, readiness scoring, English mistake tracking, and resume analysis.

## MVP Scope

- Session-based auth with profile-based onboarding defaults.
- Technical notebook CRUD with AI note generation and AI-generated follow-up questions.
- Interview sessions for technical, behavioral, system-design, mixed, and company-mode flows.
- Persisted evaluation, English feedback, review items, recommendations, learning-path items, readiness snapshots, and resume analysis.
- Web UI for notebook, interview, review, learning path, dashboard, English notes, resume, and settings.
- OpenAI-backed AI provider plus a mock provider for local fallback.

## Current Status

- Monorepo apps and packages are wired and root `pnpm typecheck` now resolves to real workspace `typecheck` tasks through Turbo.
- Prisma 7 is configured in `packages/database` with generated client output in `src/generated/prisma`.
- API modules follow controller -> service -> repository structure, with evaluation and readiness services now using repositories rather than `PrismaService` directly.
- Notebook notes support optional `topic` organization without adding a separate topic table.
- Learning path UI shows grouped status sections, per-type completion counts, and simple progress bars.
- OpenAI integration exists behind `AI_PROVIDER=openai`; local development can still run with `AI_PROVIDER=mock`.

## Remaining Work

- Streaming interview feedback is still deferred.
- Learning-path generation still derives from existing review data rather than a richer dedicated planning model.
- Notebook topic filtering is intentionally lightweight and frontend-focused.
- Resume analysis and AI quality still depend on prompt tuning rather than domain-specific ranking or retrieval.

## Architecture

- `apps/web`: Next.js App Router frontend. Talks to the API over HTTP only.
- `apps/api`: NestJS API. Owns routing, validation, orchestration, auth, and persistence flow.
- `packages/database`: Prisma schema, config, generated client, and runtime adapter-backed client.
- `packages/ai`: Shared AI gateway, prompt builders, mock provider, and OpenAI provider implementation.
- `packages/types`, `packages/validators`, `packages/config`, `packages/ui`: shared contracts and UI primitives.

Request flow:

1. Web submits HTTP requests to `apps/api`.
2. Controllers validate and hand off to services.
3. Services orchestrate business logic and call repositories.
4. Repositories are the only API-layer classes that read or write through Prisma.
5. AI operations go through the API AI gateway, which logs request metadata and uses either mock or OpenAI providers.

## Database

- Database: PostgreSQL via Prisma 7.
- Prisma runtime: adapter-backed `PrismaClient` using `PrismaPg`.
- Core entities: `User`, `UserLearningProfile`, `TechnicalNote`, `NoteGeneratedQuestion`, `InterviewSession`, `InterviewTurn`, `InterviewEvaluation`, `EnglishNote`, `UserWeakConcept`, `ReviewItem`, `LearningPathItem`, `ReadinessSnapshot`, `ResumeAnalysis`, and AI audit tables.
- Notes now support `topic String?` for lightweight organization. Uncategorized notes remain valid.
- Soft delete is used where the product needs history preservation, including notes, sessions, and resume analyses.

## AI System

- Default provider selection is environment-driven through `AI_PROVIDER`.
- `AI_PROVIDER=mock` uses deterministic mock outputs for local development.
- `AI_PROVIDER=openai` uses the shared `OpenAIProvider`, calling the Responses API with strict JSON-schema outputs.
- AI request metadata is persisted through `AIRequestLog`.
- Current AI-backed flows include technical note generation, note question generation, interview answer evaluation, English feedback, learning recommendations, session evaluation, readiness scoring, and resume analysis.
- Voice features and streaming feedback are not implemented.

## API Boundaries

- `apps/web` must not import API internals, Prisma, or AI packages directly.
- `apps/api` owns all persistence and orchestration.
- API services should depend on repositories for data access rather than `PrismaService` directly.
- `packages/database` stays isolated from app-layer code and exports only database/runtime artifacts.

## Development Workflow

- Start infra with `docker-compose.yml` when PostgreSQL and Redis are needed locally.
- Use `.env` for `DATABASE_URL`, `REDIS_URL`, auth settings, and AI provider configuration.
- Root scripts:
  - `pnpm typecheck`
  - `pnpm lint`
  - `pnpm build`
  - `pnpm test`
- Database package scripts:
  - `pnpm --filter @interviewos/database db:validate`
  - `pnpm --filter @interviewos/database db:generate`
  - `pnpm --filter @interviewos/database db:migrate`

## Verification Checklist

- Root Turbo `typecheck` runs package/app `typecheck` tasks instead of silently succeeding on missing scripts.
- Evaluation and readiness services have no direct `PrismaService` dependency.
- Notebook create/update/read flows preserve optional `topic`.
- Notebook UI supports topic entry, uncategorized notes, grouping, and filtering.
- Learning path UI shows grouped progress and completion counts.
- Docs reflect the actual OpenAI integration and clearly mark streaming feedback as future work.

## Future Backlog

- Streaming interview feedback.
  - Decision required: SSE, fetch streaming, and polling fallback strategy.
- Voice capture, transcription, and TTS.
- Richer learning-path planning beyond review-item projection.
- Smarter recommendation ranking and retrieval augmentation.
- More granular analytics and historical trend visualizations.
