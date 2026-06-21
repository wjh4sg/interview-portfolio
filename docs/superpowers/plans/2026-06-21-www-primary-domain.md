# www Primary Domain Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `https://www.wjhdev.cloud` the canonical portfolio URL while preserving apex-domain API behavior.

**Architecture:** Update static metadata and documentation to the `www` URL. Keep one TLS virtual host, preserve the two API proxy locations, and redirect only the catch-all apex website location to `www`. Deploy a new immutable static release and a timestamped Nginx backup.

**Tech Stack:** Astro, TypeScript, Vitest, Nginx, PowerShell, SSH

---

### Task 1: Lock the Domain Contract with Tests

**Files:**
- Modify: `src/config.test.ts`
- Test: `src/config.test.ts`

- [ ] **Step 1: Add failing metadata and routing tests**

Append tests that read the real source files:

```ts
it("uses www.wjhdev.cloud as the public website URL", async () => {
  const page = await readFile(resolve("src/pages/index.astro"), "utf8");
  const readme = await readFile(resolve("README.md"), "utf8");
  const footer = await readFile(resolve("src/components/Footer.astro"), "utf8");

  expect(page).toContain('const canonicalUrl = "https://www.wjhdev.cloud"');
  expect(readme).toContain("[www.wjhdev.cloud](https://www.wjhdev.cloud)");
  expect(footer).toContain("www.wjhdev.cloud");
});

it("redirects only apex website traffic while preserving APIs", async () => {
  const nginx = await readFile(
    resolve("deploy/nginx-wjhdev.cloud.conf"),
    "utf8",
  );

  expect(nginx).toContain(
    "return 301 https://www.wjhdev.cloud$request_uri;",
  );
  expect(nginx).toContain("location /api/wechat/");
  expect(nginx).toContain("location /ordering-api/");
  expect(nginx.indexOf("location /api/wechat/")).toBeLessThan(
    nginx.indexOf("if ($host = wjhdev.cloud)"),
  );
});
```

- [ ] **Step 2: Verify RED**

Run:

```powershell
npm test
```

Expected: both new tests fail because metadata and redirects still use the apex domain.

- [ ] **Step 3: Commit the failing contract**

```powershell
git add src/config.test.ts
git commit -m "test: define www primary domain contract"
```

### Task 2: Update Site Metadata and Nginx Template

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/components/Footer.astro`
- Modify: `README.md`
- Modify: `deploy/nginx-wjhdev.cloud.conf`
- Test: `src/config.test.ts`

- [ ] **Step 1: Update website metadata**

Set:

```ts
const canonicalUrl = "https://www.wjhdev.cloud";
```

Change footer deployment text and README production link to
`www.wjhdev.cloud`.

- [ ] **Step 2: Update HTTP and HTTPS routing**

Change the port 80 redirect to:

```nginx
return 301 https://www.wjhdev.cloud$request_uri;
```

Keep both API locations unchanged. Change only the final website location:

```nginx
location / {
    if ($host = wjhdev.cloud) {
        return 301 https://www.wjhdev.cloud$request_uri;
    }
    try_files $uri $uri/ /index.html;
}
```

- [ ] **Step 3: Verify GREEN**

Run:

```powershell
npm test
npm run check
npm run build
```

Expected: 7 tests pass, Astro reports zero diagnostics, and static build exits zero.

- [ ] **Step 4: Run local browser verification**

```powershell
py -3.12 C:\Users\13058\.codex\skills\webapp-testing\scripts\with_server.py `
  --server "npm run dev -- --host 127.0.0.1" --port 4321 `
  -- node scripts\verify_site.cjs
```

Expected: desktop and mobile browser verification passes.

- [ ] **Step 5: Commit**

```powershell
git add src README.md deploy
git commit -m "feat: make www the primary portfolio domain"
```

### Task 3: Publish and Deploy

**Files:**
- Production output: `dist/`
- Server config: `/www/server/panel/vhost/nginx/sub2api.conf`
- Server releases: `/var/www/wjh-portfolio/releases/<timestamp>/`

- [ ] **Step 1: Push and require CI success**

```powershell
git push
gh run watch <latest-run-id> --repo wjh4sg/interview-portfolio --exit-status
```

Expected: CI test, check, and build steps all pass.

- [ ] **Step 2: Upload immutable release and config**

Create `dist` archive, upload it and
`deploy/nginx-wjhdev.cloud.conf`, then extract into:

```text
/var/www/wjh-portfolio/releases/<timestamp>/
```

- [ ] **Step 3: Back up, validate, and switch**

Back up:

```text
/www/server/panel/vhost/nginx/sub2api.conf.backup-<timestamp>
```

Install the candidate configuration, run:

```bash
sudo /www/server/nginx/sbin/nginx -t
```

Only after success, atomically switch `/var/www/wjh-portfolio/current` and
reload Nginx.

- [ ] **Step 4: Verify production routing**

From the server, assert:

```text
https://www.wjhdev.cloud/ -> 200
https://wjhdev.cloud/test?a=1 -> 301
Location: https://www.wjhdev.cloud/test?a=1
https://wjhdev.cloud/api/wechat/ -> 404 baseline
https://wjhdev.cloud/ordering-api/ -> 404 baseline
```

Verify PDF and both SVG assets return 200 on `www`.

- [ ] **Step 5: Run production browser verification**

Use an SSH tunnel to the production TLS listener and run
`scripts/verify_site.cjs` with:

```powershell
$env:BASE_URL = "https://127.0.0.1:8443"
$env:IGNORE_HTTPS_ERRORS = "1"
node scripts\verify_site.cjs
```

Expected: desktop and mobile checks pass.

- [ ] **Step 6: Update GitHub homepage and record deployment**

```powershell
gh repo edit wjh4sg/interview-portfolio --homepage "https://www.wjhdev.cloud"
```

Report the active release and Nginx backup paths.
