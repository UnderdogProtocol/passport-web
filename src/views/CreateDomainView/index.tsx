import { Container } from "@/components/Container";
import { MediaObject } from "@/components/MediaObject";
import { Button } from "@/components/Button";
import { CreateDomainForm } from "./CreateDomainForm";

export const CreateDomainView: React.FC = () => {
  return (
    <Container size="2xl" className="py-16 space-y-8">
      <div className="space-y-2">
        <MediaObject
          title="Create Passport Domain"
          description="For a limited time, we are offering early partners the opportunity for lifetime ownership over a Passport Domain (normally 10 USDC / month). By owning a Passport Domain, you can activate Passports within your domain in your own application."
          size="2xl"
        />

        <Button
          type="link"
          className="text-primary p-0"
          onClick={() =>
            window.open("https://underdog.readme.io/reference/passport")
          }
        >
          Learn More about Passport
        </Button>
      </div>

      <CreateDomainForm />
    </Container>
  );
};
