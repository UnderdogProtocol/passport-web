import { getLayout } from "@/components/Layout";
import { IndexView } from "@/views/IndexView";

export default function IndexPage() {
  return <IndexView />;
}

IndexPage.getLayout = getLayout;
