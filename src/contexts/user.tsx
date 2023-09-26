import { context } from "@/lib/context";
import { PublicKey } from "@metaplex-foundation/umi";
import { findLinkPda } from "@underdog-protocol/underdog-identity-sdk";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { createContext, ReactNode, useContext, useMemo, useState } from "react";

export type UserContextProps = {
  user: Omit<User, "id"> | undefined;
  address: PublicKey | undefined;
};

export const UserContext = createContext<UserContextProps>({
  user: undefined,
  address: undefined,
});

export const useUserContext = () => useContext(UserContext);

type UserProviderProps = {
  children: ReactNode;
};

export function UserProvider({ children }: UserProviderProps) {
  const router = useRouter();

  const session = useSession();
  const user = useMemo(() => session?.data?.user, [session]);

  const address = useMemo(() => {
    if (router.query.namespace && user?.email) {
      return findLinkPda(context, {
        namespace: router.query.namespace as string,
        identifier: user.email,
      })[0];
    }
  }, [user, router.query.namespace]);

  return (
    <UserContext.Provider value={{ user, address }}>
      {children}
    </UserContext.Provider>
  );
}
