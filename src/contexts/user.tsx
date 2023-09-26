import { useLinkAccount } from "@/hooks/useLinkAccount";
import { apps } from "@/lib/constants";
import { context } from "@/lib/context";
import { PublicKey, RpcAccount } from "@metaplex-foundation/umi";
import { findLinkPda } from "@underdog-protocol/underdog-identity-sdk";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { createContext, ReactNode, useContext, useMemo, useState } from "react";

export type UserContextProps = {
  user: Omit<User, "id"> | undefined;
  address: PublicKey | undefined;
  account: RpcAccount | undefined;
  app: (typeof apps)[keyof typeof apps] | undefined;
  namespace: string | undefined;
};

export const UserContext = createContext<UserContextProps>({
  user: undefined,
  address: undefined,
  account: undefined,
  app: undefined,
  namespace: undefined,
});

export const useUserContext = () => useContext(UserContext);

type UserProviderProps = {
  children: ReactNode;
};

export function UserProvider({ children }: UserProviderProps) {
  const router = useRouter();

  const namespace = useMemo(
    () => router.query.namespace as string,
    [router.query.namespace]
  );

  const session = useSession();
  const user = useMemo(() => session?.data?.user, [session]);
  const app = useMemo(
    () => (namespace ? apps[namespace] : undefined),
    [namespace]
  );

  const address = useMemo(() => {
    if (router.query.namespace && user?.email) {
      return findLinkPda(context, {
        namespace: router.query.namespace as string,
        identifier: user.email,
      })[0];
    }
  }, [user, router.query.namespace]);

  const account = useLinkAccount(address);

  return (
    <UserContext.Provider value={{ user, app, address, account, namespace }}>
      {children}
    </UserContext.Provider>
  );
}
