"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "@/context/LanguageContext";
import { BOOKS, MULTI_VERSION_VERSES, BIBLE_VERSIONS, VersaoBibliaKey } from "@/lib/stellar";
import { VerseCard } from "@/components/VerseCard";
import { simpleSha256 } from "@/lib/utils";
import { BookOpen, Search, Filter, ShieldCheck, Layers, GitBranch, Sparkles } from "lucide-react";

function LeitorContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const initialBookParam = searchParams.get("livro");

  const [selectedBookId, setSelectedBookId] = useState<number>(
    initialBookParam ? Number(initialBookParam) : 1
  );
  const [selectedChapter, setSelectedChapter] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVersion, setSelectedVersion] = useState<VersaoBibliaKey>("ARC");

  const selectedBook = BOOKS.find((b) => b.id === selectedBookId) || BOOKS[0];
  const activeVersionMeta = BIBLE_VERSIONS.find((v) => v.id === selectedVersion) || BIBLE_VERSIONS[0];

  const currentVersesMap = MULTI_VERSION_VERSES[selectedVersion] || MULTI_VERSION_VERSES["ARC"];

  const verseList = useMemo(() => {
    const customList = Object.entries(currentVersesMap)
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

    if (customList.length > 0) return customList;

    const totalVersesInChapter = selectedChapter === 1 ? 31 : Math.min(30, Math.max(10, Math.floor(selectedBook.verses / selectedBook.chapters)));
    const generated: { bookId: number; chapter: number; verse: number; text: string; hash: string }[] = [];

    const sampleTexts: Record<string, string[]> = {
      PT: [
        "No princípio criou Deus o céu e a terra.",
        "E a terra era sem forma e vazia; e havia trevas sobre a face do abismo.",
        "E disse Deus: Haja luz; e houve luz.",
        "E viu Deus que era boa a luz; e fez Deus separação entre a luz e as trevas.",
        "E Deus chamou à luz Dia; e às trevas chamou Noite. E foi a tarde e a manhã, o dia primeiro.",
        "O Senhor é o meu pastor, nada me faltará.",
        "Deitar-me faz em verdes pastos, guia-me mansamente a águas tranqüilas.",
        "Refrigera a minha alma; guia-me pelas veredas da justiça, por amor do seu nome.",
        "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito.",
        "E conhecereis a verdade, e a verdade vos libertará.",
        "Tudo posso naquele que me fortalece.",
        "O Senhor é a minha luz e a minha salvação; a quem temerei?",
      ],
      EN: [
        "In the beginning God created the heaven and the earth.",
        "And the earth was without form, and void; and darkness was upon the face of the deep.",
        "And God said, Let there be light: and there was light.",
        "The LORD is my shepherd; I shall not want.",
        "He maketh me to lie down in green pastures: he leadeth me beside the still waters.",
        "For God so loved the world, that he gave his only begotten Son.",
        "And ye shall know the truth, and the truth shall make you free.",
        "I can do all things through Christ which strengtheneth me.",
      ],
      ES: [
        "En el principio crió Dios los cielos y la tierra.",
        "Y la tierra estaba desordenada y vacía, y las tinieblas estaban sobre la haz del abismo.",
        "Y dijo Dios: Sea la luz; y fue la luz.",
        "Jehová es mi pastor; nada me faltará.",
        "En lugares de delicados pastos me hará descansar; Junto a aguas de reposo me pastoreará.",
        "Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito.",
      ],
    };

    const textPool = sampleTexts[activeVersionMeta.language] || sampleTexts["PT"];

    for (let v = 1; v <= totalVersesInChapter; v++) {
      const baseText = textPool[(v - 1) % textPool.length];
      const verseText = `${baseText} (${selectedBook.name} ${selectedChapter}:${v} - ${selectedVersion})`;
      const verseHash = simpleSha256(`${selectedVersion}-${selectedBookId}-${selectedChapter}-${v}-${verseText}`);

      generated.push({
        bookId: selectedBookId,
        chapter: selectedChapter,
        verse: v,
        text: verseText,
        hash: verseHash,
      });
    }

    return generated;
  }, [selectedBookId, selectedChapter, selectedVersion, activeVersionMeta, currentVersesMap, selectedBook]);

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
            {t("reader.chapter")} (1 a {selectedBook.chapters})
          </label>
          <select
            value={selectedChapter}
            onChange={(e) => setSelectedChapter(Number(e.target.value))}
            className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-teal-500/60 font-mono-tech"
          >
            {Array.from({ length: selectedBook.chapters }, (_, i) => i + 1).map((ch) => (
              <option key={ch} value={ch}>
                Capítulo {ch}
              </option>
            ))}
          </select>
        </div>

        {/* Search Input */}
        <div className="md:col-span-5 space-y-1.5">
          <label className="text-xs font-mono-tech text-slate-400 block font-semibold">
            {t("reader.search_placeholder")}
          </label>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filtrar por palavra..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-teal-500/60 font-mono-tech"
            />
          </div>
        </div>
      </div>

      {/* Book Chapter Title & Merkle Info Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono-tech">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-teal-400" />
          <span className="font-bold text-white text-sm">
            {selectedBook.name} — Capítulo {selectedChapter}
          </span>
          <span className="text-slate-400">({filteredVerses.length} versículos carregados)</span>
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <span>REDE: Stellar Futurenet</span>
          <span>•</span>
          <span className="text-teal-400">VERSÃO: {selectedVersion}</span>
        </div>
      </div>

      {/* Verses List */}
      <div className="space-y-4">
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
            onVersionChange={(v) => setSelectedVersion(v)}
          />
        ))}
      </div>
    </div>
  );
}

export default function LeitorPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-teal-400 font-mono-tech">Carregando Leitor Bíblico...</div>}>
      <LeitorContent />
    </Suspense>
  );
}
