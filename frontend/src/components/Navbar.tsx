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
  Layers,
  ScrollText,
  LogOut,
  Trophy
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { address, isConnected, isConnecting, connectWallet, disconnectWallet, talBalance } = useWallet();
  const { locale, setLocale, t } = useTranslation();

  const navItems = [
    { name: t("nav.home"), href: "/", icon: Layers },
    { name: t("nav.reader"), href: "/leitor", icon: BookOpen },
    { name: t("nav.community"), href: "/reflexoes", icon: MessageSquareQuote },
    { name: t("nav.certificates"), href: "/certificados", icon: ScrollText },
    { name: t("nav.rewards"), href: "/recompensas", icon: Coins },
    { name: "Ranking", href: "/ranking", icon: Trophy },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0b1324]/95 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
        
        {/* Bloco Logo (Esquerda) */}
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-teal-600 via-teal-500 to-emerald-400 p-0.5 shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform flex items-center justify-center">
              <div className="w-full h-full bg-[#0f172a] rounded-[10px] flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-teal-400 group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            
            <div className="flex flex-col justify-center gap-0">
              <div className="flex items-center">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-white leading-none whitespace-nowrap">
                  {t("app.title")}
                </span>
                <span className="ml-2 text-[9px] px-1.5 py-0.5 rounded bg-teal-950/80 text-teal-300 border border-teal-800/80 font-mono-tech uppercase tracking-wider font-semibold">
                  Futurenet
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Menu Central / Nav Links (Desktop lg+) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 mx-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs xl:text-sm font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-teal-500/10 text-teal-400 border border-teal-500/30 shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-teal-400" : "text-slate-400"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Grupo Direito (Idioma + AccountPill + LogOut) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Seletor de Idioma */}
          <div className="flex items-center gap-0.5 bg-slate-900/90 border border-slate-800 p-0.5 rounded-lg">
            {(["pt", "en", "es"] as Locale[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setLocale(lang)}
                className={`px-1.5 sm:px-2 py-0.5 rounded text-[10px] font-mono-tech font-bold uppercase transition-all ${
                  locale === lang
                    ? "bg-teal-500 text-slate-950 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* AccountPill (Saldo TAL + Endereço da Carteira) */}
          {isConnected ? (
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-slate-900 border border-slate-700/80 text-xs font-mono-tech shadow-sm">
                <div className="flex items-center gap-1 text-teal-300 font-semibold">
                  <Sparkles className="w-3 h-3 text-teal-400 animate-pulse" />
                  <span>{talBalance} TAL</span>
                </div>
                <div className="border-l border-slate-700 h-3.5 mx-0.5" />
                <div className="flex items-center gap-1 text-slate-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>{formatAddress(address || "")}</span>
                </div>
              </div>

              {/* Botão LogOut / Sair Explicito */}
              <button
                onClick={disconnectWallet}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-rose-400 bg-slate-900/80 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-900/50 text-xs font-mono-tech font-semibold transition-all shrink-0 active:scale-95"
                title={t("wallet.disconnect")}
              >
                <LogOut className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              disabled={isConnecting}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-xs shadow-md shadow-teal-500/20 active:scale-95 transition-all disabled:opacity-50 whitespace-nowrap"
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>{isConnecting ? t("wallet.connecting") : t("wallet.connect")}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
