import { getLayout } from "@/components/AppLayout";
import { AppView } from "@/views/AppView";

export default function AppPage() {
  return <AppView />;
}

AppPage.getLayout= getLayout;
