# Web UI API Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fully wire `apps/web`, `packages/ui`, and `apps/api`, then make root `typecheck`, `lint`, and `build` pass cleanly.

**Architecture:** Use the existing boundary where `apps/web` talks to `apps/api` over HTTP and `packages/ui` stays presentation-only. Fix integration by following the failing workspace checks, tightening exports/contracts only where needed, and preserving package isolation rules.

**Tech Stack:** pnpm workspace, Turbo, Next.js App Router, NestJS, React 19, TypeScript 6, ESLint

---

### Task 1: Baseline The Workspace

**Files:**
- Modify: `docs/superpowers/plans/2026-06-12-web-ui-api-integration.md`

- [ ] **Step 1: Run root typecheck**

Run: `rtk pnpm typecheck`
Expected: Failing packages or apps identify the current integration gaps.

- [ ] **Step 2: Run root lint**

Run: `rtk pnpm lint`
Expected: Lint reports any cross-package import, type-only import, or story/config issues that block wiring.

- [ ] **Step 3: Run root build**

Run: `rtk pnpm build`
Expected: Build highlights any unresolved package export, Next/Nest build, or workspace script issues.

### Task 2: Fix Integration Breakpoints

**Files:**
- Modify: `apps/web/**`
- Modify: `apps/api/**`
- Modify: `packages/ui/**`
- Modify: any shared package files directly implicated by the failing checks

- [ ] **Step 1: Reproduce one failing issue at a time**

Run the narrowest failing command reported by Task 1 so the next change is targeted.

- [ ] **Step 2: Add or adjust the minimal code/config change**

Keep `apps/web` on HTTP-only API access, keep `packages/ui` free of app imports, and keep `apps/api` free of UI dependencies.

- [ ] **Step 3: Re-run the narrow failing command**

Expected: The specific failure is resolved without introducing new regressions.

- [ ] **Step 4: Repeat until all reported integration failures are cleared**

Continue only with issues surfaced by the checks to avoid speculative churn.

### Task 3: Final Verification

**Files:**
- Modify: any files required by Task 2

- [ ] **Step 1: Re-run root typecheck**

Run: `rtk pnpm typecheck`
Expected: All workspace `typecheck` tasks pass.

- [ ] **Step 2: Re-run root lint**

Run: `rtk pnpm lint`
Expected: All workspace `lint` tasks pass.

- [ ] **Step 3: Re-run root build**

Run: `rtk pnpm build`
Expected: All workspace `build` tasks pass.
