import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal, WalletIcon } from "@solana/wallet-adapter-react-ui";
import axios from "axios";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useCallback } from "react";

import { base58 } from "@metaplex-foundation/umi/serializers";
import { useToggle } from "../../hooks/useToggle";
import { ButtonType, Button } from "../Button";
import { renderNotification } from "../Notification";

type SignInWithWalletButtonProps = {
  type?: ButtonType;
};

export function SignInWithWalletButton({ type = "primary" }: SignInWithWalletButtonProps) {
  const router = useRouter();

  const { wallet, signMessage, publicKey, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const [signingIn, toggleSigningIn] = useToggle();

  const getNonce = async () => {
    const response = await axios.get("/api/auth/nonce");
    return response.data.nonce;
  };

  const handleConnect = useCallback(async () => {
    if (signMessage && publicKey) {
      const nonce = await getNonce();
      const message = `Sign this message to connect your wallet.\n\nNonce: ${nonce}`;
      const encodedMessage = new TextEncoder().encode(message);

      let signedMessage;
      try {
        signedMessage = await signMessage(encodedMessage);
      } catch (e) {
        renderNotification({
          title: "Please sign the verification message to login",
        });
        return;
      }

      try {
        toggleSigningIn();
        await signIn("credentials", {
          walletAddress: publicKey.toBase58(),
          signature: base58.deserialize(signedMessage)[0],
          callbackUrl: (router.query.callbackUrl as string) || "/",
        });
      } catch (e) {
        renderNotification({ title: "There was a problem signing in" });
      }
      toggleSigningIn();
    }
  }, [signMessage, publicKey, toggleSigningIn, router.query.callbackUrl]);

  if (!wallet) {
    return (
      <Button block type={type} onClick={() => setVisible(true)}>
        Select a Wallet
      </Button>
    );
  }

  return (
    <div>
      <Button block type={type} onClick={handleConnect}>
        <div className="flex items-center space-x-2">
          <WalletIcon wallet={wallet} className="h-6 w-6" />
          {signingIn ? <span>Signing In...</span> : <span>Sign In with Wallet</span>}
        </div>
      </Button>
      <Button type="link" onClick={() => disconnect()} block className="text-primary">
        Connect a different wallet
      </Button>
    </div>
  );
}
