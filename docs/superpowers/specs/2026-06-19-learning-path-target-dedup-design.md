# Learning Path Target Dedup Design

## Summary

The current learning path builder creates items directly from review queue entries. That causes duplicate learning path entries when different review item types point to the same study destination, such as a technical note review item and a generated question review item that both resolve to the same notebook note.

The product rule is:

- One study destination per concept or note.

This design changes the learning path builder to operate on canonical study targets instead of raw review items or UI routes.

## Problem

`ReviewService.buildLearningPath()` currently mixes two concerns:

1. Ranking review signals.
2. Choosing the identity of a learning path item.

The current hotfix deduplicates by `actionPath`, which is safer than allowing duplicates but still uses a UI navigation detail as the identity key. That is brittle because routes are presentation, not domain identity.

## Goals

- Guarantee one learning path item per study destination.
- Deduplicate by stable domain identity, not URL.
- Preserve existing ranking behavior from the review queue.
- Keep schema changes out of this refactor.
- Keep the refactor scoped to the review module.

## Non-Goals

- Redesign review item scoring.
- Add new persistence tables.
- Change the API contract for learning path responses.
- Introduce a database migration in this iteration.

## Proposed Approach

Introduce an internal canonical target model in `ReviewService`:

```ts
type LearningTarget = {
  targetType: 'NOTEBOOK_NOTE' | 'ENGLISH_NOTE' | 'WEAK_CONCEPT'
  targetId: string
  title: string
  actionPath: string
  priorityScore: number
  reasons: string[]
  sourceReviewItemIds: string[]
  reviewTypes: string[]
}
```

The builder becomes a pipeline:

1. Load and rank review queue entries exactly as today.
2. Normalize each review queue entry into a canonical `LearningTarget`.
3. Merge targets by `targetType + targetId`.
4. Sort merged targets by priority.
5. Persist the top six merged targets as learning path items.

## Normalization Rules

- `TECHNICAL_NOTE`
  - `targetType = 'NOTEBOOK_NOTE'`
  - `targetId = sourceId`
  - `actionPath = /notebook/:noteId`

- `GENERATED_QUESTION`
  - Read `metadata.noteId`
  - `targetType = 'NOTEBOOK_NOTE'`
  - `targetId = metadata.noteId`
  - `actionPath = /notebook/:noteId`
  - If `metadata.noteId` is missing, fall back to `/interview` and use the question itself as a unique target identity for this iteration.

- `ENGLISH_NOTE`
  - `targetType = 'ENGLISH_NOTE'`
  - `targetId = sourceId`
  - `actionPath = /english-notes`

- `WEAK_CONCEPT`
  - `targetType = 'WEAK_CONCEPT'`
  - `targetId = sourceId`
  - `actionPath = /review`

## Merge Rules

When multiple review queue entries normalize to the same target:

- Keep the highest `priorityScore`.
- Keep the title from the highest-priority contributing entry.
- Merge reasons and remove duplicates while preserving readable order.
- Keep all contributing `sourceReviewItemIds` in metadata for traceability.
- Keep all contributing review types in metadata for future UI or analytics use.

The learning path item title stays single-target and readable. The reason becomes a merged summary of why this destination matters now.

## Data Shape in Persistence

No schema change is required. Persist to `LearningPathItem` using the current fields:

- `type`: use the canonical target type or existing review item type mapping that best matches current API expectations.
- `title`: from merged target.
- `reason`: merged reason string.
- `actionPath`: from canonical target.
- `priorityScore`: merged priority.
- `sourceReviewItemId`: the highest-priority contributing review item id.
- `metadata`: include canonical target identity and merge traceability.

Suggested metadata shape:

```ts
{
  reviewType: 'TECHNICAL_NOTE',
  targetType: 'NOTEBOOK_NOTE',
  targetId: 'note-1',
  sourceReviewItemIds: ['review-1', 'review-2'],
  reviewTypes: ['TECHNICAL_NOTE', 'GENERATED_QUESTION']
}
```

## Error Handling

- If a generated question has no `noteId`, do not crash learning path generation.
- Normalize it into a standalone fallback target so the signal is still usable.
- Keep behavior deterministic and test-covered.

## Testing Plan

Add or update tests to cover:

- Technical note and generated question for the same notebook note produce one learning path item.
- Reasons are merged without duplicates.
- Highest-priority source wins for title and primary source review item id.
- Different notebook notes still produce distinct learning path items.
- Generated questions without `noteId` still produce a stable fallback item.

## Why This Design

This keeps learning path identity in the domain layer rather than the routing layer. It improves maintainability without expanding scope into database migrations. It also creates a clean seam for a future persistence redesign if learning targets become first-class entities later.
