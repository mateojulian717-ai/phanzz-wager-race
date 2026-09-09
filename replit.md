# Panterinsito Wager Race

A React/Vite single-page web experience comparing wagering activity in a race-style presentation.

## Run & Operate

- `pnpm --filter @workspace/wager-race run dev` — run the web app using the Replit-provided `PORT` and `BASE_PATH`
- `pnpm --filter @workspace/wager-race run build` — build the production site
- `pnpm --filter @workspace/wager-race run typecheck` — typecheck the web app
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- No additional environment secrets are required.

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- React 19 and Vite 7
- Tailwind CSS 4
- Radix UI primitives and Framer Motion

## Where things live

- `artifacts/wager-race/src/App.tsx` — main application UI and behavior
- `artifacts/wager-race/src/index.css` — global styling and theme
- `artifacts/wager-race/public/` — static images and metadata assets
- `artifacts/wager-race/vite.config.ts` — Vite, proxy-host, port, and base-path configuration

## Architecture decisions

_Populate as you build — non-obvious choices a reader couldn't infer from the code (3-5 bullets)._

## Product

The app presents a visual wager race between streaming/gambling personalities and platforms.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- The managed web workflow runs the `@workspace/wager-race` package.
