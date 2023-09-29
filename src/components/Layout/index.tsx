import Head from "next/head";
import { ReactElement, ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Container } from "../Container";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Head>
        <title>Underdog Protocol</title>
      </Head>

      <main className="flex h-screen flex-col">
        <Navbar />

        <Container className="h-full w-full overflow-y-scroll pb-16 px-4">
          {children}
        </Container>
      </main>
    </>
  );
}

export const getLayout = (page: ReactElement) => <Layout>{page}</Layout>;
