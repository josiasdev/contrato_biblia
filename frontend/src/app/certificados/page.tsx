"use client";

import { useWallet } from "@/context/WalletContext";
import { useTranslation } from "@/context/LanguageContext";
import { CATEGORIES, BOOKS, CertificadoItem, TipoCertificadoKey } from "@/lib/stellar";
import { CertificateCard } from "@/components/CertificateCard";
import { CertificateModal } from "@/components/CertificateModal";
import { ScrollText, Award, ShieldCheck, AlertCircle } from "lucide-react";

export default function CertificadosPage() {
  const { isConnected, connectWallet, certificates, readVersesCount, completedBooks } = useWallet();
  const { t } = useTranslation();

  // Helper to check if a specific cert exists in wallet state
  const findIssuedCert = (matcher: (cert: CertificadoItem) => boolean): CertificadoItem | undefined => {
    return certificates.find(matcher);
  };

  // Check Biblical Completion Requirements
  const isBibliaCompletaDone = completedBooks.length >= 66;
  const isATDone = completedBooks.filter((id) => id <= 39).length >= 39;
  const isNTDone = completedBooks.filter((id) => id >= 40).length >= 27;

  // Issued certs
  const certBiblia = findIssuedCert((c) => c.tipo.type === "BibliaCompleta");
  const certAT = findIssuedCert((c) => c.tipo.type === "Testamento" && c.tipo.testament === "Antigo");
  const certNT = findIssuedCert((c) => c.tipo.type === "Testamento" && c.tipo.testament === "Novo");

  return (
    <div className="space-y-10 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-mono-tech font-semibold mb-2">
            <ScrollText className="w-3.5 h-3.5" />
            <span>Soulbound Credentials Soroban</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">{t("certificates.title")}</h1>
          <p className="text-sm text-slate-400">
            {t("certificates.subtitle")}
          </p>
        </div>

        {/* Total Certs Badge */}
        <div className="glass-panel-teal px-5 py-3 rounded-2xl border border-teal-500/40 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500 text-slate-950 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-mono-tech block uppercase">Certificados</span>
            <span className="text-xl font-extrabold text-white font-mono-tech">{certificates.length} Conquistados</span>
          </div>
        </div>
      </div>

      {!isConnected && (
        <div className="p-4 rounded-2xl bg-teal-950/40 border border-teal-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-teal-400 shrink-0" />
            <p className="text-xs text-teal-200 font-mono-tech">
              Conecte sua carteira Stellar para emitir e consultar seus certificados Soulbound on-chain.
            </p>
          </div>
          <button
            onClick={connectWallet}
            className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shrink-0 font-mono-tech"
          >
            {t("wallet.connect")}
          </button>
        </div>
      )}

      {/* 1. Certificado da Bíblia Completa (Featured Full Width Card) */}
      <section className="space-y-4">
        <h2 className="text-xs font-mono-tech uppercase tracking-wider text-teal-400 font-semibold block">
          01. Credencial Máxima On-Chain
        </h2>
        <CertificateCard
          title={t("certificates.biblia_completa")}
          subtitle="Emitido ao concluir a leitura de todos os 66 livros da Bíblia Sagrada."
          tipo={{ type: "BibliaCompleta" }}
          isUnlocked={isBibliaCompletaDone}
          issuedCert={certBiblia}
          progressPercentage={Math.round((completedBooks.length / 66) * 100)}
          progressText={`${completedBooks.length} de 66 livros concluídos`}
          isFeatured={true}
        />
      </section>

      {/* 2. Certificados de Testamentos (AT & NT) */}
      <section className="space-y-4">
        <h2 className="text-xs font-mono-tech uppercase tracking-wider text-teal-400 font-semibold block">
          02. Certificados por Testamento
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CertificateCard
            title={t("certificates.testamento_antigo")}
            subtitle="Conclusão dos 39 livros do Antigo Testamento."
            tipo={{ type: "Testamento", testament: "Antigo" }}
            isUnlocked={isATDone}
            issuedCert={certAT}
            progressPercentage={Math.round((completedBooks.filter(id => id <= 39).length / 39) * 100)}
            progressText={`${completedBooks.filter(id => id <= 39).length} de 39 livros concluídos`}
          />

          <CertificateCard
            title={t("certificates.testamento_novo")}
            subtitle="Conclusão dos 27 livros do Novo Testamento."
            tipo={{ type: "Testamento", testament: "Novo" }}
            isUnlocked={isNTDone}
            issuedCert={certNT}
            progressPercentage={Math.round((completedBooks.filter(id => id >= 40).length / 27) * 100)}
            progressText={`${completedBooks.filter(id => id >= 40).length} de 27 livros concluídos`}
          />
        </div>
      </section>

      {/* 3. Certificados por Categoria (10 Categorias Canônicas) */}
      <section className="space-y-4">
        <h2 className="text-xs font-mono-tech uppercase tracking-wider text-teal-400 font-semibold block">
          03. Certificados por Categoria Bíblica
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat) => {
            const issued = findIssuedCert(
              (c) => c.tipo.type === "Categoria" && c.tipo.category === cat.id
            );
            // Calculate mock books completed in this range
            const categoryBooks = completedBooks.filter(
              (id) => id >= cat.bookRange[0] && id <= cat.bookRange[1]
            );
            const isUnlocked = categoryBooks.length >= cat.totalBooks;
            const progressPct = Math.round((categoryBooks.length / cat.totalBooks) * 100);

            return (
              <CertificateCard
                key={cat.id}
                title={cat.name}
                subtitle={`Categoria do ${cat.testament === "AT" ? "Antigo" : "Novo"} Testamento.`}
                tipo={{ type: "Categoria", category: cat.id }}
                isUnlocked={isUnlocked}
                issuedCert={issued}
                progressPercentage={progressPct}
                progressText={`${categoryBooks.length} de ${cat.totalBooks} livros concluídos`}
              />
            );
          })}
        </div>
      </section>

      {/* 4. Certificados de Livros Individuais (66 Livros) */}
      <section className="space-y-4">
        <h2 className="text-xs font-mono-tech uppercase tracking-wider text-teal-400 font-semibold block">
          04. Certificados por Livro Individual
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BOOKS.map((book) => {
            const issued = findIssuedCert(
              (c) => c.tipo.type === "Livro" && c.tipo.bookId === book.id
            );
            const isCompleted = completedBooks.includes(book.id);

            return (
              <CertificateCard
                key={book.id}
                title={`Livro de ${book.name}`}
                subtitle={`${book.chapters} capítulos, ${book.verses} versículos.`}
                tipo={{ type: "Livro", bookId: book.id }}
                isUnlocked={isCompleted}
                issuedCert={issued}
                progressPercentage={isCompleted ? 100 : Math.min(90, readVersesCount * 20)}
                progressText={isCompleted ? "100% lido" : "Em progresso de leitura"}
              />
            );
          })}
        </div>
      </section>

      {/* Celebration Modal when new certificate is issued */}
      <CertificateModal />
    </div>
  );
}
