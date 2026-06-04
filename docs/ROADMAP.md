# InterviewOS - Development Roadmap

Status legend:
- [x] Implemented in the current codebase
- [~] Partially implemented
- [ ] Not implemented yet

## v0 - Scaffold

- [x] Monorepo packages (types, config, validators, tsconfig, eslint-config, ui).
- [x] Database schema and Prisma client.
- [x] NestJS API scaffold with controller -> service -> repository pattern.
- [x] Next.js web app with route shells.
- [x] Docker Compose (Postgres + Redis).
- [x] Product and technical documentation.

## v1 - Auth + Notebook

- [x] Session-based authentication (login, register, session management).
- [x] User profile CRUD.
- [x] Notebook CRUD (create, read, update, delete notes).
- [x] API integration from web app.
- [x] Form validation with react-hook-form + zod for Register, Profile, and Note flows.
- [x] End-to-end auth flow (register -> login -> dashboard).
- [x] Added beyond original roadmap: password reset, email verification, session revocation, account security settings, and shared form schemas for onboarding and note overrides.

## v2 - Interview + Feedback

- [x] Interview session creation and management.
- [x] Structured question flow.
- [x] Answer submission and feedback persistence.
- [x] English notes auto-generation from feedback.
- [x] Resume upload and analysis flow with persisted latest result retrieval.
- [x] Session history and replay.
- [x] Added beyond original roadmap: multi-turn interview sessions, company-mode interviews, per-session evaluation, review page, weak-concept tracking, and resume analysis persistence with PDF/DOCX/TXT upload support.

## v3 - Live AI

- [x] Real AI provider integration (OpenAI).
- [ ] Streaming feedback during interview sessions.
- [x] Personalized recommendations engine.
- [x] Learning path generation from performance data.
- [x] English mistake tracking and topic-based trend visualization.
- [x] Dashboard analytics and progress metrics.
- [x] Added beyond original roadmap: readiness scoring snapshots, interview analytics persistence, AI request audit logging, and topic mastery summaries rendered from existing English note data.

## Notes

- The current MVP-complete additions since the earlier roadmap draft are:
- Resume upload plus analysis via `POST /resume/upload` and `GET /resume/latest`.
- Resume UI for upload, loading, error handling, latest analysis display, and re-upload.
- English topic trend summaries with total notes, total topics, mastery percentage, grouped topic stats, and native `details/summary` expansion.
- React Hook Form plus Zod migration for `RegisterForm`, `ProfileForm`, and `NoteForm`.
- Still not implemented from the roadmap: streaming feedback during interview sessions.
