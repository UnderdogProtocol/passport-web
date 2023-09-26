import { getLayout } from "@/components/Layout";
import { AppView } from "@/views/AppView";

export default function AppPage() {
  return <AppView />;
}

AppPage.getLayout= getLayout;
