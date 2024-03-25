import { PublicKey } from "@metaplex-foundation/umi";
import { getAssetWithProof } from "@metaplex-foundation/mpl-bubblegum";

import { useQuery } from "react-query";
import { useContext } from "./useContext";

export const useAssetWithProof = (mintAddress?: PublicKey) => {
  const context = useContext();
  return useQuery(
    ["asset-with-proof", mintAddress],
    async () => {
      if (mintAddress) {
        const assetWithProof = await getAssetWithProof(context, mintAddress);
        return assetWithProof;
      }
    },
    { enabled: !!mintAddress },
  );
};
