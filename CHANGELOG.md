# Changelog

All notable changes to this project are documented here.

## [0.1.4] - 2026-06-21

### Changed

- Migrated production deployment from BaoTa-managed Nginx to the system Nginx
  package.
- Added system Nginx and Certbot reload hook deployment templates.
- Updated production logs to use `/var/log/nginx/` instead of BaoTa paths.

## [0.1.3] - 2026-06-21

### Changed

- Removed the retired WeChat authentication and ordering API reverse proxies
  from production Nginx configuration.
- Made unknown static-site paths return HTTP 404 instead of the homepage.

## [0.1.2] - 2026-06-21

### Changed

- Renamed production Nginx configuration and logs for the portfolio.
- Removed legacy Sub2API deployment references from active infrastructure
  documentation.

## [0.1.1] - 2026-06-21

### Changed

- Made `https://www.wjhdev.cloud` the canonical portfolio URL.
- Added permanent apex-domain website redirects while preserving existing API
  routes.

## [0.1.0] - 2026-06-21

### Added

- Responsive Chinese interview portfolio for AI application and backend roles.
- Evidence-rich MiniCode and Personal RAG project sections.
- Architecture diagrams, downloadable resume, repository and release links.
- Persistent light/dark theme control and reduced-motion support.
- Content tests, Astro checks, browser verification, and GitHub Actions CI.
- Open-source template attribution.
