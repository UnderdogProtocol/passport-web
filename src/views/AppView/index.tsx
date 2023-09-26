import { Container } from "@/components/Container";
import { useMemo } from "react";
import { LoadingPage } from "@/components/LoadingPage";
import { apps } from "@/lib/constants";
import { MediaObject } from "@/components/MediaObject";
import { useUserContext } from "@/contexts/user";
import { useRouter } from "next/router";
import { useNftsByOwnerAddress } from "@/hooks/useNftsByOwnerAddress";

export const AppView: React.FC = () => {
  const router = useRouter();

  const { user, address } = useUserContext();
  const app = useMemo(
    () =>
      router.query.namespace
        ? apps[router.query.namespace as string]
        : undefined,
    [router]
  );

  const { data } = useNftsByOwnerAddress(address);

  if (!(user && app)) return <LoadingPage />;

  return (
    <Container className="py-8 space-y-8">
      <MediaObject title={app.title} size="4xl" media={{ src: app.src }} />

      <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-1">
        {data?.items.map((item) => (
          <button
            className="relative pb-[100%] rounded-md overflow-hidden hover:opacity-50"
            key={item.id}
            onClick={() =>
              window.open(`https://xray.helius.xyz/token/${item.id}`)
            }
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
    </Container>
  );
};
