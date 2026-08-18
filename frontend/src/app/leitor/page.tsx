"use client";

import { useState } from "react";
import { useTranslation } from "@/context/LanguageContext";
import { BOOKS, MULTI_VERSION_VERSES, BIBLE_VERSIONS, VersaoBibliaKey } from "@/lib/stellar";
import { VerseCard } from "@/components/VerseCard";
import { BookOpen, Search, Filter, ShieldCheck, Layers, GitBranch } from "lucide-react";

export default function LeitorPage() {
  const { t } = useTranslation();
  const [selectedBookId, setSelectedBookId] = useState<number>(1);
  const [selectedChapter, setSelectedChapter] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVersion, setSelectedVersion] = useState<VersaoBibliaKey>("ARC");

  const selectedBook = BOOKS.find((b) => b.id === selectedBookId) || BOOKS[0];
  const activeVersionMeta = BIBLE_VERSIONS.find((v) => v.id === selectedVersion) || BIBLE_VERSIONS[0];

  // Fetch verses for selected version
  const currentVersesMap = MULTI_VERSION_VERSES[selectedVersion] || MULTI_VERSION_VERSES["ARC"];

  // Filter verses matching current book & chapter
  const verseList = Object.entries(currentVersesMap)
    .filter(([key]) => key.startsWith(`${selectedBookId}-${selectedChapter}-`))
    .map(([key, data]) => {
      const parts = key.split("-");
      return {
        bookId: Number(parts[0]),
        chapter: Number(parts[1]),
        verse: Number(parts[2]),
        text: data.text,
        hash: data.hash,
      };
    });

  const filteredVerses = verseList.filter((v) =>
    v.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-mono-tech font-semibold mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Múltiplas Versões & Merkle Tree On-Chain</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">{t("reader.title")}</h1>
          <p className="text-sm text-slate-400">
            {t("reader.subtitle")}
          </p>
        </div>

        {/* Global Version Selector */}
        <div className="glass-panel-teal p-3.5 rounded-2xl border border-teal-500/40 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500 text-slate-950 flex items-center justify-center font-bold">
            <GitBranch className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-mono-tech block uppercase">Versão Ativa</span>
            <select
              value={selectedVersion}
              onChange={(e) => setSelectedVersion(e.target.value as VersaoBibliaKey)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs font-mono-tech font-bold text-teal-400 focus:outline-none"
            >
              {BIBLE_VERSIONS.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Book & Chapter Selectors & Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-6 rounded-2xl bg-elevated border border-slate-800">
        {/* Book Selector */}
        <div className="md:col-span-4 space-y-1.5">
          <label className="text-xs font-mono-tech text-slate-400 block font-semibold">
            {t("reader.select_book")}
          </label>
          <select
            value={selectedBookId}
            onChange={(e) => {
              setSelectedBookId(Number(e.target.value));
              setSelectedChapter(1);
            }}
            className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-teal-500/60 font-mono-tech"
          >
            {BOOKS.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} ({b.testament === "AT" ? "AT" : "NT"})
              </option>
            ))}
          </select>
        </div>

        {/* Chapter Selector */}
        <div className="md:col-span-3 space-y-1.5">
          <label className="text-xs font-mono-tech text-slate-400 block font-semibold">
            {t("reader.select_chapter")}
          </label>
          <select
            value={selectedChapter}
            onChange={(e) => setSelectedChapter(Number(e.target.value))}
            className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-teal-500/60 font-mono-tech"
          >
            {Array.from({ length: Math.min(10, selectedBook.chapters) }, (_, i) => i + 1).map((ch) => (
              <option key={ch} value={ch}>
                Capítulo {ch}
              </option>
            ))}
          </select>
        </div>

        {/* Search Input */}
        <div className="md:col-span-5 space-y-1.5">
          <label className="text-xs font-mono-tech text-slate-400 block font-semibold">
            Filtrar Passagem
          </label>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("reader.search")}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-teal-500/60"
            />
          </div>
        </div>
      </div>

      {/* Verses Display Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>{selectedBook.name} {selectedChapter}</span>
            <span className="text-xs font-mono-tech font-normal text-slate-400">
              ({filteredVerses.length} versículos exibidos — Versão: {activeVersionMeta.id})
            </span>
          </h2>

          <span className="hidden sm:flex items-center gap-1.5 text-xs font-mono-tech text-teal-400 bg-teal-950/60 border border-teal-800/80 px-3 py-1 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{activeVersionMeta.copyright}</span>
          </span>
        </div>

        {filteredVerses.length > 0 ? (
          <div className="space-y-6">
            {filteredVerses.map((v) => (
              <VerseCard
                key={`${v.bookId}-${v.chapter}-${v.verse}`}
                bookId={v.bookId}
                bookName={selectedBook.name}
                chapter={v.chapter}
                verse={v.verse}
                text={v.text}
                hash={v.hash}
                selectedVersion={selectedVersion}
                onVersionChange={(ver) => setSelectedVersion(ver)}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-2xl bg-elevated border border-slate-800 space-y-3">
            <Filter className="w-8 h-8 text-slate-500 mx-auto" />
            <p className="text-slate-400 text-sm">
              Nenhum versículo encontrado para os filtros selecionados nesta versão ({selectedVersion}).
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
