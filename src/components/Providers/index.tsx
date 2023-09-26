import { UserProvider } from "@/contexts/user";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "react-query";

export type ProvidersProps = {
  children: React.ReactNode;
  session: Session;
};

const queryClient = new QueryClient();

export const Providers: React.FC<ProvidersProps> = ({ children, session }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        <UserProvider>{children}</UserProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
};
