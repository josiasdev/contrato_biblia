"use client";

import { useState } from "react";
import { formatAddress, formatTimestamp } from "@/lib/utils";
import { 
  Heart, 
  MessageSquare, 
  ShieldCheck, 
  Send, 
  Trash2, 
  UserCircle 
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
}: ReflectionCardProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(false);
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
    <div className="bg-elevated p-6 rounded-2xl border border-slate-800 hover:border-slate-700/80 transition-all">
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

      {/* Proof of Hash Integrity */}
      <div className="flex items-center gap-2 mb-4 p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 text-[11px] font-mono-tech text-slate-400">
        <ShieldCheck className="w-3.5 h-3.5 text-teal-400 shrink-0" />
        <span className="truncate">Hash SHA-256: {hash}</span>
      </div>

      {/* Footer Interactions */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
        <div className="flex items-center gap-4">
          <button
            onClick={handleToggleLike}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-mono-tech transition-all ${
              hasLiked
                ? "bg-red-950/60 border border-red-800/60 text-red-400"
                : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400"
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${hasLiked ? "fill-red-400 text-red-400" : ""}`} />
            <span>{likes}</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-teal-400 text-xs font-medium font-mono-tech transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{comments.length} Comentários</span>
          </button>
        </div>
      </div>

      {/* Comments Drawer */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-slate-800/60 space-y-3">
          {comments.map((c) => (
            <div key={c.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-mono-tech font-semibold text-teal-300">
                    {formatAddress(c.autor)}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono-tech">
                    {formatTimestamp(c.timestamp)}
                  </span>
                </div>
                <p className="text-xs text-slate-300">{c.conteudo}</p>
              </div>

              <button
                onClick={() => handleRemoveComment(c.id)}
                className="text-slate-600 hover:text-red-400 transition-colors p-1"
                title="Remover comentário"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          {/* New Comment Input */}
          <div className="flex gap-2 pt-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              maxLength={200}
              placeholder="Adicionar um comentário (máx 200 chars)..."
              className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-teal-500/50"
            />
            <button
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              className="px-3 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-xs disabled:opacity-40"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
