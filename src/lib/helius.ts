import { DAS, Helius } from "helius-sdk";

export const helius = new Helius(
  process.env.NEXT_PUBLIC_HELIUS_KEY!,
  process.env.NEXT_PUBLIC_HELIUS_NETWORK==="devnet" ? "devnet" : "mainnet-beta",
);

export const searchAssets = async (
  query: DAS.SearchAssetsRequest
): Promise<DAS.GetAssetResponseList | undefined> => {
  const data = await helius.rpc.searchAssets(query);
  return data;
};