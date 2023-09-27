import { useQuery } from "react-query";
import { helius } from "@/lib/helius";
import { PublicKey } from "@metaplex-foundation/umi";

const fetchAsset = async (mintAddress?: PublicKey) => {
  return mintAddress ? helius.rpc.getAsset(mintAddress) : undefined;
};

export const useAsset = (mintAddress?: PublicKey) => {
  return useQuery(["asset", mintAddress], () => fetchAsset(mintAddress), {
    enabled: !!mintAddress,
    retry: false,
  });
};
