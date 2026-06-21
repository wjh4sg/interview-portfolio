# Project Demo Video Buttons Design

## Goal

Add a public Bilibili demo-video action to each portfolio project card.

## Design

- Store each canonical Bilibili URL in `src/config.ts` as `videoUrl`.
- Render a secondary `演示视频` button beside the existing primary `查看源码` button.
- Open both external actions in a new tab with `noopener noreferrer`.
- Remove the outdated upcoming-status text from the cards.
- Reuse the existing button layout and responsive behavior without embedding third-party players.

## Testing

- Assert both projects expose the expected canonical video URLs.
- Assert the project component conditionally renders the video action.
- Run Vitest, Astro checks, the production build, and inspect desktop and mobile layouts in the local browser.
