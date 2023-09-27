import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { MediaObject } from "@/components/MediaObject";
import { renderNotification } from "@/components/Notification";
import { useUserContext } from "@/contexts/user";
import { useAsset } from "@/hooks/useAsset";
import { useAssetProof } from "@/hooks/useAssetProof";
import { context } from "@/lib/context";
import {
  AccountMeta,
  createNoopSigner,
  publicKey,
  publicKeyBytes,
} from "@metaplex-foundation/umi";
import { toWeb3JsTransaction } from "@metaplex-foundation/umi-web3js-adapters";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { transferAssetV0 } from "@underdog-protocol/underdog-identity-sdk";
import { useRouter } from "next/router";
import { useMemo } from "react";

export const AssetView = () => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const router = useRouter();

  const { namespace, user } = useUserContext();

  const mintAddress = useMemo(
    () =>
      router.query.mintAddress
        ? publicKey(router.query.mintAddress as string)
        : undefined,
    [router.query.mintAddress]
  );

  const { data: assetData } = useAsset(mintAddress);
  const { data: assetProofData } = useAssetProof(mintAddress);

  const handleTransfer = async () => {
    if (
      assetData?.compression &&
      assetProofData &&
      user?.email &&
      namespace &&
      wallet.publicKey
    ) {
      const linkedAddress = publicKey(wallet.publicKey.toBase58());

      const proof: AccountMeta[] = assetProofData.proof
        .slice(0, assetProofData.proof.length - 11)
        .map((node: string) => ({
          pubkey: publicKey(node),
          isSigner: false,
          isWritable: false,
        }));

      const transaction = toWeb3JsTransaction(
        await transferAssetV0(context, {
          authority: createNoopSigner(linkedAddress),
          receiverAddress: publicKey(
            "4wyFifxwFhaWU8AnrTW2WSUNKr2821rcxLiQhk3cYhFq"
          ),
          merkleTree: publicKey(assetData.compression.tree),
          root: publicKeyBytes(assetProofData.root),
          dataHash: publicKeyBytes(assetData.compression.data_hash),
          creatorHash: publicKeyBytes(assetData.compression.creator_hash),
          leafIndex: assetData.compression.leaf_id,
          namespace,
          identifier: user.email,
        })
          .addRemainingAccounts(proof)
          .setFeePayer(createNoopSigner(linkedAddress))
          .buildWithLatestBlockhash(context)
      );

      try {
        await wallet.sendTransaction(transaction, connection);
      } catch {
        renderNotification({
          title: "Failed to transfer asset",
          description: "Please confirm the transaction to continue",
        });
      }
    }
  };

  return (
    <Container>
      <MediaObject
        size="4xl"
        title={assetData?.content?.metadata.name}
        media={{
          src:
            assetData?.content?.files && assetData.content.files.length > 0
              ? assetData?.content.files[0].uri
              : undefined,
        }}
      />

      <Button type="primary" onClick={handleTransfer}>
        Transfer
      </Button>
    </Container>
  );
};
