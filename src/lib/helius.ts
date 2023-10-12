import { DAS, Helius } from "helius-sdk";

export const helius = new Helius(
  process.env.HELIUS_KEY!,
  process.env.HELIUS_NETWORK==="devnet" ? "devnet" : "mainnet-beta",
);

export const searchAssets = async (
  query: DAS.SearchAssetsRequest
): Promise<DAS.GetAssetResponseList | undefined> => {
  const data = await helius.rpc.searchAssets(query);
  return data;
};