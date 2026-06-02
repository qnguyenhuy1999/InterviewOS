# InterviewOS — Database Guide

## Schema Decisions

- **Prisma ORM** with PostgreSQL 16.
- Schema defined in `packages/database/prisma/schema.prisma`.
- Enums defined in `packages/types/src/enums.ts`.
- UUIDs for all primary keys.
- Timestamps (`createdAt`, `updatedAt`) on all tables.
- Soft delete via `deletedAt` where applicable.

## Entity Relationship Diagram

```
User
 ├── Note                    (one-to-many)
 ├── InterviewSession        (one-to-many)
 ├── EnglishNote             (one-to-many)
 ├── ResumeAnalysis          (one-to-many)
 └── Recommendation          (one-to-many)
```

## Index Rationale

- Foreign key columns are indexed for JOIN performance.
- `userId` + `createdAt` composite indexes on time-series queries (sessions, notes).
- Unique constraint on `User.email`.

## Repository Boundary

- Repositories are the only code that imports Prisma.
- Controllers and services never access Prisma directly.
- Repository methods map to single database operations.
- Complex queries use Prisma's query builder only (no raw SQL).

## No Raw SQL Rule

Raw SQL is forbidden. All database access must use Prisma's generated client.
This ensures type safety, migration compatibility, and database portability.
