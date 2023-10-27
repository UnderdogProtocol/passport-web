import {
  createNoopSigner,
  generateSigner,
  signerIdentity,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";

export const context = createUmi(
  "https://smart-serene-daylight.solana-mainnet.quiknode.pro/874271840b52506691067a7b8f57052e1322099b/",
);

context.use(
  signerIdentity(createNoopSigner(generateSigner(context).publicKey)),
);
