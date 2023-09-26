import "@solana/wallet-adapter-react-ui/styles.css";
import { NextPage } from "next";
import type { AppProps } from "next/app";
import { ReactElement, ReactNode } from "react";
import "@/styles/globals.css";

import { Providers } from "@/components/Providers";
import Head from "next/head";
import { Fonts } from "@/components/Fonts";
import { Toaster } from "react-hot-toast";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) {
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <>
      <Head>
        <Fonts />
      </Head>

      <Toaster />

      <Providers session={session}>
        {getLayout(<Component {...pageProps} />)}
      </Providers>
    </>
  );
}
