import { initializeDomainV0 } from "@underdog-protocol/underdog-identity-sdk";
import { PublicKey, createSignerFromKeypair, keypairIdentity, publicKey } from "@metaplex-foundation/umi";
import { base58 } from "@metaplex-foundation/umi/serializers";
import { context } from "./context";

export const paymentLinks = {
  domainWithSol: "https://spherepay.co/pay/paymentLink_908cdf934cc540aaad0c800fb20d953e",
  domainWithUsdc: "https://spherepay.co/pay/paymentLink_b9cf07896a494defb358882f4a0e3489",
};

context.use(
  keypairIdentity(
    createSignerFromKeypair(context, {
      publicKey: publicKey("a5sSqWJR1WExtq1hvufeep8fLU43xxXXac44k6FRgbs"),
      secretKey: base58.serialize(process.env.ADMIN_SECRET_KEY!),
    }),
  ),
);

export const initializeDomain = async (domainAuthority: PublicKey, namespace: string) => {
  await initializeDomainV0(context, {
    domainAuthority,
    namespace,
  }).sendAndConfirm(context, { confirm: { commitment: "processed" } });
};
