import { useQuery } from "react-query";
import { helius } from "@/lib/helius";
import { PublicKey } from "@metaplex-foundation/umi";

const fetchAsset = async (mintAddress?: string) => {
  return mintAddress ? helius.rpc.getAssetsByOwner({ownerAddress: mintAddress, page: 1, limit: 100}) : undefined;
};

export const useAssetsByOwner = (mintAddress?: string) => {
  
  return useQuery("someName", async () => fetchAsset(mintAddress), {
    enabled: !!mintAddress,
    retry: false,
  });
};
