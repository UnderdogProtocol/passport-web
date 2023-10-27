import { ReactElement, ReactNode } from "react";
import { ActivateModal } from "@/views/AppView/ActivateModal";
import { useToggle } from "@/hooks/useToggle";
import { useUserContext } from "@/contexts/user";
import Layout from "../Layout";
import { DescriptionList } from "../DescriptionList";
import { Card } from "../Card";
import { Button } from "../Button";
import { Badge } from "../Badge";
import { MediaObject } from "../MediaObject";
import { Container } from "../Container";
import { LoadingPage } from "../LoadingPage";
import { AddressLink } from "../AddressLink";

export const AppLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activating, toggleActivating] = useToggle();

  const { user, address, account, app } = useUserContext();

  if (!(user && app && address)) return <LoadingPage />;

  const items = [
    {
      title: "Address",
      description: <AddressLink address={address} showXray />,
    },
  ];

  if (account) {
    items.push({
      title: "Linked Wallet",
      description: <AddressLink address={account.address} showXray />,
    });
  }

  return (
    <Layout>
      <Container className="grid lg:grid-cols-3 gap-8 py-4">
        <div className="lg:col-span-2 row-start-2 lg:row-start-1 space-y-8">
          {children}
        </div>

        <div className="space-y-8">
          <Card className="p-4">
            <div className="flex justify-between items-center">
              <MediaObject
                title={app.title}
                size="2xl"
                media={{ src: app.src, size: "lg" }}
              />
              {account ? (
                <Badge size="sm" type="primary">
                  Active
                </Badge>
              ) : (
                <Button type="secondary" size="sm" onClick={toggleActivating}>
                  Activate
                </Button>
              )}
            </div>
          </Card>

          <Card className="p-4">
            <DescriptionList items={items} />
          </Card>
        </div>

        <ActivateModal
          open={activating}
          onClose={toggleActivating}
          size="5xl"
        />
      </Container>
    </Layout>
  );
};

export const getLayout = (page: ReactElement) => <AppLayout>{page}</AppLayout>;
