import { Button, ButtonProps } from "@/components/Button";
import { ConnectWalletButton } from "@/components/ConnectWalletButton";
import { renderNotification } from "@/components/Notification";
import { context } from "@/lib/context";
import { useWallet } from "@solana/wallet-adapter-react";
import { useSphere } from "@spherelabs/react";
import { safeFetchDomainFromSeeds } from "@underdog-protocol/underdog-identity-sdk";
import { useEffect } from "react";

export const CheckoutWithSphereButton: React.FC<
  ButtonProps & { namespace: string; onSuccess: () => void }
> = ({ namespace, onSuccess, ...props }) => {
  const wallet = useWallet();
  const { pay, setPaymentMetadata } = useSphere();

  useEffect(() => {
    if (namespace) {
      setPaymentMetadata({ namespace: namespace.toLowerCase() });
    }
  }, [namespace, setPaymentMetadata]);

  if (!wallet.publicKey) {
    return <ConnectWalletButton {...props} />;
  }

  const handleCheckout = async () => {
    try {
      const domain = await safeFetchDomainFromSeeds(context, { namespace });

      if (domain) {
        return renderNotification({
          title: "Domain has already been purchased",
        });
      }

      await pay();
    } catch {
      renderNotification({ title: "Transaction failed" });
    }
  };

  return (
    <div>
      <Button
        type="primary"
        {...props}
        onClick={handleCheckout}
        disabled={!namespace}
      >
        Checkout
      </Button>
      <Button
        type="link"
        className="text-primary"
        onClick={() => wallet.disconnect()}
        {...props}
      >
        Select a different wallet
      </Button>
    </div>
  );
};
