"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/context/LanguageContext";
import { 
  Layers, 
  BookOpen, 
  MessageSquareQuote, 
  ScrollText,
  Coins 
} from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useTranslation();

  const navItems = [
    { name: t("nav.home"), href: "/", icon: Layers },
    { name: t("nav.reader"), href: "/leitor", icon: BookOpen },
    { name: t("nav.community"), href: "/reflexoes", icon: MessageSquareQuote },
    { name: t("nav.certificates"), href: "/certificados", icon: ScrollText },
    { name: t("nav.rewards"), href: "/recompensas", icon: Coins },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0b1324]/95 backdrop-blur-lg border-t border-slate-800 xl:hidden">
      <div className="flex items-center justify-around h-16 px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full py-1 gap-1 transition-all ${
                isActive
                  ? "text-teal-400 font-semibold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <div className={`p-1 rounded-xl transition-all ${isActive ? "bg-teal-500/10 border border-teal-500/30" : ""}`}>
                <Icon className={`w-4 h-4 ${isActive ? "text-teal-400" : "text-slate-400"}`} />
              </div>
              <span className="text-[9px] font-mono-tech leading-none">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
