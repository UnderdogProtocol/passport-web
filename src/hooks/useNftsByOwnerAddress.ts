import { useQuery } from "react-query";
import { helius } from "@/lib/helius";
import { PublicKey } from "@solana/web3.js";

const fetchNftsByOwnerAddress = (ownerAddress?: PublicKey, page = 1) => {
  if (!ownerAddress) {
    return Promise.reject("No ownerAddress provided");
  }

  return helius.rpc.getAssetsByOwner({
    ownerAddress: ownerAddress.toBase58(),
    page,
  });
};

export const useNftsByOwnerAddress = (
  ownerAddress?: PublicKey,
  page = 1,
) => {
  return useQuery(
    ["nftsByOwnerAddress", ownerAddress?.toBase58(), page],
    () => fetchNftsByOwnerAddress(ownerAddress, page),
    { enabled: !!ownerAddress }
  );
};
