import { useQuery } from "react-query";
import { helius } from "@/lib/helius";
import { PublicKey } from "@metaplex-foundation/umi";

const fetchAssetProof = async (mintAddress?: PublicKey) => {
  return mintAddress
    ? helius.rpc.getAssetProof({ id: mintAddress })
    : undefined;
};

export const useAssetProof = (mintAddress?: PublicKey) => {
  return useQuery(
    ["assetProof", mintAddress],
    () => fetchAssetProof(mintAddress),
    {
      enabled: !!mintAddress,
      retry: false,
    },
  );
};
