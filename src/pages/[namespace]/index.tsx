import { getLayout } from "@/components/AppLayout";
import { AppView } from "@/views/AppView";
import { MailView } from "@/views/MailView";
import { useRouter } from "next/router";

export default function AppPage() {
  console.log("HERE")
  const router = useRouter();

  console.log(router.query.namespace)
  switch (router.query.namespace) {
    case "mail":
      return <MailView />;

    default:
      return <AppView />;
  }
}

AppPage.getLayout = getLayout;
