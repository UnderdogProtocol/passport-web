import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";

export const useContext = () => {
  const context = createUmi(process.env.NEXT_PUBLIC_RPC_URL!);

  return context;
};
