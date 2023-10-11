import { DAS, Helius } from "helius-sdk";

export const helius = new Helius(
  "f961a77f-7072-4316-b9a2-1cab32a4d4a1",
  // process.env.NEXT_PUBLIC_NETWORK === "DEVNET" ? "devnet" : "mainnet-beta"
  "devnet"
);

export const searchAssets = async (
  query: DAS.SearchAssetsRequest
): Promise<DAS.GetAssetResponseList | undefined> => {
  const data = await helius.rpc.searchAssets(query);
  return data;
};