import React, { useState, useEffect, useRef } from "react";
import { Switch, Route, Router as WouterRouter, Link } from "wouter";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Play, Clock, Medal, Crown, Star, ArrowRight, ChevronRight, Users, DollarSign, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

type PlayerRow = {
  rank: number;
  name: string;
  wagered: string;
  prize: string;
};

type Stat = {
  label: string;
  value: string;
};

type KingzLeaderboardResponse = {
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

const maskName = (name: string) =>
  name.length <= 2 ? `${name.slice(0, 1)}*` : name.slice(0, 2) + "*".repeat(name.length - 2);

const formatCurrency = (value: string | number) => {
  const amount =
    typeof value === "number" ? value : Number(value.replace(/[^0-9.-]/g, ""));
  return Number.isFinite(amount)
    ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount)
    : "-";
};

const PLAYERS = [
  { rank: 1, name: maskName("RaffaKing"), wagered: "$80,842.17", prize: "$2,000" },
  { rank: 2, name: maskName("SlotHunter"), wagered: "$41,475.83", prize: "$1,500" },
  { rank: 3, name: maskName("PanteraVIP"), wagered: "$35,930.54", prize: "$1,000" },
  { rank: 4, name: maskName("MaxWinz"), wagered: "$27,820.39", prize: "$750" },
  { rank: 5, name: maskName("GambaLord"), wagered: "$23,640.61", prize: "$600" },
  { rank: 6, name: maskName("TurboSpin"), wagered: "$21,275.08", prize: "$500" },
  { rank: 7, name: maskName("LuckyMati"), wagered: "$9,842.72", prize: "$400" },
  { rank: 8, name: maskName("JuaniSlots"), wagered: "$8,110.45", prize: "$300" },
  { rank: 9, name: maskName("CryptoNico"), wagered: "$7,455.93", prize: "$250" },
  { rank: 10, name: maskName("BetWizard"), wagered: "$6,280.27", prize: "$200" },
  { rank: 11, name: maskName("AgusGamble"), wagered: "$5,740.14", prize: "-" },
  { rank: 12, name: maskName("TheRusher"), wagered: "$5,180.66", prize: "-" },
  { rank: 13, name: maskName("LuchoFan"), wagered: "$4,625.31", prize: "-" },
  { rank: 14, name: maskName("SpinMaster"), wagered: "$4,110.88", prize: "-" },
  { rank: 15, name: maskName("GonzaBet"), wagered: "$3,780.52", prize: "-" },
  { rank: 16, name: maskName("HighRollerX"), wagered: "$3,240.07", prize: "-" },
  { rank: 17, name: maskName("NahuelWin"), wagered: "$2,915.43", prize: "-" },
  { rank: 18, name: maskName("TinchoSlots"), wagered: "$2,380.96", prize: "-" },
  { rank: 19, name: maskName("CasinoWolf"), wagered: "$1,840.29", prize: "-" },
  { rank: 20, name: maskName("ModoBonus"), wagered: "$1,120.74", prize: "-" },
];

const GAMBA_STATS = [
  { label: "Prize Pool", value: "$7,500" },
  { label: "Top Paid", value: "Top 10" },
  { label: "Participants", value: "347" },
  { label: "Total Wager", value: "$472,847.59" },
];

function BigCountdown({ endDate }: { endDate: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const target = new Date(
      endDate.includes("T") ? endDate : `${endDate}T23:59:59-03:00`,
    );
    const tick = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) { setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return; }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endDate]);
  const f = (n: number) => n.toString().padStart(2, "0");
  const units = [
    { value: f(timeLeft.days), label: "DAYS" },
    { value: f(timeLeft.hours), label: "HRS" },
    { value: f(timeLeft.minutes), label: "MIN" },
    { value: f(timeLeft.seconds), label: "SEC" },
  ];
  return (
    <div className="text-center">
      <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-4">Ending in</p>
      <div className="flex items-start justify-center gap-1">
        {units.map((u, i) => (
          <div key={u.label} className="flex items-start gap-1">
            <div className="flex flex-col items-center w-16 md:w-20">
              <span className="font-black text-4xl md:text-5xl text-foreground tabular-nums leading-none">{u.value}</span>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1.5">{u.label}</span>
            </div>
            {i < 3 && <span className="text-primary font-black text-3xl md:text-4xl leading-none mt-0.5">:</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

const BG_EFFECTS = (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]" />
    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]" />
    <div className="absolute top-[40%] left-[20%] w-[30%] h-[30%] bg-purple-600/5 rounded-full blur-[100px]" />
  </div>
);

function LeaderboardView({
  onBack,
  logoSrc,
  players,
  stats,
  heading,
  description,
  endDate,
  loading = false,
  error,
  cacheUpdatedAt,
}: {
  onBack: () => void;
  logoSrc: string;
  players: PlayerRow[];
  stats: Stat[];
  heading: string;
  description: string;
  endDate: string;
  loading?: boolean;
  error?: string;
  cacheUpdatedAt?: string;
}) {
  return (
    <motion.div
      key="leaderboard"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.35 }}
      className="min-h-screen bg-background text-foreground font-sans"
    >
      {BG_EFFECTS}
      {/* Gamba logo tiled background */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `url(${logoSrc})`,
          backgroundRepeat: 'repeat',
          backgroundSize: '220px',
          opacity: 0.04,
          filter: 'blur(2px) grayscale(100%)',
        }}
      />
      {/* Minimal header — logo acts as back button */}
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-3 group cursor-pointer"
            data-testid="button-back-home"
          >
            <div className="relative w-12 h-12 rounded-lg bg-card border border-primary/30 flex items-center justify-center overflow-hidden group-hover:border-primary/60 transition-colors">
              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <img src="/logo.png" alt="Phanzz Logo" className="w-8 h-8 object-contain z-10" />
            </div>
            <span className="font-bold text-xl tracking-tight hidden sm:inline-block group-hover:text-primary transition-colors">PHANZZ</span>
          </button>
        </div>
      </header>

      <main className="relative z-10 py-10 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Title + big countdown */}
          <div className="text-center mb-8">
            <h2 className="text-4xl font-black mb-2 uppercase tracking-tight">{heading}</h2>
            <p className="text-muted-foreground mb-8">{description}</p>
            <BigCountdown endDate={endDate} />
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-card border border-border/50 rounded-xl px-4 py-3 text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{stat.label}</p>
                <p className="text-lg font-bold text-foreground">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-2xl relative">
            <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary to-transparent" />
            <div>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    <th className="p-4 pl-6 text-muted-foreground font-semibold text-sm uppercase tracking-wider w-24 text-center">Rank</th>
                    <th className="p-4 text-muted-foreground font-semibold text-sm uppercase tracking-wider">Player</th>
                    <th className="p-4 text-muted-foreground font-semibold text-sm uppercase tracking-wider text-right">Wagered</th>
                    <th className="p-4 pr-6 text-primary font-semibold text-sm uppercase tracking-wider text-right w-32">Prize</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="p-12 text-center">
                        <p className="font-bold text-foreground">Loading standings</p>
                        <p className="text-sm text-muted-foreground mt-1">Fetching the latest Kingz race data.</p>
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={4} className="p-12 text-center">
                        <p className="font-bold text-foreground">Standings unavailable</p>
                        <p className="text-sm text-muted-foreground mt-1">{error}</p>
                      </td>
                    </tr>
                  ) : players.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-12 text-center">
                        <p className="font-bold text-foreground">No results yet</p>
                        <p className="text-sm text-muted-foreground mt-1">Standings will appear once the race begins.</p>
                      </td>
                    </tr>
                  ) : players.map((player, index) => {
                    const isTop3 = player.rank <= 3;
                    const isPaid = player.rank <= 10;
                    let rankIcon = null;
                    if (player.rank === 1) rankIcon = <Crown className="w-5 h-5 text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)] mx-auto" />;
                    else if (player.rank === 2) rankIcon = <Medal className="w-5 h-5 text-gray-300 drop-shadow-[0_0_5px_rgba(209,213,219,0.5)] mx-auto" />;
                    else if (player.rank === 3) rankIcon = <Medal className="w-5 h-5 text-amber-600 drop-shadow-[0_0_5px_rgba(217,119,6,0.5)] mx-auto" />;
                    else rankIcon = <span className="font-mono font-bold text-muted-foreground text-center block w-full">{player.rank}</span>;
                    return (
                      <motion.tr
                        key={`${player.rank}-${player.name}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.04, duration: 0.3 }}
                        className={`border-b border-border/50 hover:bg-muted/30 transition-colors group ${isTop3 ? 'bg-primary/5' : ''}`}
                      >
                        <td className="p-4 pl-6">{rankIcon}</td>
                        <td className="p-4 font-bold text-foreground group-hover:text-primary transition-colors">{player.name}</td>
                        <td className="p-4 text-right font-mono text-muted-foreground">{player.wagered}</td>
                        <td className={`p-4 pr-6 text-right font-mono font-bold ${isPaid ? 'text-green-400' : 'text-muted-foreground'}`}>{player.prize}</td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          {cacheUpdatedAt && (
            <span className="sr-only" data-testid="kingz-cache-updated-at">
              {cacheUpdatedAt}
            </span>
          )}
        </div>
      </main>
    </motion.div>
  );
}

function HomeView({
  onViewLeaderboard,
  onViewKingzLeaderboard,
  kingzStats,
}: {
  onViewLeaderboard: () => void;
  onViewKingzLeaderboard: () => void;
  kingzStats: Stat[];
}) {
  return (
    <motion.div
      key="home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/30"
    >
      {BG_EFFECTS}
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-lg bg-card border border-primary/30 flex items-center justify-center overflow-hidden group">
              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <img src="/logo.png" alt="Phanzz Logo" className="w-8 h-8 object-contain z-10" />
            </div>
            <span className="font-bold text-xl tracking-tight hidden sm:inline-block">PHANZZ</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="hidden sm:flex border-primary/30 hover:border-primary/60 hover:bg-primary/10 text-foreground transition-all" onClick={() => window.open("https://x.com/brandixslots", "_blank")}>
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.265 5.638L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/></svg>
              Follow on X
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-[0_0_15px_rgba(236,72,153,0.4)] hover:shadow-[0_0_25px_rgba(236,72,153,0.6)] transition-all" onClick={() => window.open("https://kick.com/phanzz", "_blank")}>
              <img src="/kick-logo.png" alt="Kick" className="w-4 h-4 mr-2 object-contain" />
              Join my Kick
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 relative z-10">
        <section className="pt-28 pb-20 px-4">
          <div className="container mx-auto max-w-3xl text-center">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-6xl md:text-8xl font-black leading-tight tracking-tighter mb-6">
                Monthly<br/>
                <span className="text-primary drop-shadow-[0_0_20px_rgba(236,72,153,0.5)]">Wager Races</span>
              </h1>
              <div className="flex justify-center">
                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed border-l-2 border-r-2 border-primary/50 pl-4 pr-4 inline">
                  Play, wager and compete for a share of the prize pool.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-10 px-4">
          <div className="container mx-auto max-w-[980px] flex gap-4 justify-center flex-wrap">
            {/* Gamba card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="relative flex flex-col items-center justify-between bg-card border border-primary/20 rounded-2xl p-5 hover:border-primary/60 hover:shadow-[0_0_30px_rgba(236,72,153,0.12)] transition-all cursor-pointer group w-[300px] h-[300px] overflow-hidden shrink-0"
              onClick={onViewLeaderboard}
              data-testid="button-view-leaderboard"
            >
              <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-muted/70 border border-border/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                Finished
              </span>
              <div className="h-40 w-full flex items-center justify-center">
                <img src="/gamba-logo.png" alt="Gamba" className="w-full max-w-[160px] object-contain" />
              </div>

              <div className="w-full flex flex-col items-center gap-1.5">
                <p className="text-2xl font-black text-foreground tracking-tight">$7,500</p>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Prize Pool</p>
                <div className="flex gap-1.5 mt-0.5">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-semibold">Top 10 Paid</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted/50 border border-border/40 text-muted-foreground font-semibold">Monthly</span>
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                View final standings <ChevronRight className="w-4 h-4" />
              </div>
            </motion.div>

            {/* Kingz card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.22 }}
              className="flex flex-col items-center justify-between bg-card border border-primary/20 rounded-2xl p-5 hover:border-primary/60 hover:shadow-[0_0_30px_rgba(236,72,153,0.12)] transition-all cursor-pointer group w-[300px] h-[300px] overflow-hidden shrink-0"
              onClick={onViewKingzLeaderboard}
              data-testid="button-view-kingz-leaderboard"
            >
              <div className="h-40 w-full flex items-center justify-center">
                <img src="/kingz-logo.png" alt="Kingz" className="w-full max-w-[160px] object-contain" />
              </div>

              <div className="w-full flex flex-col items-center gap-1.5">
                <p className="text-2xl font-black text-foreground tracking-tight">
                  {kingzStats.find((stat) => stat.label === "Prize Pool")?.value ?? "-"}
                </p>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Prize Pool</p>
                <div className="flex gap-1.5 mt-0.5">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-semibold">
                    {kingzStats.find((stat) => stat.label === "Top Paid")?.value ?? "-"}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted/50 border border-border/40 text-muted-foreground font-semibold">Biweekly</span>
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                View leaderboard <ChevronRight className="w-4 h-4" />
              </div>
            </motion.div>

          </div>
        </section>
      </main>

    </motion.div>
  );
}

function MainContent() {
  const [view, setView] = useState<'home' | 'leaderboard' | 'kingz'>('home');
  const kingzQuery = useQuery<KingzLeaderboardResponse>({
    queryKey: ["kingz-leaderboard"],
    queryFn: async () => {
      const response = await fetch("/api/leaderboard");
      if (!response.ok) {
        throw new Error("The Kingz leaderboard is temporarily unavailable.");
      }
      return response.json() as Promise<KingzLeaderboardResponse>;
    },
    refetchInterval: 60_000,
    retry: 1,
  });

  const kingzData = kingzQuery.data;
  const kingzPlayers: PlayerRow[] = kingzData?.affiliates.map((player) => ({
    rank: player.rank,
    name: maskName(player.username),
    wagered: formatCurrency(player.wagered_amount),
    prize: player.prize ? formatCurrency(player.prize) : "-",
  })) ?? [];
  const kingzStats: Stat[] = [
    { label: "Prize Pool", value: kingzData ? formatCurrency(kingzData.stats.prize_pool) : "-" },
    { label: "Top Paid", value: kingzData ? `Top ${kingzData.stats.top_paid}` : "-" },
    { label: "Participants", value: kingzData ? String(kingzData.stats.participants) : "-" },
    { label: "Total Wager", value: kingzData ? formatCurrency(kingzData.stats.total_wager) : "-" },
  ];
  const kingzError = kingzQuery.isError
    ? "Unable to load the latest Kingz standings."
    : kingzData?.stale
      ? "Showing the last valid Kingz update."
      : undefined;

  return (
    <AnimatePresence mode="wait">
      {view === 'home'
        ? <HomeView
            key="home"
            onViewLeaderboard={() => { setView('leaderboard'); window.scrollTo(0, 0); }}
            onViewKingzLeaderboard={() => { setView('kingz'); window.scrollTo(0, 0); }}
            kingzStats={kingzStats}
          />
        : <LeaderboardView
            key={view}
            onBack={() => { setView('home'); window.scrollTo(0, 0); }}
            logoSrc={view === 'kingz' ? '/kingz-logo.png' : '/gamba-logo.png'}
            players={view === 'kingz' ? kingzPlayers : PLAYERS}
            stats={view === 'kingz' ? kingzStats : GAMBA_STATS}
            heading={view === 'kingz' ? 'Current Standings' : 'Final Standings'}
            description={view === 'kingz'
              ? kingzData?.leaderboard.title ?? 'Current Kingz standings'
              : 'This race has finished. Here are the final results.'}
            endDate={view === 'kingz' ? kingzData?.leaderboard.end_date ?? "2026-09-23" : "2026-06-30"}
            loading={view === 'kingz' && kingzQuery.isLoading}
            error={view === 'kingz' ? kingzError : undefined}
            cacheUpdatedAt={view === 'kingz' ? kingzData?.cache_updated_at : undefined}
          />
      }
    </AnimatePresence>
  );
}

function Loader({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 1500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[100] bg-background flex items-center justify-center"
    >
      <div className="relative">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-primary/40 rounded-full blur-[50px]"
        />
        <img src="/logo.png" alt="Loading..." className="w-32 h-32 object-contain relative z-10 animate-pulse" />
      </div>
    </motion.div>
  );
}

function Home() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <AnimatePresence>
        {loading && <Loader onComplete={() => setLoading(false)} />}
      </AnimatePresence>
      {!loading && <MainContent />}
    </>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
