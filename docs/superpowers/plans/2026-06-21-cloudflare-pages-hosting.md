# Cloudflare Pages Hosting Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Configure and publish an independent Cloudflare Pages copy of the portfolio without changing `wjhdev.cloud`, DNSPod, the existing Worker, or the Tencent Cloud server.

**Architecture:** Pin Wrangler in the repository and expose one npm script that builds Astro and uploads `dist/` to the dedicated `interview-portfolio-pages` Pages project. Keep all domain-routing settings outside the repository so the Pages deployment cannot take over production traffic.

**Tech Stack:** Astro, TypeScript, Vitest, npm, Wrangler 4.103.0, Cloudflare Pages

---

### Task 1: Lock the Pages Deployment Contract

**Files:**
- Modify: `src/config.test.ts`
- Modify: `package.json`
- Modify: `package-lock.json`

- [x] **Step 1: Write the failing test**

Add this test to `src/config.test.ts`:

```ts
it("provides a domain-safe Cloudflare Pages deploy command", async () => {
  const packageJson = JSON.parse(
    await readFile(resolve("package.json"), "utf8"),
  );
  const deployCommand = packageJson.scripts["deploy:pages"];

  expect(packageJson.devDependencies.wrangler).toBe("4.103.0");
  expect(deployCommand).toBe(
    "npm run build && wrangler pages deploy dist --project-name interview-portfolio-pages --branch main",
  );
  expect(deployCommand).not.toMatch(/--domain|--route|wjhdev\.cloud/);
});
```

- [x] **Step 2: Run the focused test and verify it fails**

Run:

```bash
npm test -- src/config.test.ts
```

Expected: FAIL because `wrangler` and `deploy:pages` are absent.

- [x] **Step 3: Install the pinned Wrangler dependency**

Run:

```bash
npm install --save-dev --save-exact wrangler@4.103.0
```

Expected: `package.json` and `package-lock.json` record Wrangler `4.103.0`.

- [x] **Step 4: Add the minimal deployment script**

Add this entry under `scripts` in `package.json`:

```json
"deploy:pages": "npm run build && wrangler pages deploy dist --project-name interview-portfolio-pages --branch main"
```

- [x] **Step 5: Run the focused test and verify it passes**

Run:

```bash
npm test -- src/config.test.ts
```

Expected: all focused tests pass.

### Task 2: Create and Publish the Pages Project

**Files:**
- Cloudflare project: `interview-portfolio-pages`
- Production output: `dist/`

- [x] **Step 1: Confirm the project name is unused**

Run:

```bash
npx wrangler pages project list --json
```

Expected: no project named `interview-portfolio-pages`.

- [x] **Step 2: Create the Pages project**

Run:

```bash
npx wrangler pages project create interview-portfolio-pages --production-branch main
```

Expected: project creation succeeds with a `pages.dev` subdomain.

- [x] **Step 3: Deploy the current main build**

Run:

```bash
npm run deploy:pages
```

Expected: Wrangler uploads `dist/` and prints the deployment URL.

- [x] **Step 4: Read the deployed project metadata**

Run:

```bash
npx wrangler pages project list --json
npx wrangler pages deployment list --project-name interview-portfolio-pages
```

Expected: the project exists, production branch is `main`, and a successful production deployment is listed.

### Task 3: Verify Isolation and Content

**Files:**
- Verify: `package.json`
- Verify: `package-lock.json`
- Verify: `src/config.test.ts`

- [x] **Step 1: Run repository verification**

Run:

```bash
npm test
npm run check
npm run build
```

Expected: all tests pass, Astro reports zero diagnostics, and the static build succeeds.

- [x] **Step 2: Verify the Pages deployment**

Request the production `pages.dev` URL and assert:

```text
/ -> HTTP 200
/resume.pdf -> HTTP 200
homepage contains BV1gijt6gErr
homepage contains BV18Ejb6rESu
```

- [x] **Step 3: Verify Tencent Cloud remains production**

Run:

```powershell
Resolve-DnsName www.wjhdev.cloud -Type A
```

Expected: `1.117.64.149`.

Also request `https://www.wjhdev.cloud/` and confirm HTTP 200.

- [x] **Step 4: Commit and push the repository configuration**

Stage only:

```text
package.json
package-lock.json
src/config.test.ts
docs/superpowers/plans/2026-06-21-cloudflare-pages-hosting.md
```

Commit with:

```bash
git commit -m "chore: configure Cloudflare Pages deployment"
git push origin main
```
