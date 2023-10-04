import { Container } from "@/components/Container";
import { Input } from "@/components/Input";
import { TextArea } from "@/components/TextArea";

export const MailView: React.FC = () => {
  return (
    <Container className="space-y-4">
      <Input label="Subject" help="Subject of your mail" />
      <TextArea label="Content" help="Content of your mail" rows={10} />
    </Container>
  );
};
