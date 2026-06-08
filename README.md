# InterviewOS

AI-powered interview preparation platform with a split web and API deployment model.

## Local Setup

1. Install dependencies.

```bash
pnpm install
```

2. Create environment files for the API and web apps.

Required values:

```bash
DATABASE_URL=postgresql://postgres:1234@localhost:5432/interviewos
REDIS_URL=redis://localhost:6379
JWT_SECRET=replace-with-at-least-32-characters
WEB_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3001
AUTH_COOKIE_NAME=interviewos_session
AUTH_SESSION_TTL_DAYS=7
AI_PROVIDER=mock
OPENAI_API_KEY=
OPENAI_GATEWAY_BASE_URL=
OPENAI_MODEL=gpt-5.4-mini
OPENAI_ORGANIZATION=
OPENAI_PROJECT=
NODE_ENV=development
```

3. Start infrastructure.

```bash
docker compose up -d
```

4. Generate the Prisma client, run migrations, and seed local data.

```bash
pnpm --filter @interviewos/database db:generate
pnpm --filter @interviewos/database db:migrate
pnpm --filter @interviewos/database db:seed
```

5. Start the apps.

```bash
pnpm dev
```

Local URLs:

- Web: `http://localhost:3000`
- API: `http://localhost:3001`
- Swagger: `http://localhost:3001/swagger`

## Database And Seed Flow

- `db:generate` must run after dependency install and after schema changes.
- `db:migrate` applies the current schema to the target database.
- `db:seed` creates the local development baseline data.
- The seed currently provisions `demo@interviewos.dev` with password `Password123!`.

For a fresh local reset:

```bash
docker compose down -v
docker compose up -d
pnpm --filter @interviewos/database db:generate
pnpm --filter @interviewos/database db:migrate
pnpm --filter @interviewos/database db:seed
```

## OpenAI Provider Setup

- `AI_PROVIDER=mock` keeps local development deterministic and does not require a live model.
- `AI_PROVIDER=openai` requires `OPENAI_API_KEY` and uses the gateway-backed Responses flow already wired through `packages/ai`.
- `OPENAI_GATEWAY_BASE_URL`, `OPENAI_ORGANIZATION`, and `OPENAI_PROJECT` are optional unless your deployment requires them.

## Cookie And Security Notes

- `JWT_SECRET` should be long and unique per environment.
- `AUTH_COOKIE_NAME` must match the API auth configuration.
- `AUTH_SESSION_TTL_DAYS` controls session lifetime.
- In production, run the API behind HTTPS and use secure cookie settings at the edge or reverse proxy.
- Keep `WEB_APP_URL` and `NEXT_PUBLIC_API_URL` aligned with the deployed origins to avoid auth and CORS drift.

## Deployment Model

Deploy the API and web apps separately.

API:

```bash
pnpm --filter @interviewos/api build
pnpm --filter @interviewos/api start
```

Web:

```bash
pnpm --filter @interviewos/web build
pnpm --filter @interviewos/web start
```

Production checklist:

- Provision Postgres and Redis.
- Apply migrations before promoting new API code.
- Run seed only for environments where demo data is acceptable.
- Set `NEXT_PUBLIC_API_URL` to the public API origin the browser should call.
- Keep cookie domain, TLS termination, and reverse-proxy headers consistent across both apps.

## Validation Commands

Run from the repo root:

```bash
pnpm typecheck
pnpm lint
pnpm build
pnpm test
pnpm test:e2e
```

## E2E Smoke Test

The Playwright smoke test assumes:

- API and web apps are already running.
- The local database is migrated.
- `E2E_BASE_URL` points to the web app if not using `http://127.0.0.1:3000`.

Run it with:

```bash
pnpm test:e2e
```

Covered smoke path:

- register
- onboarding
- login
- create notebook note
- start interview
- submit answer
- open review queue and rate an item
- run a learning-path action
- upload a resume

## MVP Smoke Checklist

- Register a new account or log in with the seeded demo user.
- Complete onboarding and confirm guarded routes redirect correctly before onboarding exists.
- Create a notebook note and verify notebook filters still work.
- Start an interview, submit an answer, and open the session review.
- Rate a review item and trigger a learning-path action.
- Open readiness and recompute the latest snapshot.
- Upload a resume and confirm the latest analysis renders.
- Verify `/swagger` and `/swagger/json` on the API after deployment changes.

## Workspace Packages

| Package | Description |
| --- | --- |
| `apps/web` | Next.js web application |
| `apps/api` | Backend API server |
| `packages/ui` | Shared UI component library |
| `packages/database` | Database client and schema |
| `packages/config` | Shared configuration |
| `packages/types` | Shared TypeScript types |
