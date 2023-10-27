import { useQuery } from "react-query";
import { helius } from "@/lib/helius";
import { PublicKey } from "@metaplex-foundation/umi";

const fetchNftsByOwnerAddress = (ownerAddress?: PublicKey, page = 1) => {
  if (!ownerAddress) {
    return Promise.reject("No ownerAddress provided");
  }

  return helius.rpc.getAssetsByOwner({
    ownerAddress,
    page,
  });
};

export const useNftsByOwnerAddress = (ownerAddress?: PublicKey, page = 1) => {
  return useQuery(
    ["nftsByOwnerAddress", ownerAddress, page],
    () => fetchNftsByOwnerAddress(ownerAddress, page),
    { enabled: !!ownerAddress },
  );
};
