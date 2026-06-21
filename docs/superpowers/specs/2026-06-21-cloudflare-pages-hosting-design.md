# Cloudflare Pages Hosting Design

## Goal

Host an independent copy of the portfolio on Cloudflare Pages while leaving
`www.wjhdev.cloud`, DNSPod, and the Tencent Cloud server unchanged.

## Architecture

- Create a Cloudflare Pages project named `interview-portfolio-pages`.
- Build the Astro site with `npm run build`.
- Publish the generated `dist/` directory to Cloudflare Pages.
- Use the Cloudflare-provided `interview-portfolio-pages.pages.dev` address.
- Keep the existing Cloudflare Worker named `interview-portfolio` untouched.
- Do not add a custom domain, edit DNS records, or change the Tencent Cloud
  Nginx deployment.

## Repository Configuration

- Add Wrangler as a development dependency so deploys use a pinned CLI version.
- Add an `npm run deploy:pages` script that builds and deploys `dist/`.

## Deployment Flow

The deployment command builds the same static output used locally, then
Wrangler uploads `dist/` to `interview-portfolio-pages`. Cloudflare publishes
the deployment to the project's `pages.dev` URL.

```bash
npm run deploy:pages
```

## Failure and Rollback

- A failed build or upload must not alter the Tencent Cloud production site.
- Cloudflare Pages keeps previous deployments available for rollback.
- The deploy script must not contain custom-domain or DNS commands.

## Verification

- Repository tests, Astro checks, and the production build pass.
- The Pages project exists with production branch `main`.
- The `pages.dev` homepage returns HTTP 200.
- The deployed page contains both project demo-video links.
- `/resume.pdf` returns HTTP 200.
- `www.wjhdev.cloud` continues resolving to `1.117.64.149`.
