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
const PLAYERS = [
  { rank: 1, name: "RaffaKing", wagered: "$128,450", prize: "$2,000" },
  { rank: 2, name: "SlotHunter", wagered: "$112,300", prize: "$1,500" },
  { rank: 3, name: "PanteraVIP", wagered: "$94,870", prize: "$1,000" },
  { rank: 4, name: "MaxWinz", wagered: "$81,220", prize: "$750" },
  { rank: 5, name: "GambaLord", wagered: "$73,900", prize: "$600" },
  { rank: 6, name: "TurboSpin", wagered: "$66,410", prize: "$500" },
  { rank: 7, name: "LuckyMati", wagered: "$58,770", prize: "$400" },
  { rank: 8, name: "JuaniSlots", wagered: "$49,250", prize: "$300" },
  { rank: 9, name: "CryptoNico", wagered: "$41,600", prize: "$250" },
  { rank: 10, name: "BetWizard", wagered: "$35,980", prize: "$200" },
  { rank: 11, name: "AgusGamble", wagered: "$31,400", prize: "-" },
  { rank: 12, name: "TheRusher", wagered: "$28,750", prize: "-" },
  { rank: 13, name: "LuchoFan", wagered: "$25,990", prize: "-" },
  { rank: 14, name: "SpinMaster", wagered: "$22,300", prize: "-" },
  { rank: 15, name: "GonzaBet", wagered: "$19,875", prize: "-" },
  { rank: 16, name: "HighRollerX", wagered: "$17,640", prize: "-" },
  { rank: 17, name: "NahuelWin", wagered: "$15,200", prize: "-" },
  { rank: 18, name: "TinchoSlots", wagered: "$13,890", prize: "-" },
  { rank: 19, name: "CasinoWolf", wagered: "$11,500", prize: "-" },
  { rank: 20, name: "ModoBonus", wagered: "$9,750", prize: "-" },
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

function MainContent() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/30">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] left-[20%] w-[30%] h-[30%] bg-purple-600/5 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      {/* Header */}
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
            <Button variant="outline" className="hidden sm:flex border-primary/30 hover:border-primary/60 hover:bg-primary/10 text-foreground transition-all">
              <Dices className="w-4 h-4 mr-2" />
              Play on Gamba
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-[0_0_15px_rgba(236,72,153,0.4)] hover:shadow-[0_0_25px_rgba(236,72,153,0.6)] transition-all">
              Join my Kick
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 relative z-10">
        {/* Hero Section */}
        <section className="pt-24 pb-16 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              
              <div className="flex-1 space-y-8 text-center lg:text-left">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Badge variant="outline" className="mb-6 px-4 py-1.5 border-primary/50 text-primary bg-primary/10 uppercase tracking-widest text-xs font-bold">
                    <Star className="w-3 h-3 mr-2 inline" /> Official Event
                  </Badge>
                  <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-primary/50">
                    $7,500 <span className="text-primary drop-shadow-[0_0_20px_rgba(236,72,153,0.5)]">GAMBA</span> <br/>
                    WAGER RACE
                  </h1>
                  <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0">
                    Compete with the community, wager on your favorite games, and climb the leaderboard for massive prizes.
                  </p>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                >
                  <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-5 hover:border-primary/40 transition-colors">
                    <DollarSign className="w-8 h-8 text-primary mb-3" />
                    <div className="text-2xl font-bold">$7,500</div>
                    <div className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Prize Pool</div>
                  </div>
                  <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-5 hover:border-primary/40 transition-colors">
                    <Users className="w-8 h-8 text-primary mb-3" />
                    <div className="text-2xl font-bold">Top 10</div>
                    <div className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Paid Players</div>
                  </div>
                  <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-5 hover:border-primary/40 transition-colors">
                    <Dices className="w-8 h-8 text-primary mb-3" />
                    <div className="text-2xl font-bold">Gamba</div>
                    <div className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Casino</div>
                  </div>
                </motion.div>
              </div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-full lg:w-[400px] shrink-0"
              >
                <CountdownTimer />
              </motion.div>

            </div>
          </div>
        </section>

        {/* Casino Race Card Section */}
        <section className="py-12 px-4 border-y border-border/50 bg-card/20 backdrop-blur-md">
          <div className="container mx-auto max-w-5xl">
            <div className="flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-card to-card/50 border border-primary/20 rounded-2xl p-6 md:p-8 hover:shadow-[0_0_30px_rgba(236,72,153,0.1)] transition-all group">
              <div className="flex items-center gap-6 mb-6 md:mb-0">
                <div className="w-16 h-16 rounded-xl bg-background border border-primary/30 flex items-center justify-center shadow-[0_0_15px_rgba(236,72,153,0.2)]">
                  <Dices className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">Gamba Wager Race</h3>
                  <div className="flex items-center gap-4 text-sm font-medium">
                    <span className="text-green-400 flex items-center"><DollarSign className="w-4 h-4 mr-1"/> $7,500 Prize Pool</span>
                    <span className="text-muted-foreground border-l border-border pl-4">Top 10 Paid</span>
                  </div>
                </div>
              </div>
              <Button 
                size="lg" 
                className="w-full md:w-auto bg-foreground text-background hover:bg-foreground/90 font-bold"
                onClick={() => {
                  document.getElementById('leaderboard')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                View Leaderboard <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
            </div>
          </div>
        </section>

        {/* Leaderboard Section */}
        <section id="leaderboard" className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-black mb-4 uppercase tracking-tight">Current Standings</h2>
              <p className="text-muted-foreground">The race is hot. Keep wagering to secure your spot in the top 10.</p>
            </div>

            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-2xl relative">
              {/* Decorative top border */}
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
                          key={player.name}
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.05, duration: 0.3 }}
                          className={`
                            border-b border-border/50 hover:bg-muted/30 transition-colors group
                            ${isTop3 ? 'bg-primary/5' : ''}
                          `}
                        >
                          <td className="p-4 pl-6">
                            {rankIcon}
                          </td>
                          <td className="p-4 font-bold text-foreground group-hover:text-primary transition-colors">
                            {player.name}
                          </td>
                          <td className="p-4 text-right font-mono text-muted-foreground">
                            {player.wagered}
                          </td>
                          <td className={`p-4 pr-6 text-right font-mono font-bold ${isPaid ? 'text-green-400' : 'text-muted-foreground'}`}>
                            {player.prize}
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 px-4 bg-background relative z-10">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Phanzz Logo" className="w-6 h-6 object-contain grayscale opacity-50" />
            <span className="font-bold text-muted-foreground">PHANZZ</span>
          </div>
          <div className="text-sm text-muted-foreground text-center md:text-left">
            Official Wager Race. Must be 18+ to play. Please gamble responsibly.
          </div>
          <div className="flex gap-4">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">Gamba</a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">Kick</a>
          </div>
        </div>
      </footer>
    </div>
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
