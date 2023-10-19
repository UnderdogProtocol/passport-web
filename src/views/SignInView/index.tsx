import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { apps } from "@/lib/constants";
import { signIn } from "next-auth/react";

export const SignInView: React.FC = () => {

  const imagesToShow = [
    "liquidprop",
    "solarplex",
    "sphere",
    "superteam",
    "etherfuse",
    "urfeed",
    "intotheverse"
  ]

  return (
    <Container
      size="2xl"
      className="py-8 h-screen flex items-center justify-center"
    >
      <div className="p-12 space-y-8 bg-dark-light rounded-lg w-full">
        <img
          src={apps.underdog.src}
          alt="logo"
          className="w-32 h-32 mx-auto"
        />

        <div className="flex justify-between items">
          <div className="text-left w-64">
            <p className="text-2xl text-white text-center">Collect free digital art from top brands with just your email address</p>
          </div>
          <div className="text-right">


            <button
              onClick={() => signIn("google", { callbackUrl: "/" })}
              className="px-4 py-2 border flex gap-2 bg-white rounded-lg text-black">
              <img className="w-6 h-6" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo" />
              <span>Sign in with Google</span>
            </button>

            <button
              onClick={() => signIn("twitter", { callbackUrl: "/" })}
              className="px-4 py-2 border flex gap-2 bg-white rounded-lg text-black mt-4">
              <img className="w-6 h-6" src="https://storage.googleapis.com/underdog-protocol/logos/x/icon.png" loading="lazy" alt="twitter logo" />
              <span>Sign in with Twitter/X</span>
            </button>

          </div>
        </div>

        <div className="flex space-x-4 justify-between">
          {Object.entries(apps).map(([namespace, { title, src }]) => {
            
            if(imagesToShow.includes(namespace))
            return <img
              key={namespace}
              src={src}
              alt={title}
              className="w-12 h-12"
            />
          })}
        </div>
      </div>
    </Container>
    // <Container
    //   size="md"
    //   className="py-8 h-screen flex items-center justify-center"
    // >
    //   <div className="p-12 space-y-8 bg-dark-light rounded-lg w-full">
    //     <img
    //       src="https://storage.googleapis.com/underdog-protocol/logos/full_dark.svg"
    //       alt="logo"
    //     />

    //     <Button
    //       type="primary"
    //       size="lg"
    //       block
    //       onClick={() => signIn("google", { callbackUrl: "/" })}
    //     >
    //       Sign in with Google
    //     </Button>
    //   </div>
    // </Container>
  );
};
