import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { ConnectWalletButton } from "@/components/ConnectWalletButton";
import { MediaObject } from "@/components/MediaObject";
import { Header } from "@/components/MediaObject/Header";
import { Modal, ModalProps } from "@/components/Modal";
import { renderNotification } from "@/components/Notification";
import { useUserContext } from "@/contexts/user";
import { useAsset } from "@/hooks/useAsset";
import { useAssetProof } from "@/hooks/useAssetProof";
import { shortenAddress } from "@/lib";
import { context } from "@/lib/context";
import {
  createNoopSigner,
  publicKey,
  publicKeyBytes,
  AccountMeta,
} from "@metaplex-foundation/umi";
import { toWeb3JsTransaction } from "@metaplex-foundation/umi-web3js-adapters";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { burnAssetV0 } from "@underdog-protocol/underdog-identity-sdk";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import { HiOutlineTrash } from "react-icons/hi2";

export const BurnModal: React.FC<ModalProps> = (props) => {
  const router = useRouter();
  const mintAddress = useMemo(
    () =>
      router.query.mintAddress
        ? publicKey(router.query.mintAddress as string)
        : undefined,
    [router.query.mintAddress]
  );

  const { data: assetData } = useAsset(mintAddress);
  const { data: assetProofData } = useAssetProof(mintAddress);

  const wallet = useWallet();
  const { connection } = useConnection();
  const { app, namespace, user, account } = useUserContext();

  useEffect(() => {
    if (
      wallet.publicKey &&
      account?.address &&
      wallet.publicKey.toBase58() !== account.address.toString() &&
      !wallet.disconnecting
    ) {
      wallet.disconnect();
      renderNotification({
        title: "Connected wallet is not authorized to send assets",
        description: "You must connect the wallet linked to your account",
      });
    }
  }, [wallet, account]);

  if (!app) return null;

  const handleBurn = async () => {
    if (
      assetData?.compression &&
      assetProofData &&
      account?.address &&
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
        await burnAssetV0(context, {
          authority: createNoopSigner(linkedAddress),
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
        renderNotification({
          title: "Deleted asset",
          description: "Please wait a second for the transaction to complete",
        });
        props.onClose && props.onClose();
        router.push(`/${namespace}`);
      } catch {
        renderNotification({
          title: "Failed to delete asset",
          description: "Please confirm the transaction to continue",
        });
      }
    }
  };

  return (
    <Modal {...props}>
      <Card className="p-8 space-y-8">
        <MediaObject
          size="2xl"
          title={`Send ${assetData?.content?.metadata.name || "Asset"}`}
          description={
            account?.address &&
            `Connect the wallet you activated your account with (${shortenAddress(
              account?.address
            )})`
          }
          media={{
            src:
              assetData?.content?.files && assetData.content.files.length > 0
                ? assetData?.content.files[0].uri
                : undefined,
          }}
        />

        <div className="flex items-center justify-between space-x-8">
          <Header
            title="Connect Wallet"
            description={
              account?.address &&
              `You'll need to approve deleting your asset with wallet ${shortenAddress(account?.address)}`
            }
          />
          <ConnectWalletButton type="secondary" className="flex-shrink-0" />
        </div>

        <div className="flex justify-between items-center space-x-8">
          <MediaObject
            title="Delete Asset"
            description="Sign the transaction to delete your asset. You'll need a little bit of SOL to cover transactions fees."
          />

          <Button
            type="primary"
            disabled={!wallet.publicKey}
            onClick={handleBurn}
          >
            <div className="flex items-center space-x-2">
              <span>Delete</span>
              <HiOutlineTrash className="h-5 w-5" />
            </div>
          </Button>
        </div>
      </Card>
    </Modal>
  );
};
