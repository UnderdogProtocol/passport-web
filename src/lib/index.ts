import { PublicKey } from "@metaplex-foundation/umi";

export const shortenAddress = (address: PublicKey, chars = 4) => {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
};

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
