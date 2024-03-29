import { UserProvider } from "@/contexts/user";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
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
  const endpoint = process.env.NEXT_PUBLIC_RPC_URL;

  return (
    <QueryClientProvider client={queryClient}>
      <ConnectionProvider
        endpoint={endpoint || "https://solana-mainnet.rpc.extrnode.com/3d7dc892-1492-4d3e-a341-ae6aa7fea478"}
      >
        <SessionProvider session={session}>
          <UserProvider>
            <WalletProvider wallets={[]} autoConnect>
              <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
          </UserProvider>
        </SessionProvider>
      </ConnectionProvider>
    </QueryClientProvider>
  );
};
