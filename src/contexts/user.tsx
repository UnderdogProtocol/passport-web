import { apps } from "@/lib/constants";
import { context } from "@/lib/context";
import { PublicKey } from "@metaplex-foundation/umi";
import { getPassportAddress } from "@underdog-protocol/passport";
import {
  LinkAccountData,
  findLinkPda,
  safeFetchLinkFromSeeds,
} from "@underdog-protocol/underdog-identity-sdk";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type UserContextProps = {
  user: Omit<User, "id"> | undefined;
  address: PublicKey | undefined;
  account: LinkAccountData | undefined;
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
  const [account, setAccount] = useState<LinkAccountData>();

  const namespace = useMemo(
    () => router.query.namespace as string,
    [router.query.namespace],
  );

  const session = useSession();

  const user = useMemo(() => session?.data?.user, [session]);

  const app = useMemo(
    () => (namespace ? apps[namespace] : undefined),
    [namespace],
  );

  const address = useMemo(() => {
    if (router.query.namespace && user?.email) {
      return getPassportAddress({
        namespace: router.query.namespace as string,
        identifier: user.email,
      });
    }
  }, [user, router.query.namespace]);

  useEffect(() => {
    if (user?.email && namespace) {
      safeFetchLinkFromSeeds(context, {
        namespace,
        identifier: user.email,
      }).then((account) => account && setAccount(account));
    } else {
      setAccount(undefined);
    }
  }, [namespace, user]);

  return (
    <UserContext.Provider value={{ user, app, address, account, namespace }}>
      {children}
    </UserContext.Provider>
  );
}
