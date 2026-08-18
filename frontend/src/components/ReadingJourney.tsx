"use client";

import Link from "next/link";
import { useWallet } from "@/context/WalletContext";
import { useTranslation } from "@/context/LanguageContext";
import { BOOKS, CATEGORIES } from "@/lib/stellar";
import { BookOpen, CheckCircle, Sparkles } from "lucide-react";

export function ReadingJourney() {
  const { readVerses, completedBooks } = useWallet();
  const { t } = useTranslation();

  const atBooks = BOOKS.filter((b) => b.testament === "AT");
  const ntBooks = BOOKS.filter((b) => b.testament === "NT");

  const getBookStatus = (bookId: number) => {
    if (completedBooks.includes(bookId)) return "completed";
    const hasReadVerse = Array.from(readVerses).some((v) => v.startsWith(`${bookId}-`));
    if (hasReadVerse) return "in_progress";
    return "unread";
  };

  return (
    <div className="bg-elevated p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-400" />
            {t("journey.title")} (Todos os 66 Livros Canônicos)
          </h2>
          <p className="text-xs text-slate-400 font-mono-tech mt-1">
            {t("journey.subtitle")} — Antigo Testamento (39 livros) & Novo Testamento (27 livros)
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-[11px] font-mono-tech text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
            <span>Concluído</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full border-2 border-teal-400 bg-transparent" />
            <span>Em progresso</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
            <span>Não iniciado</span>
          </div>
        </div>
      </div>

      {/* Antigo Testamento Grid (39 Livros) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono-tech uppercase tracking-wider text-teal-400 font-bold block">
            {t("journey.at")} — 39 Livros
          </span>
          <span className="text-[11px] font-mono-tech text-slate-400">
            Pentateuco • Históricos • Poéticos • Profetas
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-9 lg:grid-cols-13 gap-3">
          {atBooks.map((book) => {
            const status = getBookStatus(book.id);
            return (
              <Link
                key={book.id}
                href={`/leitor?livro=${book.id}`}
                className="flex flex-col items-center gap-1.5 group"
                title={`${book.name} (${book.chapters} capítulos, ${book.verses} versículos)`}
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center font-mono-tech text-xs font-bold transition-all group-hover:scale-105 ${
                    status === "completed"
                      ? "bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20"
                      : status === "in_progress"
                      ? "border-2 border-teal-400 bg-teal-950/40 text-teal-300"
                      : "bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-slate-200"
                  }`}
                >
                  {status === "completed" ? (
                    <CheckCircle className="w-5 h-5 text-slate-950" />
                  ) : (
                    <span>{book.name.slice(0, 3)}</span>
                  )}
                </div>
                <span className="text-[10px] font-mono-tech text-slate-400 group-hover:text-teal-300 truncate max-w-[50px] text-center">
                  {book.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Novo Testamento Grid (27 Livros) */}
      <div className="space-y-4 pt-4 border-t border-slate-800/80">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono-tech uppercase tracking-wider text-teal-400 font-bold block">
            {t("journey.nt")} — 27 Livros
          </span>
          <span className="text-[11px] font-mono-tech text-slate-400">
            Evangelhos • Atos • Epístolas • Apocalipse
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-9 lg:grid-cols-13 gap-3">
          {ntBooks.map((book) => {
            const status = getBookStatus(book.id);
            return (
              <Link
                key={book.id}
                href={`/leitor?livro=${book.id}`}
                className="flex flex-col items-center gap-1.5 group"
                title={`${book.name} (${book.chapters} capítulos, ${book.verses} versículos)`}
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center font-mono-tech text-xs font-bold transition-all group-hover:scale-105 ${
                    status === "completed"
                      ? "bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20"
                      : status === "in_progress"
                      ? "border-2 border-teal-400 bg-teal-950/40 text-teal-300"
                      : "bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-slate-200"
                  }`}
                >
                  {status === "completed" ? (
                    <CheckCircle className="w-5 h-5 text-slate-950" />
                  ) : (
                    <span>{book.name.slice(0, 3)}</span>
                  )}
                </div>
                <span className="text-[10px] font-mono-tech text-slate-400 group-hover:text-teal-300 truncate max-w-[50px] text-center">
                  {book.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
