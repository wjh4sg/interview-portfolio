# Project Demo Video Buttons Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add working Bilibili demo-video buttons to the MiniCode and Personal RAG project cards.

**Architecture:** Keep video destinations in the centralized portfolio config and conditionally render a secondary external-link action in the existing Astro project component. Reuse the current button system and responsive action row.

**Tech Stack:** Astro, TypeScript, Tailwind CSS v4, Vitest

---

### Task 1: Define and test project video links

**Files:**
- Modify: `src/config.test.ts`
- Modify: `src/config.ts`

- [x] **Step 1: Write the failing test**

Replace the outdated upcoming-demo assertion with expectations for the canonical MiniCode and Personal RAG Bilibili URLs.

- [x] **Step 2: Run test to verify it fails**

Run: `npm test -- src/config.test.ts`

Expected: FAIL because the projects do not expose `videoUrl`.

- [x] **Step 3: Write minimal implementation**

Add `videoUrl?: string` to the project contract and set:

```ts
MiniCode: "https://www.bilibili.com/video/BV1gijt6gErr"
Personal RAG: "https://www.bilibili.com/video/BV18Ejb6rESu"
```

Remove the obsolete project `status` data.

- [x] **Step 4: Run test to verify it passes**

Run: `npm test -- src/config.test.ts`

Expected: PASS.

### Task 2: Render the demo-video action

**Files:**
- Modify: `src/config.test.ts`
- Modify: `src/components/Projects.astro`
- Modify: `src/styles/global.css`

- [x] **Step 1: Write the failing component-contract test**

Assert that `Projects.astro` contains a conditional `project.videoUrl`, the `演示视频` label, and no `coming-soon` status output.

- [x] **Step 2: Run test to verify it fails**

Run: `npm test -- src/config.test.ts`

Expected: FAIL because the component still renders the upcoming-status element.

- [x] **Step 3: Write minimal implementation**

Render a `button-secondary` external link when `project.videoUrl` exists, using a play icon and the text `演示视频`. Remove the obsolete `.coming-soon` markup and styles.

- [x] **Step 4: Run test to verify it passes**

Run: `npm test -- src/config.test.ts`

Expected: PASS.

### Task 3: Verify the complete page

**Files:**
- Verify: `src/config.ts`
- Verify: `src/components/Projects.astro`
- Verify: `src/styles/global.css`

- [x] **Step 1: Run static checks**

Run: `npm run check`

Expected: exit code 0.

- [x] **Step 2: Run all tests**

Run: `npm test`

Expected: all tests pass.

- [x] **Step 3: Build production output**

Run: `npm run build`

Expected: exit code 0.

- [x] **Step 4: Inspect the local page**

Open `http://127.0.0.1:4321/` at desktop and mobile widths. Confirm both project cards display `查看源码` and `演示视频`, with no upcoming-status text and no overlap.
