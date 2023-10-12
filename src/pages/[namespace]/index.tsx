import { getLayout } from "@/components/AppLayout";
import { AppView } from "@/views/AppView";
import { MailView } from "@/views/MailView";
import { useRouter } from "next/router";
import { SphereProvider } from "@spherelabs/react";

export default function AppPage() {
  console.log("HERE")
  const router = useRouter();

  console.log(router.query.namespace)
  switch (router.query.namespace) {
    case "mail":
      return <SphereProvider
        paymentLinkId={
          process.env.NEXT_PUBLIC_PAYMENT_LINK_ID ||
          "paymentLink_56f6ab59e26341d4aa98e30c21497fde"
        }
      >
        <MailView />
      </SphereProvider>;

    default:
      return <AppView />;
  }
}

AppPage.getLayout = getLayout;
