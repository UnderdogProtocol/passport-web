import { Providers } from "@/components/Providers";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <>
    <Head><title>ID | Underdog Protocol</title></Head>
      <Providers session={session}>
        <Component {...pageProps} />
      </Providers>
    </>
  );
}
