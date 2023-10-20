import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Label } from "@/components/Label";
import { MediaObject } from "@/components/MediaObject";
import {
  DOMAIN_PARTNER_CODE_SOL,
  DOMAIN_PARTNER_CODE_USDC,
  paymentLinks,
} from "@/lib/sphere/constants";
import { SphereProvider } from "@spherelabs/react";
import { useForm } from "react-hook-form";
import { CheckoutWithSphereButton } from "./CheckoutWithSphereButton";
import { useEffect, useState } from "react";
import { useToggle } from "@/hooks/useToggle";
import { HiCheckCircle } from "react-icons/hi2";

export type CreateDomainFormFields = {
  namespace: string;
  code?: string;
  payWith: "sol" | "usdc";
};

export const CreateDomainForm: React.FC = () => {
  const [success, toggleSuccess] = useToggle();

  const { watch, reset, register, formState: { errors }, setValue } = useForm<CreateDomainFormFields>({
    defaultValues: { payWith: "sol" },
  });

  const [paymentLinkId, setPaymentLinkId] = useState(paymentLinks.domain.usdc);

  const { payWith, code, namespace } = watch();

  useEffect(() => {
    if (payWith === "sol") {
      setPaymentLinkId(
        code === DOMAIN_PARTNER_CODE_SOL
          ? paymentLinks.domain.partner.sol
          : paymentLinks.domain.sol
      );
    } else {
      setPaymentLinkId(
        code === DOMAIN_PARTNER_CODE_USDC
          ? paymentLinks.domain.partner.usdc
          : paymentLinks.domain.usdc
      );
    }
  }, [payWith, code]);

  if (success) {
    return (
      <div className="flex flex-col items-center space-y-4">
        <HiCheckCircle className="text-primary text-7xl" />
        <MediaObject
          title="Your domain has been successfully purchased!"
          size="2xl"
        />
        <Button
          type="secondary"
          onClick={() => {
            toggleSuccess();
            reset();
          }}
        >
          Buy another domain
        </Button>
      </div>
    );
  }

  return (
    <form className="space-y-4">
      <Input
        label="Namespace"
        placeholder="Namespace (e.g. solarplex, underdog, drip)"
        {...register("namespace", { required: true })}
      />

      <Input label="Partner Code" error={errors.code} {...register("code")} />

      <div className="space-y-0.5">
        <Label label="Select Payment Method" />
        <div className="grid grid-cols-2 gap-2">
          <Button
            size="sm"
            type={payWith === "sol" ? "secondary" : "default"}
            onClick={() => setValue("payWith", "sol")}
          >
            <MediaObject
              title="SOL"
              media={{
                src: "https://assets.coingecko.com/coins/images/21629/large/solana.jpg",
                size: "xs",
              }}
            />
          </Button>
          <Button
            type={payWith === "usdc" ? "secondary" : "default"}
            onClick={() => setValue("payWith", "usdc")}
          >
            <MediaObject
              title="USDC"
              media={{
                src: "https://assets.coingecko.com/coins/images/6319/large/usdc.png",
                size: "xs",
              }}
            />
          </Button>
        </div>
      </div>

      <SphereProvider paymentLinkId={paymentLinkId}>
        <CheckoutWithSphereButton
          block
          namespace={namespace}
          onSuccess={toggleSuccess}
        />
      </SphereProvider>
    </form>
  );
};
