"use client";

import { useState } from "react";
import { useTranslation } from "@/context/LanguageContext";
import { BOOKS } from "@/lib/stellar";
import { VerseCard } from "@/components/VerseCard";
import { BookOpen, Search, ShieldCheck } from "lucide-react";

export default function LeitorPage() {
  const { t } = useTranslation();
  const [selectedBookId, setSelectedBookId] = useState<number>(1);
  const [selectedChapter, setSelectedChapter] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState("");

  const currentBook = BOOKS.find((b) => b.id === selectedBookId) || BOOKS[0];

  const getVersesForChapter = () => {
    return [
      {
        verse: 1,
        text: "No princípio criou Deus o céu e a terra.",
        hash: "f2e9a224a50ee5118533e4544253966a348003183a69620596323145f15a201b",
      },
      {
        verse: 2,
        text: "E a terra era sem forma e vazia; e havia trevas sobre a face do abismo; e o Espírito de Deus se movia sobre a face das águas.",
        hash: "a4c28f0909e75525b6826d7cf5a9163e778a876a349b109e9921b790d0b00511",
      },
      {
        verse: 3,
        text: "E disse Deus: Haja luz; e houve luz.",
        hash: "c7964b46e336d3c01c05d76d491563f91040f7b0559798031c26f04128f115a3",
      },
      {
        verse: 4,
        text: "E viu Deus que era boa a luz; e fez Deus separação entre a luz e as trevas.",
        hash: "7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
      },
      {
        verse: 5,
        text: "E Deus chamou à luz Dia; e às trevas chamou Noite. E foi a tarde e a manhã, o dia primeiro.",
        hash: "82a84f4b963c4e1358b68832a846175e119426f8d388902506e78cf9f2d655f4",
      },
    ];
  };

  const verses = getVersesForChapter().filter((v) =>
    v.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-mono-tech font-semibold mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Leitor Bíblico Soroban</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">{t("reader.title")}</h1>
          <p className="text-sm text-slate-400">
            {t("reader.subtitle")}
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t("reader.search")}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono-tech text-slate-100 focus:outline-none focus:border-teal-500/50"
          />
        </div>
      </div>

      {/* Book and Chapter Selectors */}
      <div className="bg-elevated p-4 sm:p-6 rounded-2xl border border-slate-800 space-y-4">
        {/* Book Tabs */}
        <div>
          <label className="text-xs font-mono-tech font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            {t("reader.select_book")}
          </label>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {BOOKS.map((book) => (
              <button
                key={book.id}
                onClick={() => {
                  setSelectedBookId(book.id);
                  setSelectedChapter(1);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-mono-tech font-semibold shrink-0 transition-all ${
                  selectedBookId === book.id
                    ? "bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20"
                    : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                {book.name} ({book.testament})
              </button>
            ))}
          </div>
        </div>

        {/* Chapter Selector */}
        <div>
          <label className="text-xs font-mono-tech font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            {t("reader.select_chapter")} ({currentBook.chapters} capítulos)
          </label>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
            {Array.from({ length: Math.min(20, currentBook.chapters) }, (_, i) => i + 1).map((ch) => (
              <button
                key={ch}
                onClick={() => setSelectedChapter(ch)}
                className={`w-9 h-9 rounded-xl text-xs font-mono-tech font-bold shrink-0 transition-all ${
                  selectedChapter === ch
                    ? "bg-teal-600 text-white border border-teal-400"
                    : "bg-slate-950 text-slate-400 hover:bg-slate-800 border border-slate-800"
                }`}
              >
                {ch}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Verses List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 font-mono-tech">
            <span>{currentBook.name} {selectedChapter}</span>
            <span className="text-xs font-normal text-slate-400">
              ({verses.length} versículos)
            </span>
          </h2>

          <div className="flex items-center gap-2 text-xs font-mono-tech text-teal-400 font-semibold bg-teal-950/60 border border-teal-800/60 px-3 py-1 rounded-lg">
            <ShieldCheck className="w-4 h-4" />
            <span>{t("reader.sha_verified")}</span>
          </div>
        </div>

        <div className="space-y-4">
          {verses.map((v) => (
            <VerseCard
              key={`${selectedBookId}-${selectedChapter}-${v.verse}`}
              bookId={selectedBookId}
              bookName={currentBook.name}
              chapter={selectedChapter}
              verse={v.verse}
              text={v.text}
              hash={v.hash}
              onAddReflection={(conteudo, publica) => {
                alert(`Reflexão gravada para ${currentBook.name} ${selectedChapter}:${v.verse}`);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
