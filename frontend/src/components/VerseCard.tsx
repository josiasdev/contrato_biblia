"use client";

import { useState } from "react";
import { useWallet } from "@/context/WalletContext";
import { useTranslation } from "@/context/LanguageContext";
import { BIBLE_VERSIONS, VersaoBibliaKey } from "@/lib/stellar";
import { 
  CheckCircle, 
  ShieldCheck, 
  MessageSquare, 
  Sparkles,
  Lock,
  Globe,
  X,
  GitBranch,
  Radio
} from "lucide-react";

interface VerseCardProps {
  bookId: number;
  bookName: string;
  chapter: number;
  verse: number;
  text: string;
  hash: string;
  selectedVersion?: VersaoBibliaKey;
  onVersionChange?: (version: VersaoBibliaKey) => void;
  onAddReflection?: (conteudo: string, publica: boolean, ipfsHash?: string) => void;
}

export function VerseCard({
  bookId,
  bookName,
  chapter,
  verse,
  text,
  hash,
  selectedVersion = "ARC",
  onVersionChange,
  onAddReflection,
}: VerseCardProps) {
  const { isConnected, readVerses, markVerseAsRead } = useWallet();
  const { t } = useTranslation();
  const verseKey = `${bookId}-${chapter}-${verse}`;
  const isRead = readVerses.has(verseKey);

  const [isMarking, setIsMarking] = useState(false);
  const [showReflectionModal, setShowReflectionModal] = useState(false);
  const [reflectionText, setReflectionText] = useState("");
  const [ipfsCid, setIpfsCid] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [showHash, setShowHash] = useState(false);

  const activeVersionMeta = BIBLE_VERSIONS.find((v) => v.id === selectedVersion) || BIBLE_VERSIONS[0];

  const handleMarkRead = async () => {
    setIsMarking(true);
    await markVerseAsRead(bookId, chapter, verse);
    setIsMarking(false);
  };

  const handleSaveReflection = () => {
    if (!reflectionText.trim()) return;
    if (onAddReflection) {
      onAddReflection(reflectionText, isPublic, ipfsCid.trim() || undefined);
    }
    setReflectionText("");
    setIpfsCid("");
    setShowReflectionModal(false);
  };

  return (
    <div className={`p-6 rounded-2xl transition-all duration-300 ${
      isRead 
        ? "glass-panel-teal border-teal-500/40 teal-glow" 
        : "bg-elevated border-slate-800 hover:border-slate-700"
    }`}>
      {/* Verse Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 font-bold text-xs font-mono-tech">
            {bookName} {chapter}:{verse}
          </span>

          {/* Version Selector Pill */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-0.5 rounded-lg text-xs font-mono-tech">
            <span className="text-[10px] text-slate-500 px-1 font-bold">VERSÃO:</span>
            {BIBLE_VERSIONS.map((v) => (
              <button
                key={v.id}
                onClick={() => onVersionChange && onVersionChange(v.id)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all ${
                  selectedVersion === v.id
                    ? "bg-teal-500 text-slate-950 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
                title={v.name}
              >
                {v.id}
              </button>
            ))}
          </div>

          {isRead && (
            <span className="flex items-center gap-1 text-[11px] font-mono-tech font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-md">
              <CheckCircle className="w-3 h-3" />
              {t("reader.read_confirm")}
            </span>
          )}
        </div>

        <button
          onClick={() => setShowHash(!showHash)}
          className="flex items-center gap-1 text-slate-400 hover:text-teal-400 text-xs font-mono-tech transition-colors"
          title="Verificar Merkle Root & Proof SHA-256 On-Chain"
        >
          <GitBranch className="w-3.5 h-3.5 text-teal-400" />
          <span>{showHash ? "Ocultar Prova" : "Merkle Proof SHA-256"}</span>
        </button>
      </div>

      {/* Merkle Root & SHA-256 Proof Drawer */}
      {showHash && (
        <div className="mb-4 p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono-tech text-slate-300 space-y-2">
          <div className="flex items-center justify-between text-teal-400 font-bold border-b border-slate-900 pb-1">
            <span>VERSÃO SELECIONADA: {activeVersionMeta.name}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800">
              {activeVersionMeta.copyright}
            </span>
          </div>

          <div className="break-all">
            <span className="text-slate-400 font-semibold block">MERKLE ROOT ON-CHAIN (SOROBAN STORAGE):</span>
            <span className="text-amber-400 font-mono-tech">{activeVersionMeta.merkleRoot}</span>
          </div>

          <div className="break-all pt-1 border-t border-slate-900">
            <span className="text-slate-400 font-semibold block">HASH SHA-256 DO VERSÍCULO:</span>
            <span className="text-teal-300">{hash}</span>
          </div>
        </div>
      )}

      {/* Verse Text */}
      <p className="text-lg text-slate-100 font-serif leading-relaxed italic mb-6">
        "{text}"
      </p>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800/80">
        <div className="flex items-center gap-2">
          <button
            onClick={handleMarkRead}
            disabled={isRead || isMarking}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold font-mono-tech transition-all ${
              isRead
                ? "bg-emerald-950/80 text-emerald-300 border border-emerald-700/50 cursor-default"
                : "bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-md shadow-teal-500/20 active:scale-95"
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>{isRead ? t("reader.read_confirm") : isMarking ? "Gravando..." : t("reader.mark_read")}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowReflectionModal(true)}
            disabled={!isRead}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
              isRead
                ? "bg-slate-900 hover:bg-slate-800 border-slate-700 text-teal-300 hover:border-teal-500/40"
                : "bg-slate-900/50 border-slate-800 text-slate-500 cursor-not-allowed"
            }`}
            title={!isRead ? "Requer Prova de Leitura anterior" : "Escrever reflexão com mídia IPFS"}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{t("reader.write_reflection")}</span>
          </button>
        </div>
      </div>

      {/* Reflection Modal */}
      {showReflectionModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setShowReflectionModal(false)}
        >
          <div 
            className="w-full max-w-lg bg-elevated p-6 rounded-2xl border border-slate-700 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal-400" />
                Refletir sobre {bookName} {chapter}:{verse} ({selectedVersion})
              </h3>
              <button
                type="button"
                onClick={() => setShowReflectionModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-4 font-mono-tech">
              Sua reflexão será armazenada no Soroban Storage. {isPublic ? "Publicação exige 1 TAL de trava anti-spam (reembolsável se destacada)." : ""}
            </p>

            <textarea
              value={reflectionText}
              onChange={(e) => setReflectionText(e.target.value)}
              maxLength={500}
              rows={4}
              placeholder="Escreva seus pensamentos ou insights espirituais sobre este versículo..."
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-teal-500/60 mb-3"
            />

            {/* IPFS Hash CID optional field */}
            <div className="mb-4 space-y-1">
              <label className="text-xs font-mono-tech text-slate-400 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-teal-400" />
                <span>Link IPFS / Arweave de Áudio ou PDF de Estudo (Opcional):</span>
              </label>
              <input
                type="text"
                value={ipfsCid}
                onChange={(e) => setIpfsCid(e.target.value)}
                placeholder="Ex: QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono-tech text-teal-300 focus:outline-none focus:border-teal-500/60"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 mb-6">
              <span className="font-mono-tech">{reflectionText.length}/500 caracteres</span>
              <button
                type="button"
                onClick={() => setIsPublic(!isPublic)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-teal-300"
              >
                {isPublic ? <Globe className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                <span>{isPublic ? "Pública (Comunidade - 1 TAL Stake)" : "Privada (Apenas para mim)"}</span>
              </button>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowReflectionModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveReflection}
                disabled={!reflectionText.trim()}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-lg shadow-teal-500/20 disabled:opacity-40"
              >
                Gravar no Contrato
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
