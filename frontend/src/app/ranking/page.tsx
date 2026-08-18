"use client";

import { useWallet } from "@/context/WalletContext";
import { formatAddress } from "@/lib/utils";
import { 
  Trophy, 
  Flame, 
  Award, 
  Sparkles, 
  Coins, 
  BookOpen, 
  Crown,
  Medal,
  CheckCircle2,
  ExternalLink
} from "lucide-react";

interface RankingItem {
  posicao: number;
  leitor: string;
  versiculosLidos: number;
  certificados: number;
  saldoTal: number;
  streakDias: number;
  badges: string[];
}

export default function RankingPage() {
  const { isConnected, address, readVerses } = useWallet();

  const userReadCount = readVerses.size;

  // Mock global leaderboard dataset for Stellar network readers
  const leaderboard: RankingItem[] = [
    {
      posicao: 1,
      leitor: address || "GB6KJL6P...4ICJ",
      versiculosLidos: Math.max(userReadCount, 1533),
      certificados: 5,
      saldoTal: 850,
      streakDias: 14,
      badges: ["Apóstolo", "Teólogo", "Leitor Fiel"],
    },
    {
      posicao: 2,
      leitor: "GDK92XLP...77AK",
      versiculosLidos: 1240,
      certificados: 3,
      saldoTal: 500,
      streakDias: 9,
      badges: ["Teólogo", "Leitor Fiel"],
    },
    {
      posicao: 3,
      leitor: "GCAM78QQ...92ZZ",
      versiculosLidos: 980,
      certificados: 2,
      saldoTal: 350,
      streakDias: 7,
      badges: ["Leitor Fiel"],
    },
    {
      posicao: 4,
      leitor: "GA771BKP...01MM",
      versiculosLidos: 720,
      certificados: 1,
      saldoTal: 200,
      streakDias: 4,
      badges: ["Pentateuco"],
    },
    {
      posicao: 5,
      leitor: "GB3390XX...55WW",
      versiculosLidos: 450,
      certificados: 1,
      saldoTal: 100,
      streakDias: 3,
      badges: ["Evangelhos"],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Header Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 z-10 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono-tech font-bold uppercase">
            <Trophy className="w-3.5 h-3.5" />
            <span>LEADERBOARD GLOBAL STELLAR SOROBAN</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Tabela de Classificação dos Leitores
          </h1>

          <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
            Acompanhe o ranking em tempo real dos leitores mais ativos da Bíblia Sagrada na blockchain Stellar. Conquiste badges on-chain, aumente seu racha diário e ganhe prêmios em TAL!
          </p>
        </div>

        {/* Top Trophy Graphic */}
        <div className="w-24 h-24 rounded-3xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-2xl shadow-amber-500/30 shrink-0">
          <Crown className="w-14 h-14 animate-pulse" />
        </div>
      </div>

      {/* Podium Cards (Top 3) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* #2 Rank */}
        <div className="bg-elevated p-6 rounded-2xl border border-slate-800 flex flex-col justify-between order-2 md:order-1 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-extrabold text-sm flex items-center justify-center font-mono-tech">
              #2
            </span>
            <Medal className="w-6 h-6 text-slate-400" />
          </div>

          <div className="space-y-2 mb-4">
            <span className="font-mono-tech font-bold text-slate-200 text-sm block">
              {leaderboard[1].leitor}
            </span>
            <div className="flex flex-wrap gap-1">
              {leaderboard[1].badges.map((b) => (
                <span key={b} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono-tech text-teal-400 font-semibold">
                  {b}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono-tech text-slate-400">
            <span>{leaderboard[1].versiculosLidos} versículos</span>
            <span className="text-amber-400 font-bold">{leaderboard[1].saldoTal} TAL</span>
          </div>
        </div>

        {/* #1 Champion Rank */}
        <div className="glass-panel-teal p-6 rounded-2xl border border-amber-500/60 teal-glow flex flex-col justify-between order-1 md:order-2 relative overflow-hidden scale-105">
          <div className="flex items-center justify-between mb-4">
            <span className="w-9 h-9 rounded-full bg-amber-500 text-slate-950 font-black text-base flex items-center justify-center font-mono-tech shadow-lg shadow-amber-500/30">
              #1
            </span>
            <Crown className="w-7 h-7 text-amber-400" />
          </div>

          <div className="space-y-2 mb-4">
            <span className="font-mono-tech font-extrabold text-white text-base block">
              {leaderboard[0].leitor}
            </span>
            <div className="flex flex-wrap gap-1">
              {leaderboard[0].badges.map((b) => (
                <span key={b} className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-mono-tech font-bold">
                  {b}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-teal-500/40 flex items-center justify-between text-xs font-mono-tech text-teal-200 font-bold">
            <span className="flex items-center gap-1">
              <Flame className="w-4 h-4 text-orange-400" />
              {leaderboard[0].streakDias} Dias Racha
            </span>
            <span className="text-amber-400 text-sm font-extrabold">{leaderboard[0].saldoTal} TAL</span>
          </div>
        </div>

        {/* #3 Rank */}
        <div className="bg-elevated p-6 rounded-2xl border border-slate-800 flex flex-col justify-between order-3 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-amber-600 font-extrabold text-sm flex items-center justify-center font-mono-tech">
              #3
            </span>
            <Medal className="w-6 h-6 text-amber-600" />
          </div>

          <div className="space-y-2 mb-4">
            <span className="font-mono-tech font-bold text-slate-200 text-sm block">
              {leaderboard[2].leitor}
            </span>
            <div className="flex flex-wrap gap-1">
              {leaderboard[2].badges.map((b) => (
                <span key={b} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono-tech text-teal-400 font-semibold">
                  {b}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono-tech text-slate-400">
            <span>{leaderboard[2].versiculosLidos} versículos</span>
            <span className="text-amber-400 font-bold">{leaderboard[2].saldoTal} TAL</span>
          </div>
        </div>
      </div>

      {/* Full Leaderboard Table */}
      <div className="bg-elevated rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <h2 className="font-bold text-white text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-400" />
            Classificação Completa dos Leitores
          </h2>
          <span className="text-xs font-mono-tech text-slate-400">
            Rede: Stellar Futurenet (Soroban Smart Contract)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 font-mono-tech text-xs text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-6">Posição</th>
                <th className="py-3.5 px-6">Leitor / Carteira</th>
                <th className="py-3.5 px-6">Versículos</th>
                <th className="py-3.5 px-6">Racha Diário</th>
                <th className="py-3.5 px-6">Certificados</th>
                <th className="py-3.5 px-6 text-right">Saldo TAL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono-tech text-xs">
              {leaderboard.map((item) => (
                <tr key={item.posicao} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-300">
                    #{item.posicao}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-100">{item.leitor}</span>
                      {item.posicao === 1 && (
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                          LÍDER
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-300 font-semibold">
                    {item.versiculosLidos} Lidos
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 font-bold">
                      <Flame className="w-3.5 h-3.5" />
                      {item.streakDias} dias
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-300">
                    {item.certificados} Soulbound
                  </td>
                  <td className="py-4 px-6 text-right font-extrabold text-amber-400">
                    {item.saldoTal} TAL
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
