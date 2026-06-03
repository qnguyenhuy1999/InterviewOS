# InterviewOS

AI-powered interview preparation platform.

## Setup

```bash
pnpm install
docker compose up
pnpm --filter @interviewos/database db:generate
pnpm --filter @interviewos/database db:migrate
pnpm --filter @interviewos/database db:seed
pnpm dev
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
- `AI_PROVIDER=openai` switches to the existing provider abstraction entrypoint. The current `OpenAIProvider` is still a stub, so Phase 1 is fully runnable with `mock`.

## Notes

- Phase 1 uses a development fallback user: `demo@interviewos.dev`.
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
