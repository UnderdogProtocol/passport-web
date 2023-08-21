import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";

export const useContext = () => {
  const context = createUmi(
    "https://rpc.helius.xyz/?api-key=f961a77f-7072-4316-b9a2-1cab32a4d4a1"
  );

  return context;

  // umi.use(
  //   keypairIdentity(
  //     createSignerFromKeypair(umi, {
  //       publicKey: publicKey(underdogKeypair.publicKey.toBase58()),
  //       secretKey: underdogKeypair.secretKey,
  //     })
  //   )
  // );
};
