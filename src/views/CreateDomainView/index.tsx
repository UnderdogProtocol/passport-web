import { Container } from "@/components/Container";
import { CreateDomainForm } from "./CreateDomainForm";
import { MediaObject } from "@/components/MediaObject";

export const CreateDomainView: React.FC = () => {
  return (
    <Container size="2xl" className="py-16 space-y-8">
      <MediaObject 
        title="Create Domain" 
        description="Owning a domain allows you to activate Passports within your domain"
        size="2xl" 
      />

      <CreateDomainForm />
    </Container>
  );
}