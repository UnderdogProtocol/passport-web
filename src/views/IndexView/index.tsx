import { Container } from "@/components/Container";
import { LoadingPage } from "@/components/LoadingPage";
import { apps } from "@/lib/constants";
import { Header } from "@/components/MediaObject/Header";
import { MediaObject } from "@/components/MediaObject";
import { HiDevicePhoneMobile, HiEnvelope } from "react-icons/hi2";
import Link from "next/link";
import { useUserContext } from "@/contexts/user";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import MailListView from "../MailListView";

export const IndexView: React.FC = () => {
  const { user } = useUserContext();

  if (!user) return <LoadingPage />;

  const mintAddresses = [
    "3tZu3iprEmDSbHWiZHKjHcU9bFpwgbvC61BZ1rbM15ok",
    "Aq8WBoNf2KoNwA14zV4LdSRhHyeWxJ2omjdQGcJMGuXK",
    "9B5qGF6pr9YgYkuL6BnKRFLb6vTmG8iTk5fgJ2bV6uE2",
    "FuhuXxkkDeUEVe45eoE6KyTEwBkpKk4NRtTkgEbBk3Ym",
  ];

  const getRandomIndex = () => Math.floor(Math.random() * mintAddresses.length);

  const mintAddress = mintAddresses[getRandomIndex()];

  return (
    <Container className="py-8 space-y-8">
      <Card className="p-4 flex items-center justify-between">
        <MediaObject
          size="2xl"
          media={{
            src: `https://updg8.com/imgdata/${mintAddress}`,
          }}
          title="Collect art for free with your Passport"
          description="Sign in with the same email and art will be dropped to your public Passport address"
        />

        <Button
          type="secondary"
          onClick={() =>
            window.open(`https://shop.underdogprotocol.com/${mintAddress}`)
          }
        >
          Visit Shop
        </Button>
      </Card>

      <MediaObject
        title="Applications"
        size="4xl"
        media={{ icon: <HiDevicePhoneMobile className="text-light h-8 w-8" /> }}
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
        {Object.entries(apps).map(([namespace, { title, src }]) => (
          <Link href={namespace} key={title}>
            <div className="bg-dark-light p-4 rounded-lg">
              <img src={src} className="p-4" />
              <Header title={title} size="xl" />
            </div>
          </Link>
        ))}
      </div>

      <div className="flex justify-between">
        <MediaObject
          title="Inbox"
          size="4xl"
          media={{ icon: <HiEnvelope className="text-light h-8 w-8" /> }}
        />
        <Link href="/mail">
          <Button type="secondary">Compose</Button>
        </Link>
      </div>

      <MailListView />
    </Container>
  );
};
