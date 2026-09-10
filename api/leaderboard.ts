import { getKingzLeaderboard } from "./_kingz.js";

type Request = {
  method?: string;
};

type Response = {
  status: (code: number) => Response;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
};

export default async function handler(req: Request, res: Response): Promise<void> {
  if (req.method === "OPTIONS") {
    res.setHeader("Allow", "GET, OPTIONS");
    res.status(204).json({});
    return;
  }

  if (req.method && req.method !== "GET") {
    res.setHeader("Allow", "GET, OPTIONS");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    res.json(await getKingzLeaderboard());
  } catch {
    res.status(502).json({
      error: "The Kingz leaderboard is temporarily unavailable.",
    });
  }
}