"use client";

import { useState } from "react";
import { useWallet } from "@/context/WalletContext";
import { useTranslation } from "@/context/LanguageContext";
import { 
  Coins, 
  CheckCircle2, 
  Sparkles, 
  BookOpen, 
  FileText,
  ShieldCheck
} from "lucide-react";

interface RewardClaimCardProps {
  bookId: number;
  bookName: string;
  totalVerses: number;
  readVersesCount: number;
}

export function RewardClaimCard({
  bookId,
  bookName,
  totalVerses,
  readVersesCount,
}: RewardClaimCardProps) {
  const { isConnected, claimBookReward, claimedRewards } = useWallet();
  const { t } = useTranslation();
  const [isClaiming, setIsClaiming] = useState(false);

  const percentage = Math.min(
    100,
    Math.round((readVersesCount / totalVerses) * 100)
  );
  const isCompleted = percentage >= 100;
  const isAlreadyClaimed = claimedRewards.has(bookId);

  const handleClaim = async () => {
    if (!isConnected || isAlreadyClaimed || isClaiming) return;
    setIsClaiming(true);
    await claimBookReward(bookId);
    setIsClaiming(false);
  };

  // SVG Progress Ring calculations
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div
      className={`p-6 rounded-2xl border transition-all ${
        isAlreadyClaimed
          ? "bg-elevated border-dashed border-emerald-500/60"
          : isCompleted
          ? "glass-panel-teal border-dashed border-teal-400 teal-glow"
          : "bg-elevated border-dashed border-slate-700 hover:border-slate-600"
      }`}
    >
      {/* Receipt Header */}
      <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-dashed border-slate-800">
        <div className="flex items-center gap-2 text-xs font-mono-tech text-teal-400 font-semibold uppercase tracking-wider">
          <FileText className="w-4 h-4 text-teal-400" />
          <span>{t("rewards.receipt_title")}</span>
        </div>

        <span className="text-[10px] font-mono-tech text-slate-500">
          EVENT: RecompensaReivindicada
        </span>
      </div>

      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          {/* SVG Progress Ring */}
          <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="28"
                cy="28"
                r={radius}
                className="stroke-slate-800"
                strokeWidth="4"
                fill="transparent"
              />
              <circle
                cx="28"
                cy="28"
                r={radius}
                className={`transition-all duration-700 ease-out ${
                  isAlreadyClaimed
                    ? "stroke-emerald-400"
                    : isCompleted
                    ? "stroke-teal-400"
                    : "stroke-teal-600"
                }`}
                strokeWidth="4"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <span className="absolute font-mono-tech font-bold text-xs text-white">
              {percentage}%
            </span>
          </div>

          <div>
            <h3 className="font-bold text-slate-100 text-base">{bookName}</h3>
            <p className="text-xs font-mono-tech text-slate-400">
              {readVersesCount} / {totalVerses} versículos
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[11px] font-mono-tech uppercase text-slate-500 block">LIVRO #{bookId}</span>
          <span className="text-xs font-mono-tech text-teal-300 font-bold">100 TAL</span>
        </div>
      </div>

      {/* Technical Receipt Details */}
      <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 font-mono-tech text-[11px] space-y-1 mb-4">
        <div className="flex justify-between text-slate-400">
          <span>TX TYPE:</span>
          <span className="text-slate-200">CLAIM_BOOK_REWARD</span>
        </div>
        <div className="flex justify-between text-slate-400">
          <span>REWARD VALUE:</span>
          <span className="text-teal-400 font-bold">100.0000000 TAL</span>
        </div>
        <div className="flex justify-between text-slate-400">
          <span>SOROBAN STATUS:</span>
          <span className={isAlreadyClaimed ? "text-emerald-400 font-bold" : isCompleted ? "text-teal-400" : "text-slate-500"}>
            {isAlreadyClaimed ? "VERIFIED & CLAIMED" : isCompleted ? "READY_TO_CLAIM" : "IN_PROGRESS"}
          </span>
        </div>
      </div>

      {/* Footer Claim Action */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-1.5 text-xs font-mono-tech text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
          <span>Soroban Persistent Storage</span>
        </div>

        {isAlreadyClaimed ? (
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-700/60 text-emerald-400 text-xs font-mono-tech font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {t("rewards.claimed")}
          </span>
        ) : (
          <button
            onClick={handleClaim}
            disabled={!isCompleted || !isConnected || isClaiming}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono-tech font-semibold transition-all ${
              isCompleted && isConnected
                ? "bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-lg shadow-teal-500/20 active:scale-95"
                : "bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {isClaiming
                ? "Emitindo Evento..."
                : isCompleted
                ? t("rewards.claim_button")
                : t("rewards.must_complete")}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
