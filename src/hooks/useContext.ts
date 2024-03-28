import { dasApi } from "@metaplex-foundation/digital-asset-standard-api";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { useConnection } from "@solana/wallet-adapter-react";
import { useMemo } from "react";

export const useContext = () => {
  const { connection } = useConnection();

  const context = useMemo(() => createUmi(connection.rpcEndpoint), []);

  context.use(dasApi());

  return context;
};
