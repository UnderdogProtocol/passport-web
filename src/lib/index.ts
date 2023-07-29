import { Pda } from "@/types/Pda";
import { PublicKey } from "@solana/web3.js";

export const underdogProgramId = new PublicKey(
  "updg8JyjrmFE2h3d71p71zRXDR8q4C6Up8dDoeq3LTM"
);

export const findUnderdogPda = (seeds: Array<Buffer | Uint8Array>) =>
  Pda.find(underdogProgramId, seeds);

export const shortenAddress = (address: PublicKey, chars = 4) => {
  return `${address.toBase58().slice(0, chars)}...${address
    .toBase58()
    .slice(-chars)}`;
};

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
