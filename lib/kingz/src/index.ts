export const KINGZ_AFFILIATES_ENDPOINT =
  "https://leaderboard.kingz.win/v1/external/affiliates";

export const DEFAULT_KINGZ_RACE_PERIOD = {
  startAt: "2026-09-08",
  endAt: "2026-09-23",
} as const;

export type KingzRawPrize = {
  place: number;
  prize: string;
};

export type KingzRawLeaderboard = {
  title: string;
  start_date: string;
  end_date: string;
  type: string;
  status: string;
  prizes: KingzRawPrize[];
};

export type KingzRawAffiliate = {
  username: string;
  id: string;
  wagered_amount: string;
  rank: number;
  deposited_amount: string;
};

export type KingzLeaderboardResponse = {
  affiliates: Array<KingzRawAffiliate & { prize: string }>;
  leaderboard: KingzRawLeaderboard;
  cache_updated_at: string;
  stats: {
    participants: number;
    total_wager: string;
    prize_pool: string;
    top_paid: number;
  };
  stale?: boolean;
};

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const requiredString = (value: unknown, field: string): string => {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`Kingz response field "${field}" is missing or invalid`);
  }

  return value;
};

const requiredNumber = (value: unknown, field: string): number => {
  const number = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(number)) {
    throw new Error(`Kingz response field "${field}" is missing or invalid`);
  }

  return number;
};

export const parseKingzAmount = (value: string, field: string): number => {
  const amount = Number(value.replace(/[^0-9.-]/g, ""));
  if (!Number.isFinite(amount)) {
    throw new Error(`Kingz amount field "${field}" is invalid`);
  }

  return amount;
};

export const formatKingzAmount = (amount: number): string =>
  amount.toFixed(2);

const normalizeResponse = (payload: unknown): KingzLeaderboardResponse => {
  if (!isRecord(payload)) {
    throw new Error("Kingz returned an invalid response");
  }

  if (!Array.isArray(payload.affiliates) || !isRecord(payload.leaderboard)) {
    throw new Error("Kingz response is missing leaderboard data");
  }

  const leaderboardValue = payload.leaderboard;
  if (!Array.isArray(leaderboardValue.prizes)) {
    throw new Error("Kingz response is missing prize data");
  }

  const prizes = leaderboardValue.prizes.map((value, index) => {
    if (!isRecord(value)) {
      throw new Error(`Kingz prize at position ${index} is invalid`);
    }

    return {
      place: requiredNumber(value.place, `leaderboard.prizes[${index}].place`),
      prize: requiredString(value.prize, `leaderboard.prizes[${index}].prize`),
    };
  });

  const rawAffiliates = payload.affiliates.map((value, index) => {
    if (!isRecord(value)) {
      throw new Error(`Kingz affiliate at position ${index} is invalid`);
    }

    return {
      username: requiredString(value.username, `affiliates[${index}].username`),
      id: requiredString(value.id, `affiliates[${index}].id`),
      wagered_amount: requiredString(
        value.wagered_amount,
        `affiliates[${index}].wagered_amount`,
      ),
      rank: requiredNumber(value.rank, `affiliates[${index}].rank`),
      deposited_amount: requiredString(
        value.deposited_amount,
        `affiliates[${index}].deposited_amount`,
      ),
    };
  });

  const prizeByPlace = new Map(prizes.map((prize) => [prize.place, prize.prize]));
  const affiliates = rawAffiliates
    .map((affiliate) => ({
      ...affiliate,
      prize: prizeByPlace.get(affiliate.rank) ?? "",
    }))
    .sort((a, b) => a.rank - b.rank);

  const totalWager = affiliates.reduce(
    (sum, affiliate) =>
      sum + parseKingzAmount(affiliate.wagered_amount, "wagered_amount"),
    0,
  );
  const prizePool = prizes.reduce(
    (sum, prize) => sum + parseKingzAmount(prize.prize, "prize"),
    0,
  );

  return {
    affiliates,
    leaderboard: {
      title: requiredString(leaderboardValue.title, "leaderboard.title"),
      start_date: requiredString(
        leaderboardValue.start_date,
        "leaderboard.start_date",
      ),
      end_date: requiredString(
        leaderboardValue.end_date,
        "leaderboard.end_date",
      ),
      type: requiredString(leaderboardValue.type, "leaderboard.type"),
      status: requiredString(leaderboardValue.status, "leaderboard.status"),
      prizes,
    },
    cache_updated_at: requiredString(
      payload.cache_updated_at,
      "cache_updated_at",
    ),
    stats: {
      participants: affiliates.length,
      total_wager: formatKingzAmount(totalWager),
      prize_pool: formatKingzAmount(prizePool),
      top_paid: prizes.length,
    },
  };
};

export async function fetchKingzLeaderboard(
  apiKey: string | undefined,
  startAt: string = DEFAULT_KINGZ_RACE_PERIOD.startAt,
  endAt: string = DEFAULT_KINGZ_RACE_PERIOD.endAt,
): Promise<KingzLeaderboardResponse> {
  if (!apiKey) {
    throw new Error("KINGZ_API_KEY is not configured");
  }

  const url = new URL(KINGZ_AFFILIATES_ENDPOINT);
  url.searchParams.set("start_at", startAt);
  url.searchParams.set("end_at", endAt);
  url.searchParams.set("key", apiKey);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Kingz API returned HTTP ${response.status}`);
  }

  return normalizeResponse(await response.json());
}

let lastValidResponse: KingzLeaderboardResponse | undefined;
let lastFetchAt = 0;
const CACHE_TTL_MS = 60_000;

export async function getKingzLeaderboard(
  apiKey: string | undefined,
  startAt: string = DEFAULT_KINGZ_RACE_PERIOD.startAt,
  endAt: string = DEFAULT_KINGZ_RACE_PERIOD.endAt,
): Promise<KingzLeaderboardResponse> {
  if (lastValidResponse && Date.now() - lastFetchAt < CACHE_TTL_MS) {
    return lastValidResponse;
  }

  try {
    const response = await fetchKingzLeaderboard(apiKey, startAt, endAt);
    lastValidResponse = response;
    lastFetchAt = Date.now();
    return response;
  } catch (error) {
    if (lastValidResponse) {
      return {
        ...lastValidResponse,
        stale: true,
      };
    }

    throw error;
  }
}