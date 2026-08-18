"use client";

import { useState } from "react";
import { formatAddress, formatTimestamp } from "@/lib/utils";
import { 
  Heart, 
  MessageSquare, 
  ShieldCheck, 
  Send, 
  Trash2, 
  UserCircle,
  Sparkles,
  Radio,
  ExternalLink,
  Award
} from "lucide-react";

interface ComentarioItem {
  id: string;
  autor: string;
  conteudo: string;
  timestamp: number;
}

interface ReflectionCardProps {
  id: string;
  author: string;
  verseRef: string;
  content: string;
  timestamp: number;
  hash: string;
  initialLikes: number;
  initialComments?: ComentarioItem[];
  isFeatured?: boolean;
  ipfsCid?: string;
}

export function ReflectionCard({
  id,
  author,
  verseRef,
  content,
  timestamp,
  hash,
  initialLikes,
  initialComments = [],
  isFeatured = false,
  ipfsCid,
}: ReflectionCardProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(false);
  const [featured, setFeatured] = useState(isFeatured);
  const [comments, setComments] = useState<ComentarioItem[]>(initialComments);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");

  const handleToggleLike = () => {
    if (hasLiked) {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
    } else {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
    }
  };

  const handleToggleFeature = () => {
    setFeatured(!featured);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const commentItem: ComentarioItem = {
      id: Math.random().toString(),
      autor: "GSEU_ENDERECO_DEMO_FUTURENET",
      conteudo: newComment,
      timestamp: Math.floor(Date.now() / 1000),
    };
    setComments((prev) => [...prev, commentItem]);
    setNewComment("");
  };

  const handleRemoveComment = (commentId: string) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  return (
    <div className={`p-6 rounded-2xl border transition-all ${
      featured 
        ? "glass-panel-teal border-amber-500/50 shadow-xl shadow-amber-500/10" 
        : "bg-elevated border-slate-800 hover:border-slate-700/80"
    }`}>
      {/* Featured Badge Header */}
      {featured && (
        <div className="mb-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/40 text-amber-400 text-xs font-mono-tech font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>INSIGHT TEOLÓGICO EM DESTAQUE (CURADORIA DA COMUNIDADE)</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-teal-600 to-emerald-400 p-0.5">
            <div className="w-full h-full bg-[#0f172a] rounded-full flex items-center justify-center">
              <UserCircle className="w-5 h-5 text-teal-400" />
            </div>
          </div>
          <div>
            <span className="font-mono-tech text-xs font-semibold text-slate-200 block">
              {formatAddress(author)}
            </span>
            <span className="text-[10px] text-slate-500 font-mono-tech">
              {formatTimestamp(timestamp)}
            </span>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 font-bold text-xs font-mono-tech">
          {verseRef}
        </span>
      </div>

      {/* Reflection Content */}
      <p className="text-slate-200 text-sm leading-relaxed mb-4 whitespace-pre-line">
        {content}
      </p>

      {/* IPFS Media Attachment Box if present */}
      {ipfsCid && (
        <div className="mb-4 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono-tech flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-teal-300 truncate">
            <Radio className="w-4 h-4 text-teal-400 shrink-0 animate-pulse" />
            <span className="truncate">Estudo Bíblico em Áudio/PDF (IPFS CID: {ipfsCid.slice(0, 16)}...)</span>
          </div>
          <a
            href={`https://ipfs.io/ipfs/${ipfsCid}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-teal-500/10 border border-teal-500/30 text-teal-400 hover:text-white text-[11px] font-bold shrink-0 transition-colors"
          >
            <span>Ouvir / Abrir</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}

      {/* Proof SHA-256 Badge */}
      <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 text-[10px] font-mono-tech text-slate-400 mb-4 break-all flex items-center gap-2">
        <ShieldCheck className="w-3.5 h-3.5 text-teal-400 shrink-0" />
        <span className="truncate">Soroban SHA-256: {hash}</span>
      </div>

      {/* Footer Actions (Like, Comment, Curate Highlight) */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs font-mono-tech text-slate-400">
        <div className="flex items-center gap-4">
          <button
            onClick={handleToggleLike}
            className={`flex items-center gap-1.5 transition-colors ${
              hasLiked ? "text-rose-500 font-bold" : "hover:text-rose-400"
            }`}
          >
            <Heart className={`w-4 h-4 ${hasLiked ? "fill-rose-500" : ""}`} />
            <span>{likes}</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5 hover:text-teal-400 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{comments.length} Comentários</span>
          </button>
        </div>

        <button
          onClick={handleToggleFeature}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border transition-all ${
            featured
              ? "bg-amber-500/20 text-amber-300 border-amber-500/50"
              : "bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-amber-400"
          }`}
          title="Curadoria Comunitária (Requer Certificado Bíblico)"
        >
          <Award className="w-3.5 h-3.5" />
          <span>{featured ? "Destacado" : "Promover Insight"}</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-4">
          <div className="space-y-3">
            {comments.map((c) => (
              <div
                key={c.id}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs flex items-start justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono-tech text-teal-400 font-semibold">
                      {formatAddress(c.autor)}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono-tech">
                      {formatTimestamp(c.timestamp)}
                    </span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{c.conteudo}</p>
                </div>

                <button
                  onClick={() => handleRemoveComment(c.id)}
                  className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                  title="Remover comentário"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Comment Input */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escreva um comentário público..."
              maxLength={200}
              className="flex-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-teal-500/60"
            />
            <button
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              className="p-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 disabled:opacity-40 shadow-md shadow-teal-500/20 active:scale-95 transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
