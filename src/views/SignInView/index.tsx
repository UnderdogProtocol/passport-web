import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
// import { SignInWithWalletButton } from "@/components/SignInWithWalletButton";
import { Container } from "@/components/Container";
import { Logo } from "@/components/Logo";
import { Header } from "@/components/MediaObject/Header";
import { signIn } from "next-auth/react";

export const SignInView: React.FC = () => {
  return (
    <Container size="xl" className="h-screen flex items-center justify-center">
      <Card className="p-12 space-y-8 w-full">
        <div className="flex justify-center flex-col space-y-4">
          <Logo full dark className="flex justify-center" />
          <Header title="Collect digital assets without a web3 wallet" size="xl" className="mx-auto" />
        </div>

        <div className="space-y-2">
          <div className="grid grid-cols-3 gap-2">
            <Button type="white" onClick={() => signIn("google", { callbackUrl: "/" })}>
              <img
                alt="google"
                src="https://storage.googleapis.com/underdog-protocol/logos/google/icon.svg"
                className="h-6 w-6"
              />
            </Button>
            <Button type="white" onClick={() => signIn("twitter", { callbackUrl: "/" })}>
              <img
                alt="x"
                src="https://storage.googleapis.com/underdog-protocol/logos/x/icon.png"
                className="h-5 w-5"
              />
            </Button>
            <Button type="white" onClick={() => signIn("reddit", { callbackUrl: "/" })}>
              <img
                alt="reddit"
                src="https://storage.googleapis.com/underdog-protocol/logos/reddit/icon.png"
                className="h-6 w-6"
              />
            </Button>
          </div>
        </div>
      </Card>
    </Container>
  );
};
