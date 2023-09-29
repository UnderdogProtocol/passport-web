import { BurnModal } from "@/components/BurnModal";
import { Container } from "@/components/Container";
import { Dropdown, DropdownProps } from "@/components/Dropdown";
import { MediaObject } from "@/components/MediaObject";
import { renderNotification } from "@/components/Notification";
import { TransferModal } from "@/components/TransferModal";
import { useAsset } from "@/hooks/useAsset";
import { useToggle } from "@/hooks/useToggle";
import { viewAssetOnXray } from "@/lib";
import { publicKey } from "@metaplex-foundation/umi";
import { useRouter } from "next/router";
import { useMemo } from "react";
import {
  HiMagnifyingGlass,
  HiOutlineArrowUpOnSquare,
  HiOutlineSquare2Stack,
  HiOutlineTrash,
  HiSquare2Stack,
} from "react-icons/hi2";

export const AssetView = () => {
  const router = useRouter();

  const mintAddress = useMemo(
    () =>
      router.query.mintAddress
        ? publicKey(router.query.mintAddress as string)
        : undefined,
    [router.query.mintAddress]
  );

  const { data: assetData } = useAsset(mintAddress);

  const [transferModalOpen, toggleTransferModalOpen] = useToggle();
  const [burnModalOpen, toggleBurnModalOpen] = useToggle();

  const dropdownItems: DropdownProps["items"] = [
    {
      children: (
        <MediaObject
          title="View on XRAY"
          media={{ icon: <HiMagnifyingGlass className="h-6 w-6" /> }}
        />
      ),
      onClick: () => assetData && viewAssetOnXray(publicKey(assetData?.id)),
    },
    {
      children: (
        <MediaObject
          title="Send"
          media={{ icon: <HiOutlineArrowUpOnSquare className="h-6 w-6" /> }}
        />
      ),
      onClick: toggleTransferModalOpen,
    },
    {
      children: (
        <MediaObject
          title="Delete"
          media={{ icon: <HiOutlineTrash className="h-6 w-6" /> }}
        />
      ),
      onClick: toggleBurnModalOpen,
    },
  ];

  return (
    <Container>
      <div className="flex justify-between items-center">
        <MediaObject
          size="4xl"
          title={assetData?.content?.metadata.name}
          media={{
            src:
              assetData?.content?.files && assetData.content.files.length > 0
                ? assetData?.content.files[0].uri
                : undefined,
            size: "md",
          }}
        />
        <Dropdown items={dropdownItems} />
      </div>

      <TransferModal
        open={transferModalOpen}
        onClose={toggleTransferModalOpen}
        size="5xl"
      />

      <BurnModal
        open={burnModalOpen}
        onClose={toggleBurnModalOpen}
        size="5xl"
      />
    </Container>
  );
};
