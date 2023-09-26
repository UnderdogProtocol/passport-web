import { Helius } from "helius-sdk";

export const helius = new Helius(
  "f961a77f-7072-4316-b9a2-1cab32a4d4a1",
  process.env.NEXT_PUBLIC_NETWORK === "DEVNET" ? "devnet" : "mainnet-beta"
);
