"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWallet } from "@/context/WalletContext";
import { useTranslation } from "@/context/LanguageContext";
import { Locale } from "@/i18n/translations";
import { formatAddress } from "@/lib/utils";
import { 
  BookOpen, 
  MessageSquareQuote, 
  Coins, 
  Wallet, 
  Sparkles,
  Layers
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { address, isConnected, isConnecting, connectWallet, disconnectWallet, talBalance } = useWallet();
  const { locale, setLocale, t } = useTranslation();

  const navItems = [
    { name: t("nav.home"), href: "/", icon: Layers },
    { name: t("nav.reader"), href: "/leitor", icon: BookOpen },
    { name: t("nav.community"), href: "/reflexoes", icon: MessageSquareQuote },
    { name: t("nav.rewards"), href: "/recompensas", icon: Coins },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0b1324]/95 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 h-16 md:h-20 flex items-center justify-between">
        
        {/* Bloco Logo (Esquerda) */}
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-teal-600 via-teal-500 to-emerald-400 p-0.5 shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform flex items-center justify-center">
              <div className="w-full h-full bg-[#0f172a] rounded-[10px] flex items-center justify-center">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-teal-400 group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            
            <div className="flex flex-col justify-center gap-0">
              <div className="flex items-center">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-white leading-none">
                  {t("app.title")}
                </span>
                <span className="ml-2 text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded bg-teal-950/80 text-teal-300 border border-teal-800/80 font-mono-tech uppercase tracking-wider font-semibold">
                  Futurenet
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 font-mono-tech leading-tight mt-0.5 hidden xs:block">
                {t("app.subtitle")}
              </p>
            </div>
          </Link>
        </div>

        {/* Menu Central / Nav Links (Desktop md+) */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-8 ml-6 lg:ml-12">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-teal-500/10 text-teal-400 border border-teal-500/30 shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-teal-400" : "text-slate-400"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Grupo Direito (Idioma + Carteira) */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {/* Seletor de Idioma */}
          <div className="flex items-center gap-0.5 sm:gap-1 bg-slate-900/90 border border-slate-800/90 p-0.5 sm:p-1 rounded-lg">
            {(["pt", "en", "es"] as Locale[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setLocale(lang)}
                className={`px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-mono-tech font-bold uppercase transition-all ${
                  locale === lang
                    ? "bg-teal-500 text-slate-950 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* Saldo TAL (se conectado) */}
          {isConnected && (
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-teal-950/60 border border-teal-700/50 text-teal-300 text-xs font-mono-tech font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
              <span>{talBalance} TAL</span>
            </div>
          )}

          {/* Botão Conectar / Info Carteira */}
          {isConnected ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg bg-slate-900 border border-slate-700 text-[11px] sm:text-xs font-mono-tech text-slate-200">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>{formatAddress(address || "")}</span>
              </div>
              <button
                onClick={disconnectWallet}
                className="px-2 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs text-slate-400 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors font-mono-tech"
              >
                {t("wallet.disconnect")}
              </button>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              disabled={isConnecting}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-xs shadow-md shadow-teal-500/20 active:scale-95 transition-all disabled:opacity-50"
            >
              <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>{isConnecting ? t("wallet.connecting") : t("wallet.connect")}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
