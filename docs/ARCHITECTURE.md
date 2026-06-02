# InterviewOS — Architecture Guide

## Monorepo Layer Diagram

```
apps/web                                  (Next.js App Router)
  │
  │ HTTP via NEXT_PUBLIC_API_URL
  ▼
apps/api                                  (NestJS)
  │
  │ controller → service → repository
  ▼
packages/database                         (Prisma ORM)
  │
  ▼
PostgreSQL

apps/api
  │
  │ AI Gateway
  ▼
packages/ai                               (AI Provider Abstraction)
  │
  ▼
Mock / OpenAI Provider
```

## Data Flow

1. **Web app** calls API via HTTP using `apiClient` fetch wrapper.
2. **API controllers** validate input and delegate to services.
3. **Services** contain business logic.
4. **Repositories** abstract database access via Prisma.
5. **AI Gateway** abstracts AI provider behind a common interface.

## Dependency Rules

| Package | Can Import |
|---------|-----------|
| `apps/web` | `@interviewos/types`, `@interviewos/validators`, `@interviewos/ui`, `@interviewos/config` |
| `apps/api` | All packages except `@interviewos/web` |
| `packages/database` | accessed only by API repositories |
| `packages/ai` | accessed only by API AI gateway |

## API Architecture

```
Controller (validation + routing)
  → Service (business logic)
    → Repository (data access via PrismaService)
      → PrismaService (Prisma ORM client)
```

## AI Abstraction

```
AiGateway (interface)
  ├── MockAiProvider (development, scaffold phase)
  └── OpenAiProvider (production, later phase)
```

## Frontend/API Boundary

- Web app communicates with API exclusively via HTTP.
- No direct database access from web app.
- No imports of `@interviewos/database`, `@interviewos/ai`, or `@interviewos/api` from web app.
