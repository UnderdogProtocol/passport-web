import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { Dropdown, DropdownProps } from "@/components/Dropdown";
import { LoadingSection } from "@/components/LoadingSection";
import { MediaObject } from "@/components/MediaObject";
import { Modal } from "@/components/Modal";
import { useContext } from "@/hooks/useContext";
import { useNftsByOwnerAddress } from "@/hooks/useNftsByOwnerAddress";
import { shortenAddress, sleep } from "@/lib";
import { findLinkPda, transferAssetV0 } from "@underdog-protocol/underdog-identity-sdk";
import axios from "axios";
import { DAS } from "helius-sdk";
import { signOut, useSession } from "next-auth/react";
import { useMemo, useState } from "react";
import { faker } from "@faker-js/faker";
import { PublicKey } from "@metaplex-foundation/umi";

export const IndexView: React.FC = () => {
  const context = useContext();
  const { data: session } = useSession();
  const [minting, setMinting] = useState(false);
  const linkPda = useMemo(
    () =>
      session?.user?.email
        ? findLinkPda(context, { identifier: session.user.email })[0]
        : undefined,
    [session?.user?.email, context]
  );

  const { data, isLoading, refetch } = useNftsByOwnerAddress(linkPda);

  console.log(data);

  const [nft, setNft] = useState<DAS.GetAssetResponse>();

  const handleMintNft = async () => {
    setMinting(true);

    await axios.post("/api/create-nft");

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
        navigator.clipboard.writeText(linkPda || ""),
    },
    {
      children: "View on Solscan",
      size: "sm",
      onClick: () =>
        window.open(
          `https://solscan.io/account/${linkPda}`
        ),
    },
    {
      children: "View on XRAY",
      size: "sm",
      onClick: () =>
        window.open(
          `https://xray.helius.xyz/account/${linkPda}`
        ),
    },
    {
      children: "Sign Out",
      size: "sm",
      onClick: () => signOut(),
    },
  ];

  const transfer = async (mintAddress: PublicKey) => {
    const response = await axios.post("/api/transfer", { mintAddress });
    console.log(response);
  }

  if (session?.user?.email && linkPda) {
    return (
      <>
        <Container size="lg" className="py-8">
          <div className="flex justify-between items-center">
            <MediaObject
              media={{ src: session.user.image || undefined }}
              title={session.user.email}
              description={shortenAddress(linkPda)}
            />
            <Dropdown items={dropdownItems} />
          </div>

          <hr className="my-4 border border-dark-accent" />
          <Modal open={!!nft} onClose={() => setNft(undefined)}>
            <div className="bg-dark p-8 rounded-lg border-dark-accent border space-y-4">
              <MediaObject
                // media={{
                //   src: ,
                // }}
                title={nft?.content?.metadata.name}
                description={nft?.content?.metadata.symbol}
                size="xl"
              />
              <div className="grid">
                <Button type="secondary" size="sm" onClick={() => transfer(nft?.id)}>
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
                  .map((item) => (
                    <button
                      className="relative pb-[100%] rounded-md overflow-hidden hover:opacity-50"
                      key={item.id}
                      onClick={() => window.open(`https://xray.helius.xyz/token/${item.id}`)}
                    >
                      <img
                        className="absolute h-full w-full object-cover"
                        src={
                          item.content
                            ? item.content.json_uri.replace("jsondata", "imgdata")
                            : "https://updg8.com/imgdata/8QfUaoNPNwjEAKHkXvBUrjQaqiRf7MmpRWUHuQdMZyXj"
                        }
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
