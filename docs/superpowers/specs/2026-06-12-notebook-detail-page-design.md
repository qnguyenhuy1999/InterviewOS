# Notebook Detail Page Redesign

## Goal

Redesign `packages/ui/src/pages/NotebookDetailPage` so it feels like a modern learning article instead of a dashboard detail screen. The page should improve readability, study flow, information hierarchy, and the overall interview-preparation experience while preserving the existing data model and business behavior.

## Current Problems

- The page is structurally correct but visually reads as a stack of equal-weight cards.
- Long-form knowledge content competes with metadata, questions, and related notes.
- The reading experience is too wide and too flat for deep review sessions.
- There is no in-page navigation for long notes.
- Generated content feels rendered rather than curated.

## Design Direction

Use an editorial learning layout with a centered article column and a restrained sticky utility rail.

This direction should feel closer to product documentation and modern learning platforms than to a CRUD dashboard:

- content-first
- calm, readable, long-form
- strong section hierarchy
- progressive disclosure for advanced material
- high-signal study tools kept available but secondary

## Primary UX Principles

### Content-first design

The generated note content is the primary experience. Utility panels, metadata, and actions should support reading rather than compete with it.

### Progressive disclosure

Important material appears first. Advanced or denser content can be collapsed by default to reduce overload.

### Learning-oriented flow

The note should feel like a guided learning article with a clear educational arc, not a raw AI output dump.

### Comfortable reading

The main article column should stay near `max-width: 850px`, use generous spacing, and maintain strong typographic rhythm.

### Responsive utility

Desktop gets a sticky reading rail. Mobile collapses navigation into a compact trigger or sheet so content remains primary.

## Target Information Architecture

### Header

The top of the page becomes a doc-style hero:

- note title
- concise summary or subtitle
- topic, type, status, and difficulty chips
- estimated reading time
- updated time
- primary action

This header should feel editorial rather than administrative.

### Main article flow

The content order should be:

1. Quick summary
2. Core concepts
3. Mental model
4. Practical examples
5. Production usage
6. Common pitfalls
7. Debugging checklist
8. Production checklist
9. Senior interview signals
10. Interview-ready answer
11. Practice questions
12. Related notes

Supporting metadata such as raw input and interview targeting should move lower in the page or into secondary surfaces so the note reads as a polished study artifact.

### Utility rail

The right rail should contain:

- sticky table of contents
- reading progress indicator
- compact study metadata
- optional quick stats

The rail must remain visually lightweight so it does not overpower the article.

## Interaction Design

### Sticky table of contents

Desktop:

- visible while reading
- auto-highlights the active section based on scroll position
- smooth scroll to sections on click

Mobile:

- TOC appears behind a compact "On this page" trigger
- opens in a sheet, drawer, or lightweight overlay

### Reading progress

Add a slim progress indicator tied to article scroll progress:

- updates live while scrolling
- shows percentage complete
- remains lightweight and visually quiet

### Progressive disclosure

Sections that are denser or more advanced can be collapsed by default. The current data model maps best to this behavior for:

- practical examples when long
- production usage
- debugging checklist
- production checklist
- senior interview signals
- raw input
- interview targeting

Quick summary, core concepts, mental model, and interview-ready answer should remain visible by default.

## Visual Language

### Overall tone

Premium editorial, not glossy marketing. The page should feel clean, modern, and intentional.

### Layout

- center the article body
- keep the reading column narrow enough for comfort
- allow the rail to breathe on large screens
- use more vertical rhythm between sections than the current implementation

### Typography

- stronger title hierarchy
- more generous section heading spacing
- improved paragraph line-height
- cleaner list presentation
- better visual grouping of concepts and callouts

### Surface treatment

- replace repeated generic cards with a smaller set of purposeful surface styles
- use highlighted cards only for sections that deserve emphasis
- reduce border noise
- preserve the existing design token system

## Reusable Component Plan

Follow the current UI package architecture. Reusable pieces should not remain trapped inside the page file.

### Molecules

- `NoteProgressBar`
- `NoteCallout`
- `NoteSummaryCard`
- `NoteInterviewAnswer`
- `NoteToc`

### Organisms

- `NoteHeader`
- `NoteMetaRail`
- `NoteSection`

### Page responsibilities

`NotebookDetailPage` should:

- map the existing `TechnicalNoteDetailView` data into the new article structure
- own section ordering and page-level layout
- preserve empty, loading, and error states
- continue supporting `renderHeaderActions` and `renderQuestionActions`

## Content Mapping

### Existing fields to preserve

- `note.title`
- `note.topic`
- `note.type`
- `note.status`
- `note.updatedAt`
- `note.rawInput`
- `note.structuredContent`
- `note.overrideRole`
- `note.overrideLevel`
- `note.overrideStack`
- `note.overrideGoals`
- `note.overrideEnglishLevel`
- `note.preferredOutputStyle`
- `generatedQuestions`
- `relatedNotes`

### Derived sections

- Quick summary: `structuredContent.purpose`
- Core concepts: `structuredContent.coreConcepts`
- Mental model: `structuredContent.mentalModel`
- Practical examples: `structuredContent.practicalExamples`
- Production usage: `structuredContent.productionUsage`
- Common pitfalls: `structuredContent.commonPitfalls`
- Debugging checklist: `structuredContent.debuggingChecklist`
- Production checklist: `structuredContent.productionChecklist`
- Senior interview signals: `structuredContent.seniorInterviewSignals`

### Interview-ready answer

This should be a dedicated card that synthesizes the note into a concise rehearsal answer using the existing structured fields. It should not require new backend data. A short composed answer based on purpose, mental model, and selected concepts is sufficient for the first iteration.

## States

### Loading

The loading view should hint at the new article structure:

- hero skeleton
- progress placeholder
- article column skeleton
- rail skeleton

### Empty

The empty state should still be simple, but framed as "select a note to start learning" rather than a generic detail state.

### Error

The error state should remain clear and actionable without over-styling.

### Draft note without structured content

This state should still encourage structure generation, but the empty content surface should feel native to the article layout rather than like a broken dashboard card.

## Mobile Behavior

- stack into a single reading column
- move rail tools into compact inline triggers
- keep chips and metadata wrapped cleanly
- maintain comfortable spacing for reading and tap targets
- ensure practice questions remain usable without crowding the article

## Accessibility

- TOC links must be keyboard reachable
- active section indication must not rely on color alone
- collapsible sections must expose proper button semantics and `aria-expanded`
- progress indicator should have accessible text
- heading order should reflect article structure

## Constraints

- preserve existing API contracts and page props
- preserve business logic and current fixtures
- do not modify shadcn base components directly
- use existing tokens and utility classes where possible
- avoid new dependencies if existing React and design-system primitives are enough

## Implementation Notes

- Prefer article semantics where useful, such as `article`, `aside`, `nav`, and heading anchors
- Use client-side scroll listeners sparingly and keep the progress implementation lightweight
- Reuse existing `QuestionCard`, `DefinitionList`, `BulletList`, `TagList`, `Badge`, `Button`, and state components where that helps
- Replace the current repeated `SectionCard` rhythm with more intentional section wrappers

## Success Criteria

The redesign is successful when:

- the page feels like a professional learning platform
- the article is easier to read for extended sessions
- note content is clearly prioritized over utilities
- users can navigate long notes with TOC and progress feedback
- advanced content no longer overwhelms first-pass reading
- mobile remains usable and coherent
- existing functionality and data remain intact

