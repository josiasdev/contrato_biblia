"use client";

import Link from "next/link";
import { useWallet } from "@/context/WalletContext";
import { useTranslation } from "@/context/LanguageContext";
import { ReadingJourney } from "@/components/ReadingJourney";
import { 
  BookOpen, 
  ShieldCheck, 
  MessageSquareQuote, 
  Coins, 
  Sparkles, 
  ArrowRight, 
  Flame,
  Award,
  ExternalLink,
  Lock,
  Code
} from "lucide-react";

export default function Home() {
  const { isConnected, readVersesCount, talBalance, completedBooks } = useWallet();
  const { t } = useTranslation();

  return (
    <div className="space-y-12 pb-8">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl glass-panel-teal p-8 sm:p-12 border border-teal-500/30">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-mono-tech font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t("hero.badge")}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {t("hero.title1")} <br />
            <span className="bg-gradient-to-r from-teal-400 via-emerald-300 to-teal-200 bg-clip-text text-transparent">
              {t("hero.title2")}
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            {t("hero.description")}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/leitor"
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm shadow-xl shadow-teal-500/20 active:scale-95 transition-all"
            >
              <BookOpen className="w-4 h-4" />
              <span>{t("hero.cta.reader")}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/reflexoes"
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-elevated text-teal-300 hover:text-white border border-slate-700 hover:border-teal-500/50 font-semibold text-sm transition-all"
            >
              <MessageSquareQuote className="w-4 h-4 text-teal-400" />
              <span>{t("hero.cta.feed")}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Streak Tracker & Quick Stats Banner */}
      <section className="bg-elevated p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-950/80 border border-teal-500/40 flex items-center justify-center text-teal-400 shadow-md shadow-teal-500/10">
            <Flame className="w-7 h-7 text-teal-400 animate-bounce" />
          </div>
          <div>
            <h3 className="font-mono-tech font-extrabold text-xl text-white tracking-wider flex items-center gap-2">
              {t("streak.title")}
            </h3>
            <p className="text-xs font-mono-tech text-slate-400">{t("streak.subtitle")}</p>
          </div>
        </div>

        <div className="flex items-center gap-6 font-mono-tech text-xs border-t sm:border-t-0 sm:border-l border-slate-800 pt-4 sm:pt-0 sm:pl-6">
          <div>
            <span className="text-slate-400 block uppercase">Soroban Ledger</span>
            <span className="text-teal-400 font-bold">FUTURENET #9941</span>
          </div>
          <div>
            <span className="text-slate-400 block uppercase">SHA-256 Engine</span>
            <span className="text-emerald-400 font-bold">VERIFIED</span>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-elevated p-6 rounded-2xl border border-slate-800 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="text-xs font-mono-tech text-slate-400 block">{t("stats.verses_read")}</span>
          <div className="text-3xl font-extrabold text-white font-mono-tech">{readVersesCount}</div>
          <p className="text-[11px] font-mono-tech text-slate-500">{t("stats.verses_read_sub")}</p>
        </div>

        <div className="bg-elevated p-6 rounded-2xl border border-slate-800 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="text-xs font-mono-tech text-slate-400 block">{t("stats.hashes")}</span>
          <div className="text-3xl font-extrabold text-white font-mono-tech">100%</div>
          <p className="text-[11px] font-mono-tech text-slate-500">{t("stats.hashes_sub")}</p>
        </div>

        <div className="bg-elevated p-6 rounded-2xl border border-slate-800 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-teal-950 border border-teal-700/50 flex items-center justify-center text-teal-300">
            <Coins className="w-5 h-5" />
          </div>
          <span className="text-xs font-mono-tech text-slate-400 block">{t("stats.balance")}</span>
          <div className="text-3xl font-extrabold text-teal-400 font-mono-tech">{talBalance} TAL</div>
          <p className="text-[11px] font-mono-tech text-slate-500">{t("stats.balance_sub")}</p>
        </div>

        <div className="bg-elevated p-6 rounded-2xl border border-slate-800 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-teal-400">
            <Award className="w-5 h-5" />
          </div>
          <span className="text-xs font-mono-tech text-slate-400 block">{t("stats.books")}</span>
          <div className="text-3xl font-extrabold text-white font-mono-tech">{completedBooks.length}</div>
          <p className="text-[11px] font-mono-tech text-slate-500">{t("stats.books_sub")}</p>
        </div>
      </section>

      {/* Testament Reading Journey Track */}
      <ReadingJourney />

      {/* Numbered Sections (01, 02, 03) */}
      <section className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-elevated p-6 rounded-2xl border border-slate-800 space-y-3 hover:border-teal-500/40 transition-all">
            <span className="font-mono-tech font-extrabold text-xl text-accent block">
              {t("section.01")}
            </span>
            <h3 className="font-bold text-lg text-white">Autenticidade de Textos</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              O administrador registra os hashes SHA-256 dos versículos bíblicos. O contrato calcula o hash on-chain e garante a integridade textual original.
            </p>
          </div>

          <div className="bg-elevated p-6 rounded-2xl border border-slate-800 space-y-3 hover:border-teal-500/40 transition-all">
            <span className="font-mono-tech font-extrabold text-xl text-accent block">
              {t("section.02")}
            </span>
            <h3 className="font-bold text-lg text-white">Reflexões Comunitárias</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Escreva e armazene reflexões públicas ou privadas associadas aos versículos lidos. Interaja com a comunidade via curtidas e comentários.
            </p>
          </div>

          <div className="bg-elevated p-6 rounded-2xl border border-slate-800 space-y-3 hover:border-teal-500/40 transition-all">
            <span className="font-mono-tech font-extrabold text-xl text-accent block">
              {t("section.03")}
            </span>
            <h3 className="font-bold text-lg text-white">Recompensas em Tokens TAL</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ao atingir 100% de leitura de um livro, a função `reivindicar_recompensa_livro` emite um evento Soroban para acionar a distribuição de 100 TAL.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
