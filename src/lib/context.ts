import { createNoopSigner, generateSigner, signerIdentity } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";

export const context = createUmi(process.env.NEXT_PUBLIC_RPC_URL!);

context.use(signerIdentity(createNoopSigner(generateSigner(context).publicKey)));
