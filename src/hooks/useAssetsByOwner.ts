import { useQuery } from "react-query";
import { helius } from "@/lib/helius";
import { PublicKey } from "@metaplex-foundation/umi";
import { AssetSortBy, AssetSortDirection } from "helius-sdk";

const fetchAsset = async (mintAddress?: string) => {
  return mintAddress
    ? helius.rpc.getAssetsByOwner({
        ownerAddress: mintAddress,
        page: 1,
        limit: 100,
        sortBy: {
          sortBy: AssetSortBy.Created,
          sortDirection: AssetSortDirection.Asc,
        },
      })
    : undefined;
};

export const useAssetsByOwner = (mintAddress?: string) => {
  return useQuery("someName", async () => fetchAsset(mintAddress), {
    enabled: !!mintAddress,
    retry: false,
  });
};
