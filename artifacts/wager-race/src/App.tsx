import React, { useState, useEffect, useRef } from "react";
import { Switch, Route, Router as WouterRouter, Link } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Play, Clock, Medal, Crown, Star, ArrowRight, ChevronRight, Dices, Users, DollarSign, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

// Hardcoded Data
const maskName = (name: string) => name.slice(0, 2) + "*".repeat(name.length - 2);

const PLAYERS = [
  { rank: 1, name: maskName("RaffaKing"), wagered: "$70,842", prize: "$2,000" },
  { rank: 2, name: maskName("SlotHunter"), wagered: "$31,475", prize: "$1,500" },
  { rank: 3, name: maskName("PanteraVIP"), wagered: "$25,930", prize: "$1,000" },
  { rank: 4, name: maskName("MaxWinz"), wagered: "$17,820", prize: "$750" },
  { rank: 5, name: maskName("GambaLord"), wagered: "$13,640", prize: "$600" },
  { rank: 6, name: maskName("TurboSpin"), wagered: "$11,275", prize: "$500" },
  { rank: 7, name: maskName("LuckyMati"), wagered: "$9,842", prize: "$400" },
  { rank: 8, name: maskName("JuaniSlots"), wagered: "$8,110", prize: "$300" },
  { rank: 9, name: maskName("CryptoNico"), wagered: "$7,455", prize: "$250" },
  { rank: 10, name: maskName("BetWizard"), wagered: "$6,280", prize: "$200" },
  { rank: 11, name: maskName("AgusGamble"), wagered: "$5,740", prize: "-" },
  { rank: 12, name: maskName("TheRusher"), wagered: "$5,180", prize: "-" },
  { rank: 13, name: maskName("LuchoFan"), wagered: "$4,625", prize: "-" },
  { rank: 14, name: maskName("SpinMaster"), wagered: "$4,110", prize: "-" },
  { rank: 15, name: maskName("GonzaBet"), wagered: "$3,780", prize: "-" },
  { rank: 16, name: maskName("HighRollerX"), wagered: "$3,240", prize: "-" },
  { rank: 17, name: maskName("NahuelWin"), wagered: "$2,915", prize: "-" },
  { rank: 18, name: maskName("TinchoSlots"), wagered: "$2,380", prize: "-" },
  { rank: 19, name: maskName("CasinoWolf"), wagered: "$1,840", prize: "-" },
  { rank: 20, name: maskName("ModoBonus"), wagered: "$1,120", prize: "-" },
];

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ days: 6, hours: 12, minutes: 45, seconds: 0 });

  useEffect(() => {
    // Fake a target date
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 6);
    targetDate.setHours(targetDate.getHours() + 12);
    targetDate.setMinutes(targetDate.getMinutes() + 45);

    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        clearInterval(interval);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => num.toString().padStart(2, "0");

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-card border border-primary/20 rounded-2xl shadow-[0_0_30px_rgba(236,72,153,0.15)] relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
      <div className="flex items-center gap-2 mb-4 text-primary font-medium tracking-widest uppercase text-sm">
        <Activity className="w-4 h-4 animate-pulse" />
        Race ends in
      </div>
      <div className="flex items-center gap-4 text-center">
        <div className="flex flex-col">
          <span className="text-4xl md:text-5xl font-mono font-bold text-foreground drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
            {formatNumber(timeLeft.days)}
          </span>
          <span className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Days</span>
        </div>
        <span className="text-3xl text-primary font-bold -mt-5">:</span>
        <div className="flex flex-col">
          <span className="text-4xl md:text-5xl font-mono font-bold text-foreground drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
            {formatNumber(timeLeft.hours)}
          </span>
          <span className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Hrs</span>
        </div>
        <span className="text-3xl text-primary font-bold -mt-5">:</span>
        <div className="flex flex-col">
          <span className="text-4xl md:text-5xl font-mono font-bold text-foreground drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
            {formatNumber(timeLeft.minutes)}
          </span>
          <span className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Mins</span>
        </div>
        <span className="text-3xl text-primary font-bold -mt-5">:</span>
        <div className="flex flex-col">
          <span className="text-4xl md:text-5xl font-mono font-bold text-primary drop-shadow-[0_0_15px_rgba(236,72,153,0.6)]">
            {formatNumber(timeLeft.seconds)}
          </span>
          <span className="text-xs text-primary/70 uppercase tracking-widest mt-1">Secs</span>
        </div>
      </div>
    </div>
  );
}

function CompactCountdown() {
  const TARGET = new Date("2026-06-17T00:00:00");
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = TARGET.getTime() - Date.now();
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
  }, []);
  const f = (n: number) => n.toString().padStart(2, "0");
  return (
    <span className="font-mono font-bold text-foreground tracking-widest">
      {f(timeLeft.days)}<span className="text-primary mx-0.5">d</span>
      {f(timeLeft.hours)}<span className="text-primary mx-0.5">h</span>
      {f(timeLeft.minutes)}<span className="text-primary mx-0.5">m</span>
      {f(timeLeft.seconds)}<span className="text-primary mx-0.5">s</span>
    </span>
  );
}

const BG_EFFECTS = (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]" />
    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]" />
    <div className="absolute top-[40%] left-[20%] w-[30%] h-[30%] bg-purple-600/5 rounded-full blur-[100px]" />
  </div>
);

function LeaderboardView({ onBack }: { onBack: () => void }) {
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
          backgroundImage: 'url(/gamba-logo.png)',
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
          <span className="text-sm text-muted-foreground font-medium uppercase tracking-widest">Gamba Wager Race</span>
        </div>
      </header>

      <main className="relative z-10 py-10 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Title + compact countdown */}
          <div className="text-center mb-8">
            <h2 className="text-4xl font-black mb-2 uppercase tracking-tight">Current Standings</h2>
            <p className="text-muted-foreground mb-5">The race is hot. Keep wagering to secure your spot in the top 10.</p>
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-primary/30 bg-primary/5 text-sm font-medium">
              <Activity className="w-4 h-4 text-primary animate-pulse shrink-0" />
              <span className="text-muted-foreground uppercase tracking-widest text-xs">Race ends in</span>
              <CompactCountdown />
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-2xl relative">
            <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary to-transparent" />
            <div className="overflow-x-auto">
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
                  {PLAYERS.map((player, index) => {
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
        </div>
      </main>
    </motion.div>
  );
}

function HomeView({ onViewLeaderboard }: { onViewLeaderboard: () => void }) {
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
              <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tighter mb-6">
                Monthly<br/>
                <span className="text-primary drop-shadow-[0_0_20px_rgba(236,72,153,0.5)]">Wager Races</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed border-l-2 border-primary/50 pl-4 text-left">
                Play, wager and compete for a share of the prize pool.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-10 px-4">
          <div className="container mx-auto max-w-3xl flex gap-4 justify-center">
            {/* Gamba card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="flex flex-col items-center justify-between bg-card border border-primary/20 rounded-2xl p-6 hover:border-primary/60 hover:shadow-[0_0_30px_rgba(236,72,153,0.12)] transition-all cursor-pointer group aspect-square max-w-[220px] w-full"
              onClick={onViewLeaderboard}
              data-testid="button-view-leaderboard"
            >
              <img src="/gamba-logo.png" alt="Gamba" className="w-full max-w-[110px] object-contain" />
              <div className="text-center mt-auto pt-6">
                <p className="text-sm text-muted-foreground mb-3">$7,500 · Top 10 Paid</p>
                <div className="inline-flex items-center gap-1.5 text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                  View leaderboard <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>

            {/* Coming soon card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.22 }}
              className="flex flex-col items-center justify-center bg-card/20 border border-border/20 rounded-2xl p-6 opacity-40 cursor-not-allowed select-none aspect-square max-w-[220px] w-full"
            >
              <Dices className="w-10 h-10 text-muted-foreground/30 mb-4" />
              <p className="font-bold text-muted-foreground text-lg">More casinos</p>
              <span className="text-xs font-bold uppercase tracking-widest text-primary/50 mt-2">Coming soon</span>
            </motion.div>
          </div>
        </section>
      </main>

    </motion.div>
  );
}

function MainContent() {
  const [view, setView] = useState<'home' | 'leaderboard'>('home');
  return (
    <AnimatePresence mode="wait">
      {view === 'home'
        ? <HomeView key="home" onViewLeaderboard={() => { setView('leaderboard'); window.scrollTo(0, 0); }} />
        : <LeaderboardView key="leaderboard" onBack={() => { setView('home'); window.scrollTo(0, 0); }} />
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
