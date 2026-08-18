"use client";

import { useWallet } from "@/context/WalletContext";
import { useTranslation } from "@/context/LanguageContext";
import { BOOKS } from "@/lib/stellar";
import { BookOpen, CheckCircle, Sparkles } from "lucide-react";

export function ReadingJourney() {
  const { readVerses, completedBooks } = useWallet();
  const { t } = useTranslation();

  const atBooks = BOOKS.filter((b) => b.testament === "AT");
  const ntBooks = BOOKS.filter((b) => b.testament === "NT");

  const getBookStatus = (bookId: number) => {
    if (completedBooks.includes(bookId)) return "completed"; // Filled teal
    const hasReadVerse = Array.from(readVerses).some((v) => v.startsWith(`${bookId}-`));
    if (hasReadVerse) return "in_progress"; // Bordered teal
    return "unread"; // Muted slate
  };

  return (
    <div className="bg-elevated p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            {t("journey.title")}
          </h2>
          <p className="text-xs text-slate-400 font-mono-tech mt-1">
            {t("journey.subtitle")}
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-[11px] font-mono-tech text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
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

      {/* Antigo Testamento Track */}
      <div className="space-y-3">
        <span className="text-xs font-mono-tech uppercase tracking-wider text-teal-400 font-semibold block">
          {t("journey.at")}
        </span>
        <div className="flex items-center gap-3 overflow-x-auto pb-3 scrollbar-none">
          {atBooks.map((book) => {
            const status = getBookStatus(book.id);
            return (
              <div key={book.id} className="flex items-center gap-3 shrink-0">
                <div className="flex flex-col items-center gap-1.5 group">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono-tech text-xs font-bold transition-all ${
                      status === "completed"
                        ? "bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20"
                        : status === "in_progress"
                        ? "border-2 border-teal-400 bg-teal-950/40 text-teal-300"
                        : "bg-slate-900 text-slate-500 border border-slate-800"
                    }`}
                  >
                    {status === "completed" ? (
                      <CheckCircle className="w-5 h-5 text-slate-950" />
                    ) : (
                      <span>{book.name.slice(0, 3)}</span>
                    )}
                  </div>
                  <span className="text-[11px] font-mono-tech text-slate-400 group-hover:text-slate-200">
                    {book.name}
                  </span>
                </div>
                <div className="w-6 h-0.5 bg-slate-800" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Novo Testamento Track */}
      <div className="space-y-3 pt-2">
        <span className="text-xs font-mono-tech uppercase tracking-wider text-teal-400 font-semibold block">
          {t("journey.nt")}
        </span>
        <div className="flex items-center gap-3 overflow-x-auto pb-3 scrollbar-none">
          {ntBooks.map((book) => {
            const status = getBookStatus(book.id);
            return (
              <div key={book.id} className="flex items-center gap-3 shrink-0">
                <div className="flex flex-col items-center gap-1.5 group">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono-tech text-xs font-bold transition-all ${
                      status === "completed"
                        ? "bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20"
                        : status === "in_progress"
                        ? "border-2 border-teal-400 bg-teal-950/40 text-teal-300"
                        : "bg-slate-900 text-slate-500 border border-slate-800"
                    }`}
                  >
                    {status === "completed" ? (
                      <CheckCircle className="w-5 h-5 text-slate-950" />
                    ) : (
                      <span>{book.name.slice(0, 3)}</span>
                    )}
                  </div>
                  <span className="text-[11px] font-mono-tech text-slate-400 group-hover:text-slate-200">
                    {book.name}
                  </span>
                </div>
                <div className="w-6 h-0.5 bg-slate-800" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
