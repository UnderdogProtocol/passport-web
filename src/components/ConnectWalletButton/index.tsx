import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal, WalletIcon } from "@solana/wallet-adapter-react-ui";

import { Button, ButtonProps } from "../Button";
import { ConnectedWalletDropdown } from "./ConnectedWalletDropdown";

type ConnectWalletButtonProps = ButtonProps;

export function ConnectWalletButton({
  size,
  type,
  ...buttonProps
}: ConnectWalletButtonProps) {
  const { wallet, connect, publicKey } = useWallet();
  const { setVisible } = useWalletModal();

  if (!wallet) {
    return (
      <Button type={type} onClick={() => setVisible(true)} {...buttonProps}>
        Select a Wallet
      </Button>
    );
  }

  if (!publicKey) {
    return (
      <Button size={size} type={type} onClick={connect} {...buttonProps}>
        <div className="flex items-center space-x-2">
          <WalletIcon wallet={wallet} className="h-4 w-4" />
          <span>Connect Wallet</span>
        </div>
      </Button>
    );
  }

  return <ConnectedWalletDropdown type={type} {...buttonProps} />;
}
