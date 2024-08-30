import { Container } from "@/components/Container";
import { LoadingPage } from "@/components/LoadingPage";
import { MediaObject } from "@/components/MediaObject";
import { useUserContext } from "@/contexts/user";
import { HiLockClosed, HiOutlineSquares2X2 } from "react-icons/hi2";
import Link from "next/link";
import { useAssetsByOwner } from "@/hooks/useAssetsByOwner";
import axios from "axios";
import { useEffect, useState } from "react";

export const Asset = ({ item, namespace }: { item: any; namespace: string }) => {
  const [image, setImage] = useState("");

  useEffect(() => {
    axios.get(item.content.json_uri).then((res) => setImage(res.data.image));
  }, []);

  return (
    <Link
      href={`/${namespace}/${item.id}`}
      className="relative pb-[100%] rounded-md overflow-hidden hover:opacity-50"
      key={item.id}
    >
      <img className="absolute h-full w-full object-cover" src={image} alt="img" />
      {item.ownership.delegated && (
        <HiLockClosed className="absolute bottom-0 right-0 text-light m-2 h-5 w-5" />
      )}
    </Link>
  );
};

export const AppView: React.FC = () => {
  const { user, address, namespace, app } = useUserContext();

  const { data } = useAssetsByOwner(address);

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
          .map((item) => <Asset key={item.id} item={item} namespace={namespace || ""} />)}
      </div>
    </Container>
  );
};
