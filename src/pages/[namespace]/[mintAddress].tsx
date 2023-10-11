import { getLayout } from "@/components/AppLayout";
import { MailAssetView } from "@/views/MailAssetView";

export default function AssetPage() {
  return <MailAssetView />;
}

AssetPage.getLayout= getLayout;
