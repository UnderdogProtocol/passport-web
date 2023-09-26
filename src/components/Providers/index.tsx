import { UserProvider } from "@/contexts/user";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
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
        <UserProvider>
          <ConnectionProvider endpoint="https://smart-serene-daylight.solana-mainnet.quiknode.pro/874271840b52506691067a7b8f57052e1322099b/">
            <WalletProvider wallets={[]} autoConnect>
              <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
          </ConnectionProvider>
        </UserProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
};
