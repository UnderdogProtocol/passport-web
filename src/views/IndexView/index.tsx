import { Container } from "@/components/Container";
import { LoadingPage } from "@/components/LoadingPage";
import { apps } from "@/lib/constants";
import { Header } from "@/components/MediaObject/Header";
import { MediaObject } from "@/components/MediaObject";
import { HiDevicePhoneMobile, HiOutlineGlobeAlt } from "react-icons/hi2";
import Link from "next/link";
import { useUserContext } from "@/contexts/user";

export const IndexView: React.FC = () => {
  const { user } = useUserContext();

  if (!user) return <LoadingPage />;

  return (
    <Container className="py-8 space-y-8">
      <MediaObject
        title="Applications"
        size="4xl"
        media={{ icon: <HiDevicePhoneMobile className="text-light h-8 w-8" /> }}
      />

      <div className="grid grid-cols-4 gap-8">
        {Object.entries(apps).map(([namespace, { title, src }]) => (
          <Link href={namespace} key={title}>
            <div className="bg-dark-light p-8 rounded-lg">
              <img src={src} className="p-8" />
              <Header title={title} size="3xl" />
            </div>
          </Link>
        ))}
      </div>
    </Container>
  );
};
