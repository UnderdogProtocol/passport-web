import { Container } from "@/components/Container";
import { LoadingPage } from "@/components/LoadingPage";
import { MediaObject } from "@/components/MediaObject";
import { useUserContext } from "@/contexts/user";
import { useNftsByOwnerAddress } from "@/hooks/useNftsByOwnerAddress";
import { HiLockClosed, HiOutlineSquares2X2 } from "react-icons/hi2";
import Link from "next/link";

export const AppView: React.FC = () => {
  const { user, address, namespace, app } = useUserContext();

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
        {data?.items
          .filter((item) => !item.burnt)
          .map((item) => (
            <Link
              href={`/${namespace}/${item.id}`}
              className="relative pb-[100%] rounded-md overflow-hidden hover:opacity-50"
              key={item.id}
            >
              <img
                className="absolute h-full w-full object-cover"
                src={item.content?.links?.image}
                alt="img"
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
