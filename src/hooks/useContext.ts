import { dasApi } from "@metaplex-foundation/digital-asset-standard-api";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { useConnection } from "@solana/wallet-adapter-react";

export const useContext = () => {
  const { connection } = useConnection();

  const context = createUmi(connection.rpcEndpoint);

  context.use(dasApi());

  return context;
};
