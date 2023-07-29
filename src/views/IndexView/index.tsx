import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { Dropdown, DropdownProps } from "@/components/Dropdown";
import { LoadingSection } from "@/components/LoadingSection";
import { MediaObject } from "@/components/MediaObject";
import { Modal } from "@/components/Modal";
import { useNftsByOwnerAddress } from "@/hooks/useNftsByOwnerAddress";
import { findUnderdogPda, shortenAddress, sleep } from "@/lib";
import axios from "axios";
import { DAS } from "helius-sdk";
import { signOut, useSession } from "next-auth/react";
import { useMemo, useState } from "react";

export const IndexView: React.FC = () => {
  const { data: session } = useSession();
  const [minting, setMinting] = useState(false);
  const underdogUserPda = useMemo(
    () =>
      session?.user?.email
        ? findUnderdogPda([Buffer.from(session.user.email)])
        : undefined,
    [session?.user?.email]
  );

  const { data, isLoading, refetch } = useNftsByOwnerAddress(underdogUserPda);

  const [nft, setNft] = useState<DAS.GetAssetResponse>();

  const handleMintNft = async () => {
    setMinting(true);
    await axios.post(
      "https://dev.underdogprotocol.com/v2/projects/1/nfts",
      {
        name: "Underdog NFT",
        symbol: "UPDOG",
        image: "https://picsum.photos/200",
        receiverAddress: underdogUserPda?.toBase58(),
      },
      {
        headers: {
          Authorization: `Bearer 03c4c1cf444acf.f9a4567eb8ac46f5bd6a8077192c6a04`,
        },
      }
    );

    for (let i = 0; i < 9; i++) {
      await refetch();
      await sleep(1000);
    }

    setMinting(false);
  };

  const dropdownItems: DropdownProps["items"] = [
    {
      children: "Copy Address",
      size: "sm",
      onClick: () =>
        navigator.clipboard.writeText(underdogUserPda?.toBase58() || ""),
    },
    {
      children: "View on Solscan",
      size: "sm",
      onClick: () =>
        window.open(
          `https://solscan.io/account/${underdogUserPda?.toBase58()}?cluster=devnet`
        ),
    },
    {
      children: "Sign Out",
      size: "sm",
      onClick: () => signOut(),
    },
  ];

  if (session?.user?.email && underdogUserPda) {
    return (
      <>
        <div className="py-2 bg-primary flex justify-center">
          <span>
            Underdog Protocol ID is in beta and only supports Solana Devnet -
            proceed with caution
          </span>
        </div>
        <Container size="lg" className="py-8">
          <div className="flex justify-between items-center">
            <MediaObject
              media={{ src: session.user.image || undefined }}
              title={session.user.email}
              description={shortenAddress(underdogUserPda)}
            />
            <Dropdown items={dropdownItems} />
          </div>

          <hr className="my-4 border border-dark-accent" />
          <Modal open={!!nft} onClose={() => setNft(undefined)}>
            <div className="bg-dark p-8 rounded-lg border-dark-accent border space-y-4">
              <MediaObject
                media={{
                  src: nft?.content?.files ? nft?.content?.files[0].uri : "",
                }}
                title={nft?.content?.metadata.name}
                description={nft?.content?.metadata.symbol}
                size="xl"
              />
              <div className="grid">
                <Button type="secondary" disabled size="sm">
                  Send
                </Button>
              </div>
            </div>
          </Modal>

          {isLoading ? (
            <LoadingSection />
          ) : (
            <div className="space-y-8">
              <div className="flex justify-center">
                <Button
                  type="secondary"
                  className="self-center"
                  onClick={handleMintNft}
                  disabled={minting}
                >
                  {minting ? "Minting your NFT..." : "Mint a Random NFT"}
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-1">
                {data?.items
                  .filter(
                    (item) =>
                      item?.content?.files && item.content.files.length > 0
                  )
                  .map((item) => (
                    <button
                      className="relative pb-[100%] rounded-md overflow-hidden hover:opacity-50"
                      key={item.id}
                      onClick={() => setNft(item)}
                    >
                      <img
                        className="absolute h-full w-full object-cover"
                        src={item?.content?.files && item.content.files.length > 0 ? item?.content?.files[0].uri : ""}
                      />
                    </button>
                  ))}
              </div>
            </div>
          )}
        </Container>
      </>
    );
  }
};
