import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useWallet } from "@solana/wallet-adapter-react";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import React, { useEffect, useMemo, useState } from "react";

const connection = new Connection(clusterApiUrl("mainnet-beta"));

const App: React.FC = () => {
  const { connected, publicKey } = useWallet();

  return (
    <>
      <header>
        {connected
          ? `hello ${publicKey?.toBase58().substr(0, 5)}`
          : "please connect"}
      </header>
      <TokenList />
    </>
  );
};

const TokenList: React.FC = () => {
  const [tokenList, setTokenList] = useState<Record<string, any>>();

  const [tokenAccounts, setTokenAccounts] = useState<
    Array<{ uiAmount: string; mint: string }>
  >([]);

  const { publicKey } = useWallet();

  useMemo(() => {
    fetch(
      // static snapshot of https://github.com/solana-labs/token-list/blob/main/src/tokens/solana.tokenlist.json
      "https://rawcdn.githack.com/solana-labs/token-list/f13ca6cd7b22e92706f969b452cbd2cb3279211b/src/tokens/solana.tokenlist.json"
    )
      .then((x) => x.json())
      .then(setTokenList);
  }, []);

  useEffect(() => {
    if (publicKey) {
      connection
        ?.getParsedTokenAccountsByOwner(publicKey, {
          programId: new PublicKey(TOKEN_PROGRAM_ID),
        })
        .then(({ value }) => {
          setTokenAccounts(
            value
              .map(({ account }) => ({
                uiAmount: account.data.parsed.info.tokenAmount.uiAmountString,
                mint: account.data.parsed.info.mint,
              }))
              .sort((a, b) => Number(b.uiAmount) - Number(a.uiAmount))
          );
        });
    } else {
      // disconnected
      setTokenAccounts([]);
    }
  }, [publicKey]);

  return (
    <table role="main">
      {tokenAccounts.map(({ uiAmount, mint }) => {
        const token = tokenList?.tokens?.find((t: any) => t.address === mint);
        return (
          <tr key={mint}>
            <td>{uiAmount}</td>
            <td>{token?.symbol}</td>
            <td>
              {token ? (
                <>
                  <img src={token.logoURI} alt={`${token.name} logo`} />
                  <span>
                    {token.name}
                  </span>
                </>
              ) : (
                mint
              )}
            </td>
          </tr>
        );
      })}
    </table>
  );
};

export default App;
