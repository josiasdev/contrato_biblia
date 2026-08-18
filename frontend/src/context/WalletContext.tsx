"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getAddress, isConnected as checkFreighterConnected, requestAccess } from "@stellar/freighter-api";

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
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [talBalance, setTalBalance] = useState<number>(0);
  
  // State for read verses "bookId-chapter-verse"
  const [readVerses, setReadVerses] = useState<Set<string>>(
    new Set(["1-1-1", "1-1-2"])
  );
  
  // State for claimed rewards (book IDs)
  const [claimedRewards, setClaimedRewards] = useState<Set<number>>(new Set());

  useEffect(() => {
    checkConnection();
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
      console.log("Freighter non disponível:", e);
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
      // Demo fallback
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
