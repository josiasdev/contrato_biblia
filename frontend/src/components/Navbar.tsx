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
  CheckCircle2, 
  Globe,
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
    <header className="sticky top-0 z-50 w-full bg-[#0b1324]/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 via-teal-500 to-emerald-400 p-0.5 shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0f172a] rounded-[10px] flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-teal-400 group-hover:rotate-12 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-white">
                {t("app.title")}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800/80 font-mono-tech uppercase">
                Futurenet
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono-tech -mt-1">{t("app.subtitle")}</p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
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
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Language & Wallet Controls */}
        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-lg">
            {(["pt", "en", "es"] as Locale[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setLocale(lang)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono-tech font-bold uppercase transition-all ${
                  locale === lang
                    ? "bg-teal-500 text-slate-950"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          {isConnected && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-teal-950/60 border border-teal-700/50 text-teal-300 text-xs font-mono-tech font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
              <span>{talBalance} TAL</span>
            </div>
          )}

          {isConnected ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono-tech text-slate-200">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>{formatAddress(address || "")}</span>
              </div>
              <button
                onClick={disconnectWallet}
                className="px-2.5 py-1.5 text-xs text-slate-400 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors font-mono-tech"
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
        </div>
      </div>
    </header>
  );
}
