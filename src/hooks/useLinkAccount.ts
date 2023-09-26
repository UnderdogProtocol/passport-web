import { context } from "@/lib/context";
import { PublicKey, RpcAccount } from "@metaplex-foundation/umi";
import { useEffect, useState } from "react";

export const useLinkAccount = (address?: PublicKey) => {
  const [account, setAccount] = useState<RpcAccount>();

  useEffect(() => {
    if (address) {
      context.rpc.getAccount(address).then((maybeRpcAccount) => {
        if (maybeRpcAccount.exists) setAccount(maybeRpcAccount);
      });
    }
  }, [address]);

  return account;
};
