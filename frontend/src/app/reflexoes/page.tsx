"use client";

import { useState } from "react";
import { useTranslation } from "@/context/LanguageContext";
import { ReflectionCard } from "@/components/ReflectionCard";
import { MessageSquareQuote } from "lucide-react";

export default function ReflexoesPage() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<"todas" | "populares">("todas");

  const reflections = [
    {
      id: "ref-1",
      author: "GAX728N4MP9L2K83J1Q9Z0B4C8D2E1F4G7H0J3K6L9M2N5P8",
      verseRef: "Gênesis 1:1",
      content:
        "Este versículo estabelece a soberania de Deus sobre a criação do cosmos. A palavra 'criou' no hebraico (Bara) denota uma criação a partir do nada (ex nihilo), evidenciando o poder supremo divino.",
      timestamp: 1776450000,
      hash: "f2e9a224a50ee5118533e4544253966a348003183a69620596323145f15a201b",
      initialLikes: 14,
      comments: [
        {
          id: "c-1",
          autor: "GKEY88N1AB2CD3EF4GH5IJ6KL7MN8OP9QR0ST1UV2WX3",
          conteudo: "Excelente insight sobre a exegese do termo Bara!",
          timestamp: 1776451200,
        },
      ],
    },
    {
      id: "ref-2",
      author: "GBIBLIA_LEITOR_SOROBAN_DEMO_FUTURENET_X728",
      verseRef: "Salmos 23:1",
      content:
        "Mesmo nos vales mais escuros, a metáfora do Pastor nos lembra de seu cuidado constante. Nada me faltará não refere-se à ausência de lutas, mas à presença de provisão espiritual diária.",
      timestamp: 1776435000,
      hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      initialLikes: 29,
      comments: [],
    },
    {
      id: "ref-3",
      author: "GADMIN_STELLAR_FUTURENET_9921AZ88",
      verseRef: "João 3:16",
      content:
        "O amor divino é demonstrado em ação sacrificial. O dom incondicional de Deus é a pedra angular da fé e da salvação graciosa oferecida a toda a humanidade.",
      timestamp: 1776420000,
      hash: "8f48174577f805a8b792e858cf09f18a6e872e428c0a87a8bfa4911f4d92a10a",
      initialLikes: 42,
      comments: [
        {
          id: "c-2",
          autor: "GAX728N4MP9L2K83J1Q9Z0B4C8D2E1F4G7H0J3K6L9M2N5P8",
          conteudo: "Verdade transformadora! O centro do Evangelho.",
          timestamp: 1776425000,
        },
      ],
    },
  ];

  const sortedReflections = [...reflections].sort((a, b) => {
    if (filter === "populares") {
      return b.initialLikes - a.initialLikes;
    }
    return b.timestamp - a.timestamp;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-mono-tech font-semibold mb-2">
            <MessageSquareQuote className="w-3.5 h-3.5" />
            <span>{t("community.title")}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">{t("community.title")}</h1>
          <p className="text-sm text-slate-400">
            {t("community.subtitle")}
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-950 border border-slate-800 self-start font-mono-tech">
          <button
            onClick={() => setFilter("todas")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === "todas"
                ? "bg-teal-500 text-slate-950 shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {t("community.filter_recent")}
          </button>
          <button
            onClick={() => setFilter("populares")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === "populares"
                ? "bg-teal-500 text-slate-950 shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {t("community.filter_popular")}
          </button>
        </div>
      </div>

      {/* Reflections Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sortedReflections.map((ref) => (
          <ReflectionCard
            key={ref.id}
            id={ref.id}
            author={ref.author}
            verseRef={ref.verseRef}
            content={ref.content}
            timestamp={ref.timestamp}
            hash={ref.hash}
            initialLikes={ref.initialLikes}
            initialComments={ref.comments}
          />
        ))}
      </div>
    </div>
  );
}
