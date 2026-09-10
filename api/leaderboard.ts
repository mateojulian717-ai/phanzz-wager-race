// Repository-root compatibility entrypoint for Vercel projects whose
// Root Directory is the repository root. The implementation stays alongside
// the wager-race artifact so both possible Vercel roots use the same handler.
export { default } from "../artifacts/wager-race/api/leaderboard";