import {
  WalletDialogProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-material-ui";
import { WalletProvider } from "@solana/wallet-adapter-react";
import {
  getPhantomWallet,
  getSolletWallet,
} from "@solana/wallet-adapter-wallets";
import React, { useMemo } from "react";

export const SolanaWalletWrapper: React.FC = ({ children }) => {
  const wallets = useMemo(() => [getPhantomWallet(), getSolletWallet()], []);
  return (
    <WalletProvider wallets={wallets} autoConnect>
      <WalletDialogProvider>
        <WalletMultiButton />
        {children}
      </WalletDialogProvider>
    </WalletProvider>
  );
};
