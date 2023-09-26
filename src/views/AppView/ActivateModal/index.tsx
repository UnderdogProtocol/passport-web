import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { ConnectWalletButton } from "@/components/ConnectWalletButton";
import { MediaObject } from "@/components/MediaObject";
import { Header } from "@/components/MediaObject/Header";
import { Modal, ModalProps } from "@/components/Modal";
import { renderNotification } from "@/components/Notification";
import { useUserContext } from "@/contexts/user";
import { useWallet } from "@solana/wallet-adapter-react";

export type ActivateModalProps = ModalProps;

export const ActivateModal: React.FC<ActivateModalProps> = (props) => {
  const { publicKey } = useWallet();
  const { app } = useUserContext();

  if (!app) return null;

  return (
    <Modal {...props}>
      <Card className="p-8 space-y-8">
        <MediaObject
          size="xl"
          title={`Activate your ${app.title} account`}
          description={`Once your account is activated, you can transfer & burn your assets`}
          media={{ src: app.src }}
        />

        <div className="flex items-center justify-between space-x-8">
          <Header
            title="Select a web3 wallet"
            description="Connect a wallet like Solflare, Backpack, or Phantom"
          />
          <ConnectWalletButton type="secondary" className="flex-shrink-0" />
        </div>

        <div className="flex justify-between items-center space-x-8">
          <MediaObject
            title="Activate Account"
            description="Sign the transaction to activate your account. This requires a little bit of SOL to store your account on-chain."
          />
          <Button
            type="primary"
            disabled={!publicKey}
            onClick={() => renderNotification({ title: "Oops", description: "I did it again" })}
          >
            Activate
          </Button>
        </div>
      </Card>
    </Modal>
  );
};
