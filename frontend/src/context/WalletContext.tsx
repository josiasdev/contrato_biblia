"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getAddress, isConnected as checkFreighterConnected, requestAccess } from "@stellar/freighter-api";
import { CertificadoItem, TipoCertificadoKey } from "@/lib/stellar";

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  talBalance: number;
  readVersesCount: number;
  completedBooks: number[];
  markVerseAsRead: (bookId: number, chapter: number, verse: number) => Promise<boolean>;
  readVerses: Set<string>;
  claimBookReward: (bookId: number) => Promise<boolean>;
  claimedRewards: Set<number>;
  certificates: CertificadoItem[];
  emitCertificate: (tipo: TipoCertificadoKey) => Promise<CertificadoItem>;
  newlyIssuedCert: CertificadoItem | null;
  clearNewlyIssuedCert: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [talBalance, setTalBalance] = useState<number>(0);
  
  const [readVerses, setReadVerses] = useState<Set<string>>(
    new Set(["1-1-1", "1-1-2", "1-1-3"])
  );
  const [claimedRewards, setClaimedRewards] = useState<Set<number>>(new Set([1]));
  const [certificates, setCertificates] = useState<CertificadoItem[]>([
    {
      id: "cert-genesis",
      leitor: "GBIBLIA_LEITOR_SOROBAN_DEMO_FUTURENET_X728",
      tipo: { type: "Livro", bookId: 1 },
      timestamp: 1776450000,
      hash_certificado: "c901192a4df04a05d8765eedcf9fa699c2b1728bffa0492debea41e08360b6d9",
    },
  ]);
  const [newlyIssuedCert, setNewlyIssuedCert] = useState<CertificadoItem | null>(null);

  useEffect(() => {
    checkConnection();

    // Listener de sincronização automática PWA quando a internet reconecta
    const handleOnline = () => {
      const offlineQueue = localStorage.getItem("offline_read_queue");
      if (offlineQueue) {
        try {
          const pendingVerses: string[] = JSON.parse(offlineQueue);
          if (pendingVerses.length > 0) {
            setReadVerses((prev) => {
              const updated = new Set(prev);
              pendingVerses.forEach((v) => updated.add(v));
              return updated;
            });
            localStorage.removeItem("offline_read_queue");
          }
        } catch (e) {
          console.error("Erro ao sincronizar leitura offline PWA:", e);
        }
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("online", handleOnline);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("online", handleOnline);
      }
    };
  }, []);

  const checkConnection = async () => {
    try {
      const connRes = await checkFreighterConnected();
      if (connRes && connRes.isConnected) {
        const addrRes = await getAddress();
        if (addrRes && addrRes.address) {
          setAddress(addrRes.address);
          setIsWalletConnected(true);
          setTalBalance(100);
        }
      }
    } catch (e) {
      console.log("Freighter wallet check error:", e);
    }
  };

  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      const accessObj = await requestAccess();
      if (accessObj && accessObj.address) {
        setAddress(accessObj.address);
        setIsWalletConnected(true);
        setTalBalance(100);
        return;
      }
      const demoAddress = "GBIBLIA_LEITOR_SOROBAN_DEMO_FUTURENET_X728";
      setAddress(demoAddress);
      setIsWalletConnected(true);
      setTalBalance(200);
    } catch (error) {
      console.error("Erro ao conectar carteira:", error);
      const demoAddress = "GBIBLIA_LEITOR_SOROBAN_DEMO_FUTURENET_X728";
      setAddress(demoAddress);
      setIsWalletConnected(true);
      setTalBalance(200);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAddress(null);
    setIsWalletConnected(false);
  };

  const markVerseAsRead = async (bookId: number, chapter: number, verse: number) => {
    const key = `${bookId}-${chapter}-${verse}`;
    if (readVerses.has(key)) return false;

    setReadVerses((prev) => new Set([...Array.from(prev), key]));
    return true;
  };

  const claimBookReward = async (bookId: number) => {
    if (claimedRewards.has(bookId)) return false;

    setClaimedRewards((prev) => new Set([...Array.from(prev), bookId]));
    setTalBalance((prev) => prev + 100);
    return true;
  };

  const emitCertificate = async (tipo: TipoCertificadoKey): Promise<CertificadoItem> => {
    const hash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    const newCert: CertificadoItem = {
      id: `cert-${Date.now()}`,
      leitor: address || "GBIBLIA_LEITOR_SOROBAN_DEMO_FUTURENET_X728",
      tipo,
      timestamp: Math.floor(Date.now() / 1000),
      hash_certificado: hash,
    };

    setCertificates((prev) => [...prev, newCert]);
    setNewlyIssuedCert(newCert);
    return newCert;
  };

  const clearNewlyIssuedCert = () => {
    setNewlyIssuedCert(null);
  };

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnected: isWalletConnected,
        isConnecting,
        connectWallet,
        disconnectWallet,
        talBalance,
        readVersesCount: readVerses.size,
        completedBooks: Array.from(claimedRewards),
        markVerseAsRead,
        readVerses,
        claimBookReward,
        claimedRewards,
        certificates,
        emitCertificate,
        newlyIssuedCert,
        clearNewlyIssuedCert,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet deve ser usado dentro de WalletProvider");
  }
  return context;
}
