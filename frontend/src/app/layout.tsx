import type { Metadata } from "next";
import "./globals.css";
import { WalletProvider } from "@/context/WalletContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "Contrato Bíblia | Stellar Soroban Smart Contract dApp",
  description:
    "Aplicação descentralizada para prova de leitura da Bíblia Sagrada, reflexões comunitárias e recompensas em tokens TAL na blockchain Stellar (Futurenet).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#0f172a] text-slate-100 antialiased flex flex-col justify-between">
        <LanguageProvider>
          <WalletProvider>
            <Navbar />
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-8 pb-24 md:pb-8">
              {children}
            </main>
            <footer className="border-t border-slate-800 bg-[#0b1324] py-8 pb-24 md:pb-8 text-center text-xs text-slate-400 font-mono-tech">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-200">Bible Contract (Soroban)</span>
                  <span>•</span>
                  <span className="text-teal-400">Futurenet Ledger</span>
                </div>
                <p>© 2026 Josias Batista. MIT License.</p>
              </div>
            </footer>
            <BottomNav />
          </WalletProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
