import { BurnModal } from "@/components/BurnModal";
import { Card } from "@/components/Card";
import { Container } from "@/components/Container";
import { Dropdown, DropdownProps } from "@/components/Dropdown";
import { LoadingPage } from "@/components/LoadingPage";
import { MediaObject } from "@/components/MediaObject";
import { Header } from "@/components/MediaObject/Header";
import { TransferModal } from "@/components/TransferModal";
import { useAsset } from "@/hooks/useAsset";
import { useToggle } from "@/hooks/useToggle";
import { viewAssetOnXray } from "@/lib";
import { publicKey } from "@metaplex-foundation/umi";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { HiMagnifyingGlass, HiOutlineArrowUpOnSquare, HiOutlineTrash } from "react-icons/hi2";

export function AssetView() {
  const router = useRouter();

  const mintAddress = useMemo(
    () => (router.query.mintAddress ? publicKey(router.query.mintAddress as string) : undefined),
    [router.query.mintAddress],
  );

  const { data: assetData, isLoading } = useAsset(mintAddress);
  const [metadata, setMetadata] = useState<{
    image: string;
    attributes: any;
    description: string;
    name: string;
  }>();

  useEffect(() => {
    if (assetData?.content?.json_uri) {
      axios.get(assetData?.content.json_uri).then((res) => setMetadata(res.data));
    }
  });

  const [transferModalOpen, toggleTransferModalOpen] = useToggle();
  const [burnModalOpen, toggleBurnModalOpen] = useToggle();

  const dropdownItems: DropdownProps["items"] = [
    {
      children: (
        <MediaObject title="View on XRAY" media={{ icon: <HiMagnifyingGlass className="h-6 w-6" /> }} />
      ),
      onClick: () => assetData && viewAssetOnXray(publicKey(assetData?.id)),
    },
    {
      children: (
        <MediaObject title="Send" media={{ icon: <HiOutlineArrowUpOnSquare className="h-6 w-6" /> }} />
      ),
      onClick: toggleTransferModalOpen,
    },
    {
      children: <MediaObject title="Delete" media={{ icon: <HiOutlineTrash className="h-6 w-6" /> }} />,
      onClick: toggleBurnModalOpen,
    },
  ];

  if (!assetData || isLoading) return <LoadingPage />;

  return (
    <Container className="space-y-8">
      <div className="flex justify-between items-center">
        <MediaObject size="4xl" title={assetData?.content?.metadata?.name} />
        <Dropdown items={dropdownItems} />
      </div>

      <div className="grid grid-cols-2 gap-8">
        <img src={metadata?.image} alt="NFT Img" className="w-full h-full object-cover rounded-md" />
        <div className="w-full">
          <div className="mb-4">
            <Header title={metadata?.description || ""} />
          </div>

          <div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              {metadata?.attributes?.map((attribute: any) => (
                <Card className="p-4 overflow-scroll">
                  <MediaObject title={attribute.trait_type} description={attribute.value} />
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      <TransferModal open={transferModalOpen} onClose={toggleTransferModalOpen} size="5xl" />
      <BurnModal open={burnModalOpen} onClose={toggleBurnModalOpen} size="5xl" />
    </Container>
  );
}
