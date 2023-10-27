import { getLayout } from "@/components/AppLayout";
import { AssetView } from "@/views/AssetView";
import { MailAssetView } from "@/views/MailAssetView";
import { SphereProvider } from "@spherelabs/react";
import { useRouter } from "next/router";

export default function AssetPage() {
  const router = useRouter();
  console.log("NAMESPACE");
  console.log(router.query.namespace);

  switch (router.query.namespace) {
    case "mail":
      return (
        <SphereProvider
          paymentLinkId={
            process.env.NEXT_PUBLIC_PAYMENT_LINK_ID ||
            "paymentLink_56f6ab59e26341d4aa98e30c21497fde"
          }
        >
          <MailAssetView />
        </SphereProvider>
      );
    default:
      return <AssetView />;
  }
}

AssetPage.getLayout = getLayout;
