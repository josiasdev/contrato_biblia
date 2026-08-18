"use client";

import { useState } from "react";
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
  CheckCircle2, 
  Sparkles,
  Layers,
  Menu,
  X
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { address, isConnected, isConnecting, connectWallet, disconnectWallet, talBalance } = useWallet();
  const { locale, setLocale, t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: t("nav.home"), href: "/", icon: Layers },
    { name: t("nav.reader"), href: "/leitor", icon: BookOpen },
    { name: t("nav.community"), href: "/reflexoes", icon: MessageSquareQuote },
    { name: t("nav.rewards"), href: "/recompensas", icon: Coins },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0b1324]/95 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-6 md:px-8 h-20 flex items-center justify-between">
        
        {/* Bloco Logo (Esquerda) */}
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 via-teal-500 to-emerald-400 p-0.5 shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform flex items-center justify-center">
              <div className="w-full h-full bg-[#0f172a] rounded-[10px] flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-teal-400 group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            
            <div className="flex flex-col justify-center gap-0">
              <div className="flex items-center">
                <span className="font-extrabold text-lg tracking-tight text-white leading-none">
                  {t("app.title")}
                </span>
                <span className="ml-2.5 text-[10px] px-2 py-0.5 rounded bg-teal-950/80 text-teal-300 border border-teal-800/80 font-mono-tech uppercase tracking-wider font-semibold">
                  Futurenet
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono-tech leading-tight mt-0.5">
                {t("app.subtitle")}
              </p>
            </div>
          </Link>
        </div>

        {/* Menu Central / Nav Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 ml-8 xl:ml-12">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
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

        {/* Grupo Direito (Idioma + Carteira + Mobile Toggle) */}
        <div className="flex items-center gap-4 shrink-0">
          {/* Seletor de Idioma */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-900/90 border border-slate-800/90 p-1 rounded-lg">
            {(["pt", "en", "es"] as Locale[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setLocale(lang)}
                className={`px-2.5 py-1 rounded text-xs font-mono-tech font-bold uppercase transition-all ${
                  locale === lang
                    ? "bg-teal-500 text-slate-950 shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/40"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* Saldo TAL (se conectado) */}
          {isConnected && (
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-teal-950/60 border border-teal-700/50 text-teal-300 text-xs font-mono-tech font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
              <span>{talBalance} TAL</span>
            </div>
          )}

          {/* Botão Conectar / Info Carteira */}
          {isConnected ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono-tech text-slate-200">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>{formatAddress(address || "")}</span>
              </div>
              <button
                onClick={disconnectWallet}
                className="px-3 py-2 text-xs text-slate-400 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors font-mono-tech"
              >
                {t("wallet.disconnect")}
              </button>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              disabled={isConnecting}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-xs shadow-md shadow-teal-500/20 active:scale-95 transition-all disabled:opacity-50"
            >
              <Wallet className="w-4 h-4" />
              <span>{isConnecting ? t("wallet.connecting") : t("wallet.connect")}</span>
            </button>
          )}

          {/* Botão Menu Hambúrguer (Mobile/Tablet) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Menu Mobile / Tablet Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0b1324] border-b border-slate-800 px-6 py-4 space-y-3">
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-teal-500/10 text-teal-400 border border-teal-500/30"
                      : "text-slate-300 hover:bg-slate-800/50"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-teal-400" : "text-slate-400"}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-mono-tech">Idioma:</span>
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-lg">
              {(["pt", "en", "es"] as Locale[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLocale(lang)}
                  className={`px-3 py-1 rounded text-xs font-mono-tech font-bold uppercase transition-all ${
                    locale === lang
                      ? "bg-teal-500 text-slate-950"
                      : "text-slate-400"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
