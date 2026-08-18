"use client";

import { useState } from "react";
import { useWallet } from "@/context/WalletContext";
import { useTranslation } from "@/context/LanguageContext";
import { CertificadoItem, TipoCertificadoKey, getExplorerAccountUrl } from "@/lib/stellar";
import { generateCertificatePDF } from "@/lib/pdf";
import { formatAddress, formatTimestamp } from "@/lib/utils";
import { 
  Award, 
  BadgeCheck, 
  Lock, 
  Copy, 
  Check, 
  FileDown, 
  ExternalLink,
  Sparkles
} from "lucide-react";

interface CertificateCardProps {
  title: string;
  subtitle?: string;
  tipo: TipoCertificadoKey;
  isUnlocked: boolean;
  issuedCert?: CertificadoItem;
  progressPercentage?: number;
  progressText?: string;
  isFeatured?: boolean;
}

export function CertificateCard({
  title,
  subtitle,
  tipo,
  isUnlocked,
  issuedCert,
  progressPercentage = 0,
  progressText,
  isFeatured = false,
}: CertificateCardProps) {
  const { isConnected, emitCertificate } = useWallet();
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [isIssuing, setIsIssuing] = useState(false);

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEmit = async () => {
    if (!isConnected || isIssuing || issuedCert) return;
    setIsIssuing(true);
    await emitCertificate(tipo);
    setIsIssuing(false);
  };

  const handleDownloadPDF = () => {
    if (issuedCert) {
      generateCertificatePDF(issuedCert, title);
    }
  };

  return (
    <div
      className={`p-6 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between ${
        isFeatured
          ? "col-span-1 md:col-span-2 lg:col-span-3 glass-panel-teal border-teal-500/50 teal-glow"
          : isUnlocked
          ? "bg-elevated border-slate-700 hover:border-teal-500/40"
          : "bg-elevated/50 border-slate-800/80 opacity-75 hover:opacity-100"
      }`}
    >
      {/* Top Banner & Badge */}
      <div>
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                isUnlocked
                  ? "bg-teal-950/80 border border-teal-500/40 text-teal-400 shadow-md shadow-teal-500/10"
                  : "bg-slate-900 border border-slate-800 text-slate-500"
              }`}
            >
              {isUnlocked ? (
                <BadgeCheck className="w-6 h-6 text-teal-400" />
              ) : (
                <Lock className="w-5 h-5 text-slate-500" />
              )}
            </div>
            <div>
              <span className="text-[10px] font-mono-tech uppercase tracking-wider text-slate-400 block">
                {isFeatured ? "CREDANCIAL MÁXIMA ON-CHAIN" : "CERTIFICADO ON-CHAIN"}
              </span>
              <h3 className="font-bold text-slate-100 text-base">{title}</h3>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-[10px] font-mono-tech font-bold uppercase tracking-wider text-slate-400">
            {t("certificates.soulbound")}
          </span>
        </div>

        {subtitle && (
          <p className="text-xs text-slate-400 leading-relaxed mb-4">{subtitle}</p>
        )}

        {/* Progress Bar for Locked State */}
        {!issuedCert && (
          <div className="space-y-2 mb-4">
            <div className="flex justify-between items-center text-[11px] font-mono-tech text-slate-400">
              <span>{progressText || `${progressPercentage}% concluído`}</span>
              <span>{progressPercentage}%</span>
            </div>
            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-teal-600 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Unlocked Details (Hash SHA-256 + Date + Action Buttons) */}
      {issuedCert ? (
        <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-3">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 font-mono-tech text-[11px] space-y-1.5">
            <div className="flex items-center justify-between text-slate-400">
              <span>EMISSÃO ON-CHAIN:</span>
              <span className="text-slate-200">{formatTimestamp(issuedCert.timestamp)}</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>LEITOR:</span>
              <span className="text-teal-300 font-semibold">{formatAddress(issuedCert.leitor)}</span>
            </div>
            <div className="flex items-center justify-between gap-2 text-slate-400 pt-1 border-t border-slate-900">
              <span className="shrink-0">HASH SHA-256:</span>
              <div className="flex items-center gap-1 overflow-hidden">
                <span className="text-teal-400 font-bold truncate">
                  {issuedCert.hash_certificado.slice(0, 16)}...
                </span>
                <button
                  onClick={() => handleCopyHash(issuedCert.hash_certificado)}
                  className="p-1 text-slate-400 hover:text-white transition-colors"
                  title="Copiar Hash SHA-256"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-mono-tech font-semibold transition-all active:scale-95"
              title="Baixar Certificado em PDF"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Baixar PDF</span>
            </button>

            <a
              href={getExplorerAccountUrl(issuedCert.leitor)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs font-mono-tech text-slate-400 hover:text-teal-400 transition-colors"
            >
              <span>Ver no Ledger</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      ) : (
        /* Action Button when Complete */
        <div className="pt-2">
          <button
            onClick={handleEmit}
            disabled={!isUnlocked || !isConnected || isIssuing}
            className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-mono-tech font-semibold transition-all ${
              isUnlocked && isConnected
                ? "bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-lg shadow-teal-500/20 active:scale-95"
                : "bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>
              {isIssuing
                ? "Emitindo no Soroban..."
                : isUnlocked
                ? t("certificates.claim")
                : t("certificates.must_complete")}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
