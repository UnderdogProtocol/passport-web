import { useQuery } from "react-query";
import { PublicKey } from "@metaplex-foundation/umi";
import { useContext } from "./useContext";

export const useAsset = (mintAddress?: PublicKey) => {
  const context = useContext();

  return useQuery(
    ["asset", mintAddress],
    () => {
      if (mintAddress) {
        return context.rpc.getAsset(mintAddress);
      }
    },
    { enabled: !!mintAddress },
  );
};
