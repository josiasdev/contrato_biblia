"use client";

import { useWallet } from "@/context/WalletContext";
import { useTranslation } from "@/context/LanguageContext";
import { BOOKS } from "@/lib/stellar";
import { RewardClaimCard } from "@/components/RewardClaimCard";
import { Coins, Award, AlertCircle } from "lucide-react";

export default function RecompensasPage() {
  const { isConnected, connectWallet, talBalance, readVersesCount, completedBooks } = useWallet();
  const { t } = useTranslation();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-mono-tech font-semibold mb-2">
            <Coins className="w-3.5 h-3.5" />
            <span>Sistema de Gamificação Soroban</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">{t("rewards.title")}</h1>
          <p className="text-sm text-slate-400">
            {t("rewards.subtitle")}
          </p>
        </div>

        {/* Balance Card */}
        <div className="glass-panel-teal px-6 py-4 rounded-2xl border border-teal-500/40 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-500 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-teal-500/30">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-mono-tech font-medium block">{t("rewards.your_balance")}</span>
            <span className="text-2xl font-extrabold text-white font-mono-tech">{talBalance} TAL</span>
          </div>
        </div>
      </div>

      {!isConnected && (
        <div className="p-4 rounded-2xl bg-teal-950/40 border border-teal-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-teal-400 shrink-0" />
            <p className="text-xs text-teal-200 font-mono-tech">
              Conecte sua carteira Stellar (Freighter) para visualizar suas recompensas e emitir transações de resgate.
            </p>
          </div>
          <button
            onClick={connectWallet}
            className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shrink-0 font-mono-tech"
          >
            {t("wallet.connect")}
          </button>
        </div>
      )}

      {/* Book Rewards Cards */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-teal-400" />
          <span>Metas de Leitura por Livro</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {BOOKS.map((book) => {
            let verseProgress = 0;
            if (book.id === 1) verseProgress = Math.min(book.verses, readVersesCount * 500 || 1533);
            if (completedBooks.includes(book.id)) verseProgress = book.verses;

            return (
              <RewardClaimCard
                key={book.id}
                bookId={book.id}
                bookName={book.name}
                totalVerses={book.verses}
                readVersesCount={verseProgress}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
