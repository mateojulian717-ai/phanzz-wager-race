const KINGZ_AFFILIATES_ENDPOINT =
  "https://leaderboard.kingz.win/v1/external/affiliates";

const DEFAULT_START_AT = "2026-09-08";
const DEFAULT_END_AT = "2026-09-23";
const CACHE_TTL_MS = 60_000;

type RecordValue = Record<string, unknown>;

type FetchResponse = {
  ok: boolean;
  status: number;
  json(): Promise<unknown>;
};

type NodeRuntime = {
  URL: new (input: string) => {
    searchParams: {
      set(name: string, value: string): void;
    };
  };
  fetch(input: unknown): Promise<FetchResponse>;
  process: {
    env: Record<string, string | undefined>;
  };
};

const nodeRuntime = globalThis as unknown as NodeRuntime;
const URL = nodeRuntime.URL;
const fetch = nodeRuntime.fetch;
const process = nodeRuntime.process;

export type LeaderboardResponse = {
  affiliates: Array<{
    username: string;
    id: string;
    wagered_amount: string;
    rank: number;
    deposited_amount: string;
    prize: string;
  }>;
  leaderboard: {
    title: string;
    start_date: string;
    end_date: string;
    type: string;
    status: string;
    prizes: Array<{ place: number; prize: string }>;
  };
  cache_updated_at: string;
  stats: {
    participants: number;
    total_wager: string;
    prize_pool: string;
    top_paid: number;
  };
  stale?: boolean;
};

const isRecord = (value: unknown): value is RecordValue =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const stringValue = (value: unknown, field: string): string => {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`Kingz response field "${field}" is invalid`);
  }
  return value;
};

const numberValue = (value: unknown, field: string): number => {
  const result = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(result)) {
    throw new Error(`Kingz response field "${field}" is invalid`);
  }
  return result;
};

const amountValue = (value: string, field: string): number => {
  const result = Number(value.replace(/[^0-9.-]/g, ""));
  if (!Number.isFinite(result)) {
    throw new Error(`Kingz amount field "${field}" is invalid`);
  }
  return result;
};

const money = (value: number): string => value.toFixed(2);

const normalize = (payload: unknown): LeaderboardResponse => {
  if (!isRecord(payload) || !Array.isArray(payload.affiliates) || !isRecord(payload.leaderboard)) {
    throw new Error("Kingz returned an invalid leaderboard response");
  }
  if (!Array.isArray(payload.leaderboard.prizes)) {
    throw new Error("Kingz response is missing prize data");
  }

  const prizes = payload.leaderboard.prizes.map((value, index) => {
    if (!isRecord(value)) throw new Error(`Invalid Kingz prize at ${index}`);
    return {
      place: numberValue(value.place, `leaderboard.prizes[${index}].place`),
      prize: stringValue(value.prize, `leaderboard.prizes[${index}].prize`),
    };
  });
  const prizeByPlace = new Map(prizes.map((value) => [value.place, value.prize]));

  const affiliates = payload.affiliates.map((value, index) => {
    if (!isRecord(value)) throw new Error(`Invalid Kingz affiliate at ${index}`);
    return {
      username: stringValue(value.username, `affiliates[${index}].username`),
      id: stringValue(value.id, `affiliates[${index}].id`),
      wagered_amount: stringValue(
        value.wagered_amount,
        `affiliates[${index}].wagered_amount`,
      ),
      rank: numberValue(value.rank, `affiliates[${index}].rank`),
      deposited_amount: stringValue(
        value.deposited_amount,
        `affiliates[${index}].deposited_amount`,
      ),
      prize: "",
    };
  }).map((value) => ({ ...value, prize: prizeByPlace.get(value.rank) ?? "" }))
    .sort((a, b) => a.rank - b.rank);

  const totalWager = affiliates.reduce(
    (sum, value) => sum + amountValue(value.wagered_amount, "wagered_amount"),
    0,
  );
  const prizePool = prizes.reduce(
    (sum, value) => sum + amountValue(value.prize, "prize"),
    0,
  );

  return {
    affiliates,
    leaderboard: {
      title: stringValue(payload.leaderboard.title, "leaderboard.title"),
      start_date: stringValue(payload.leaderboard.start_date, "leaderboard.start_date"),
      end_date: stringValue(payload.leaderboard.end_date, "leaderboard.end_date"),
      type: stringValue(payload.leaderboard.type, "leaderboard.type"),
      status: stringValue(payload.leaderboard.status, "leaderboard.status"),
      prizes,
    },
    cache_updated_at: stringValue(payload.cache_updated_at, "cache_updated_at"),
    stats: {
      participants: affiliates.length,
      total_wager: money(totalWager),
      prize_pool: money(prizePool),
      top_paid: prizes.length,
    },
  };
};

let lastValidResponse: LeaderboardResponse | undefined;
let lastFetchAt = 0;

export async function getKingzLeaderboard(): Promise<LeaderboardResponse> {
  if (lastValidResponse && Date.now() - lastFetchAt < CACHE_TTL_MS) {
    return lastValidResponse;
  }

  const apiKey = process.env.KINGZ_API_KEY;
  if (!apiKey) throw new Error("KINGZ_API_KEY is not configured");

  const url = new URL(KINGZ_AFFILIATES_ENDPOINT);
  url.searchParams.set("start_at", process.env.KINGZ_RACE_START_AT ?? DEFAULT_START_AT);
  url.searchParams.set("end_at", process.env.KINGZ_RACE_END_AT ?? DEFAULT_END_AT);
  url.searchParams.set("key", apiKey);

  try {
    const response = (await fetch(url)) as FetchResponse;
    if (!response.ok) throw new Error(`Kingz API returned HTTP ${response.status}`);
    const result = normalize(await response.json());
    lastValidResponse = result;
    lastFetchAt = Date.now();
    return result;
  } catch (error) {
    if (lastValidResponse) return { ...lastValidResponse, stale: true };
    throw error;
  }
}