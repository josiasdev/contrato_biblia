"use client";

import { useWallet } from "@/context/WalletContext";
import { useTranslation } from "@/context/LanguageContext";
import { formatAddress, formatTimestamp } from "@/lib/utils";
import { 
  BadgeCheck, 
  Sparkles, 
  X, 
  Share2, 
  Copy, 
  Check, 
  ShieldCheck 
} from "lucide-react";
import { useState } from "react";

export function CertificateModal() {
  const { newlyIssuedCert, clearNewlyIssuedCert } = useWallet();
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  if (!newlyIssuedCert) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(newlyIssuedCert.hash_certificado);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
      onClick={clearNewlyIssuedCert}
    >
      <div 
        className="w-full max-w-lg glass-panel-teal p-8 rounded-3xl border border-teal-500/50 shadow-2xl relative space-y-6 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={clearNewlyIssuedCert}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Celebration Header */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-20 h-20 rounded-full bg-teal-500/20 border-2 border-teal-400 flex items-center justify-center text-teal-400 shadow-xl shadow-teal-500/30 animate-pulse">
            <BadgeCheck className="w-12 h-12" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-mono-tech uppercase font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>NOVO CERTIFICADO EMITIDO ON-CHAIN</span>
          </div>

          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Parabéns pela Conquista!
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Sua credencial Soulbound foi registrada de forma permanente e imutável no Soroban Persistent Storage.
          </p>
        </div>

        {/* Receipt Details Box */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left font-mono-tech text-xs space-y-2">
          <div className="flex justify-between text-slate-400">
            <span>LEITOR:</span>
            <span className="text-teal-300 font-bold">{formatAddress(newlyIssuedCert.leitor)}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>EMISSÃO:</span>
            <span className="text-slate-200">{formatTimestamp(newlyIssuedCert.timestamp)}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>TIPO:</span>
            <span className="text-amber-400 font-bold">SOULBOUND CREDENTIAL</span>
          </div>
          <div className="pt-2 border-t border-slate-900 space-y-1">
            <span className="text-slate-400 block text-[11px]">HASH SHA-256 DO CERTIFICADO:</span>
            <div className="flex items-center justify-between gap-2 p-2 rounded bg-slate-900 border border-slate-800 text-[11px] text-teal-400 break-all">
              <span className="truncate">{newlyIssuedCert.hash_certificado}</span>
              <button
                onClick={handleCopy}
                className="p-1 text-slate-400 hover:text-white shrink-0"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={clearNewlyIssuedCert}
            className="w-full py-3 px-6 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs font-mono-tech shadow-lg shadow-teal-500/20 active:scale-95 transition-all"
          >
            Concluir & Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
