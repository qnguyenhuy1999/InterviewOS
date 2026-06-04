# InterviewOS

AI-powered interview preparation platform.

## Setup

```bash
pnpm install
docker compose up -d
pnpm --filter @interviewos/database db:generate
pnpm --filter @interviewos/database db:migrate
pnpm --filter @interviewos/database db:seed
pnpm dev
```

Required environment variables:

```bash
DATABASE_URL=postgresql://postgres:1234@localhost:5432/interviewos
REDIS_URL=redis://localhost:6379
JWT_SECRET=replace-with-at-least-32-characters
WEB_APP_URL=http://localhost:3000
AUTH_COOKIE_NAME=interviewos_session
AUTH_SESSION_TTL_DAYS=7
AI_PROVIDER=mock
OPENAI_API_KEY=
OPENAI_GATEWAY_BASE_URL=
OPENAI_MODEL=gpt-5.4-mini
OPENAI_ORGANIZATION=
OPENAI_PROJECT=
```

## Phase 1 MVP Commands

```bash
pnpm --filter @interviewos/api typecheck
pnpm --filter @interviewos/web typecheck
pnpm --filter @interviewos/api build
pnpm --filter @interviewos/web build
```

## AI Provider

- `AI_PROVIDER=mock` uses the shared mock provider in `packages/ai` for technical notes, question generation, interview evaluation, English feedback, and recommendations.
- `AI_PROVIDER=openai` uses the existing `AIGateway` abstraction and sends Responses API requests through the configured gateway base URL with versioned prompts and strict schema validation.

## Notes

- The API now requires a real authenticated session cookie. The seed script creates `demo@interviewos.dev` with password `Password123!` for local development.
- Swagger UI is exposed at `http://localhost:3001/swagger` when the API is running.
- Onboarding values are stored once in `UserLearningProfile` and reused automatically for note generation and interview practice unless Advanced Settings overrides them.
- The notebook, interview, English notes, and recommendations routes all depend on the API server being available at `NEXT_PUBLIC_API_URL`.

## Workspace Packages

| Package             | Description                 |
| ------------------- | --------------------------- |
| `apps/web`          | Next.js web application     |
| `apps/api`          | Backend API server          |
| `packages/ui`       | Shared UI component library |
| `packages/database` | Database client and schema  |
| `packages/config`   | Shared configuration        |
| `packages/types`    | Shared TypeScript types     |
