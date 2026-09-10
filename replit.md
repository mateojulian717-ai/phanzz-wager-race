# Panterinsito Wager Race

A React/Vite single-page web experience comparing wagering activity in a race-style presentation.

## Run & Operate

- `pnpm --filter @workspace/wager-race run dev` — run the web app using the Replit-provided `PORT` and `BASE_PATH`
- `pnpm --filter @workspace/wager-race run build` — build the production site
- `pnpm --filter @workspace/wager-race run typecheck` — typecheck the web app
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `KINGZ_API_KEY` is required by the server-side Kingz leaderboard route. It must be set in Replit Secrets for the Replit preview and in Vercel Environment Variables for production.
- `KINGZ_RACE_START_AT` and `KINGZ_RACE_END_AT` are optional server variables; when omitted, the active PHANZZ period defaults to `2026-09-08` through `2026-09-23`.

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

- Kingz credentials never reach the browser. Replit serves `/api/leaderboard` through the API server, while Vercel uses the colocated `api/leaderboard.ts` function.
- Kingz `wagered_amount` and prize values are returned as strings by the provider, parsed server-side, and summed before the frontend formats them as USD.
- The server keeps the last valid Kingz response in memory and marks it `stale` if a refresh fails; the frontend polls every 60 seconds and never substitutes mock players.
- The frontend uses `leaderboard.start_date` and `leaderboard.end_date` from the live response for the active race countdown.

## Product

The app presents a visual wager race between streaming/gambling personalities and platforms.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Kingz does not return a currency field. The current visual presentation formats the provider amounts as USD.
- The active endpoint requires a date range before it can return `leaderboard` metadata, so the server uses the configured active-period defaults to make the initial request.
- Vercel must have `KINGZ_API_KEY` configured separately from Replit; the `.vercel/project.json` file only links the existing `phanzz-wager-race` project.

## Pointers

- The managed web workflow runs the `@workspace/wager-race` package.
