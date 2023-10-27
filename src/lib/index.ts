import { PublicKey } from "@metaplex-foundation/umi";

export const shortenAddress = (address: PublicKey, chars = 4) => {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
};

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const viewAssetOnXray = (mintAddress: PublicKey) => {
  window.open(
    `https://xray.helius.xyz/token/${mintAddress}?network=${
      process.env.NEXT_PUBLIC_NETWORK === "DEVNET" ? "devnet" : "mainnet"
    }`,
  );
};

export const viewAccountOnXray = (address: PublicKey) => {
  window.open(
    `https://xray.helius.xyz/account/${address}?network=${
      process.env.NEXT_PUBLIC_NETWORK === "DEVNET" ? "devnet" : "mainnet"
    }`,
  );
};
