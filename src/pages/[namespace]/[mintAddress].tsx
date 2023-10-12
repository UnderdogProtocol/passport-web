import { getLayout } from "@/components/AppLayout";
import { AssetView } from "@/views/AssetView";
import { MailAssetView } from "@/views/MailAssetView";
import { useRouter } from "next/router";

export default function AssetPage() {

  const router = useRouter();
console.log("NAMESPACE");
console.log(router.query.namespace);

  switch (router.query.namespace) {
    case "mail":
      return <MailAssetView />;
    default:
      return <AssetView />;
  }
}

AssetPage.getLayout = getLayout;
