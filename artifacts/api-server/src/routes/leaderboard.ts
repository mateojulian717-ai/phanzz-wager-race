import { Router, type IRouter } from "express";
import { getKingzLeaderboard } from "@workspace/kingz";

const router: IRouter = Router();

router.get("/leaderboard", async (req, res): Promise<void> => {
  try {
    const response = await getKingzLeaderboard(
      process.env.KINGZ_API_KEY,
      process.env.KINGZ_RACE_START_AT,
      process.env.KINGZ_RACE_END_AT,
    );
    res.json(response);
  } catch (error) {
    req.log.error({ err: error }, "Kingz leaderboard request failed");
    res.status(502).json({
      error: "The Kingz leaderboard is temporarily unavailable.",
    });
  }
});

export default router;