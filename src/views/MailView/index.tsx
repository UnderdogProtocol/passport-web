"use client";

import { Container } from "@/components/Container";
import { Input } from "@/components/Input";
import { TextArea } from "@/components/TextArea";
import { Button } from "@/components/Button";
import { FieldErrors, useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { useSphere } from "@spherelabs/react";
import { ConnectWalletButton } from "@/components/ConnectWalletButton";

type FormValues = {
  subject: string;
  content: string;
  recipients: string;
}

export const MailView: React.FC = () => {

  const form = useForm();
  const { handleSubmit, register, formState, getValues, watch } = form;
  const { errors } = formState;

  const { payPaymentLink } = useSphere();
  // const { setLineItemQuantity, lineItems, pay, subtotal, discount } =
  //   useSphere();

  const formSubmit = async (data: FormValues) => {
    console.log("Form submitted");

    const { subject, content, recipients } = data;

    const result = await fetch("/api/gcp/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recipients: recipients
      }),
    });

    console.log(await result.json());
    

    try {
      const res = await payPaymentLink({
        lineItemQuantities: [
          {
            lineItemId: "lineItem_b62f464f29c3469f8cf8bfecec7cb00b",
            quantity: 1
          }
        ],
        metadata:{
          hello: "world"
        }
      })

      console.log(res);
    } catch (e) {
      console.log(e);
    }

  };

  const onError = (errors: FieldErrors<FormValues>) => {
    console.log("Form errors", errors);
  };

  return (
    <Container className="space-y-4">
      <ConnectWalletButton type="secondary" className="flex-shrink-0" />
      <form onSubmit={handleSubmit(formSubmit, onError)} noValidate>

        <input
          {...register("subject", {
            required: { value: true, message: "Subject is required" },
          })}
        />

        <textarea {...register("content", {
          required: { value: true, message: "Content is required" },
        })} rows={10}
        />

        <textarea {...register("recipients", {
          required: { value: true, message: "Recipients is required" },
        })} rows={10}
        />

        <Button type="primary" htmlType="submit">Submit</Button>

      </form>
    </Container>
  );
};
