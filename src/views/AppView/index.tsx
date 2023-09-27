import { Container } from "@/components/Container";
import { LoadingPage } from "@/components/LoadingPage";
import { MediaObject } from "@/components/MediaObject";
import { useUserContext } from "@/contexts/user";
import { useNftsByOwnerAddress } from "@/hooks/useNftsByOwnerAddress";
import { shortenAddress } from "@/lib";
import { HiLockClosed, HiOutlineSquares2X2 } from "react-icons/hi2";
import { Card } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { DescriptionList } from "@/components/DescriptionList";
import { ActivateModal } from "./ActivateModal";
import { useToggle } from "@/hooks/useToggle";
import Link from "next/link";

export const AppView: React.FC = () => {
  const [activating, toggleActivating] = useToggle();

  const { user, address, account, namespace, app } = useUserContext();

  const { data } = useNftsByOwnerAddress(address);

  if (!(user && app && address)) return <LoadingPage />;

  return (
    <Container className="space-y-8">
      <MediaObject
        title="Assets"
        size="4xl"
        media={{
          icon: <HiOutlineSquares2X2 className="text-light h-8 w-8" />,
        }}
      />

      <div className="grid grid-cols-3 sm:grid-cols-5 gap-1">
        {data?.items.map((item) => (
          <Link
            href={`/${namespace}/${item.id}`}
            className="relative pb-[100%] rounded-md overflow-hidden hover:opacity-50"
            key={item.id}
          >
            <img
              className="absolute h-full w-full object-cover"
              src={
                item.content
                  ? item.content.json_uri.replace("jsondata", "imgdata")
                  : "https://updg8.com/imgdata/8QfUaoNPNwjEAKHkXvBUrjQaqiRf7MmpRWUHuQdMZyXj"
              }
            />
            {item.ownership.delegated && (
              <HiLockClosed className="absolute bottom-0 right-0 text-light m-2 h-5 w-5" />
            )}
          </Link>
        ))}
      </div>
    </Container>
  );
};
