import { PublicKey } from "@metaplex-foundation/umi";
import { UNDERDOG_PROTOCOL_LOGOS_URL } from "@/lib/constants";
import { sizeToDimensionsClassName } from "@/lib/tailwind";
import { shortenAddress, viewAccountOnXray, viewAssetOnXray } from "@/lib";
import clsx from "clsx";
import Image from "next/image";
import { Tooltip } from "../Tooltip";
import { renderNotification } from "../Notification";

type AddressLinkProps = {
  address: PublicKey;
  asset?: boolean;
  className?: string;
  showExplorer?: boolean;
  showXray?: boolean;
};

export function AddressLink({
  className,
  address,
  asset,
  showExplorer = false,
  showXray = false,
}: AddressLinkProps) {
  const publicKeyLinkClassName = clsx("flex items-center space-x-2", className);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(address);
    renderNotification({
      title: "Copied address to clipboard",
      description: shortenAddress(address),
    });
  };

  return (
    <div className={publicKeyLinkClassName}>
      {/* {showExplorer && (
        <Tooltip text="Open in Explorer">
          <button
            onClick={() => viewAccountOnExplorer(publicKey.toString(), network)}
            className="flex-shrink-0"
          >
            <img
              src={`${UNDERDOG_PROTOCOL_LOGOS_URL}/solana/icon.svg`}
              className={sizeToDimensionsClassName["xs"]}
              alt="solana"
            />
          </button>
        </Tooltip>
      )} */}

      {showXray && (
        <Tooltip text="Open in XRAY">
          <button
            type="button"
            onClick={() =>
              asset ? viewAssetOnXray(address) : viewAccountOnXray(address)
            }
            className="flex-shrink-0"
          >
            <Image
              src={`${UNDERDOG_PROTOCOL_LOGOS_URL}/xray/icon.jpeg`}
              className={sizeToDimensionsClassName.xs}
              alt="xray"
            />
          </button>
        </Tooltip>
      )}

      <Tooltip text="Copy to Clipboard">
        <button type="button" onClick={handleCopyToClipboard}>
          {shortenAddress(address)}
        </button>
      </Tooltip>
    </div>
  );
}
