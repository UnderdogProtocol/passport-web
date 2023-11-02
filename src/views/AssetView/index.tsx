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
import { useMemo, useState } from "react";
import {
  HiMagnifyingGlass,
  HiOutlineArrowUpOnSquare,
  HiOutlineSquare2Stack,
  HiOutlineTrash,
  HiSquare2Stack,
} from "react-icons/hi2";

export function AssetView() {
  const router = useRouter();

  const mintAddress = useMemo(
    () =>
      router.query.mintAddress
        ? publicKey(router.query.mintAddress as string)
        : undefined,
    [router.query.mintAddress],
  );

  const { data: assetData } = useAsset(mintAddress);

  const [transferModalOpen, toggleTransferModalOpen] = useToggle();
  const [burnModalOpen, toggleBurnModalOpen] = useToggle();

  const [isCollapsed, setCollapsed] = useState(true);

  const attributes = [
    { title: "Attribute 1", value: "Value 1" },
    { title: "Attribute 2", value: "Value 2" },
    { title: "Attribute 3", value: "Value 3" },
    // Add more attributes here
  ];

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
          className="overflow-ellipsis"
          // media={{
          // src:
          //   assetData?.content?.files && assetData.content.files.length > 0
          //     ? assetData?.content.files[0].uri
          //     : undefined,
          // size: "md",
          // }}
        />
        <Dropdown items={dropdownItems} />
      </div>

      <div className="pt-8 text-white">
        <div className="lg:flex">
          {/* Left Column (NFT Image) */}
          <div className="w-full lg:w-1/2">
            <img
              src={
                assetData?.content?.files && assetData.content.files.length > 0
                  ? assetData?.content.files[0].uri
                  : undefined
              }
              alt="NFT Img"
              className="max-w-full h-auto rounded-xl"
            />
          </div>

          {/* Right Column (Collapsible Text and Attributes) */}
          <div className="w-full lg:w-1/2 p-4">
            <div className="mb-4">
              <div
                className={`overflow-hidden ${isCollapsed ? "h-16" : "h-auto"}`}
              >
                <p>
                  {assetData?.content?.metadata.description || (
                    <span className="italic text-gray-400">No Description</span>
                  )}
                </p>
              </div>
              <button
                onClick={() => setCollapsed(!isCollapsed)}
                className="text-gray-400 hover:underline"
              >
                {isCollapsed ? "Read more" : "Read less"}
              </button>
            </div>

            {assetData?.content?.metadata.attributes && (
              <div>
                <h2 className="text-2xl font-semibold">Attributes</h2>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  {assetData?.content?.metadata.attributes.map(
                    (attribute, index) => (
                      <div
                        key={index}
                        className="border rounded-md border-neonGreen-400 p-2"
                      >
                        <div className="font-semibold overflow-ellipsis">
                          {attribute.trait_type}
                        </div>
                        <div className="pt-2 text-neonGreen-400 w-auto overflow-ellipsis">
                          <p className="w-auto overflow-hidden">
                            {attribute.value}
                          </p>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
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
}
