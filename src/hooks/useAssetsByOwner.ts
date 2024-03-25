import { PublicKey } from "@metaplex-foundation/umi";

import { useQuery } from "react-query";
import { useContext } from "./useContext";

export const useAssetsByOwner = (ownerAddress?: PublicKey) => {
  const context = useContext();

  return useQuery(
    ["assets", ownerAddress],
    async () => {
      if (ownerAddress) {
        const assets = await context.rpc.getAssetsByOwner({ owner: ownerAddress });
        return assets;
      }
    },
    { enabled: !!ownerAddress },
  );
};
