"use client";

import { Container } from "@/components/Container";
import { Input } from "@/components/Input";
import { TextArea } from "@/components/TextArea";
import { Button } from "@/components/Button";
import { FieldErrors, useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { useSphere } from "@spherelabs/react";
import { ConnectWalletButton } from "@/components/ConnectWalletButton";
import { PublicKey } from "@solana/web3.js";
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { SendMailFormSchema } from '@/lib/schema'
import { useUserContext } from "@/contexts/user";
import { getPassportAddress } from "@underdog-protocol/passport";
import axios from "axios";
import httpStatus from "http-status";
import { useState } from "react";
import { Spin } from "@/components/Spin";
import { renderNotification } from "@/components/Notification";


type FormValues = z.infer<typeof SendMailFormSchema>;

export const MailView: React.FC = () => {

  const form = useForm<FormValues>({
    resolver: zodResolver(SendMailFormSchema),
  });
  const { handleSubmit, register, formState, getValues, watch } = form;
  const { errors } = formState;
  const [loading, setLoading] = useState(false);

  const { address: userPassportAddress } = useUserContext();

  const mintAddresses: string[] = []

  const { payPaymentLink } = useSphere();

  const formSubmit = async (data: FormValues) => {
    console.log("Form submitted");
    setLoading(true);

    const { subject, content, recipients } = data;
    console.log(subject);
    console.log(content);


    if (recipients && recipients.split(",").length > 0) {
      console.log(recipients);
      console.log("Split");

      mintAddresses.push(...recipients.split(",").filter((item) => item.trim().length > 0))
    }

    if (mintAddresses.length == 0) {
      renderNotification({
        title: "No recipients found",
        description: `Please enter the recipients address`,
      })
      setLoading(false);
      return;
    }

    if (mintAddresses.length > 1000) {
      renderNotification({
        title: "Max 1000 recipients allowed",
        description: `Please reduce the number of recipients`,
      })
      setLoading(false);
      return;
    }

    console.log(mintAddresses);

    for (let i = 0; i < mintAddresses.length; i++) {
      try {

        // If email address, convert to passport address
        if (z.string().email().safeParse(mintAddresses[i].trim().toLowerCase()).success) {

          const passportAddress = getPassportAddress({ namespace: "mail", identifier: mintAddresses[i].trim().toLowerCase() })

          mintAddresses[i] = passportAddress;

          continue
        }

        // Clean up the address
        const addressValue = mintAddresses[i].trim().replace(/(\r\n|\n|\r)/gm, "");

        // Check if address is valid
        new PublicKey(addressValue);

        // Replace the address with the cleaned up one
        mintAddresses[i] = addressValue;

      } catch (e) {
        renderNotification({
          title: "Invalid Address",
          description: `Value ${mintAddresses[i]} is not a valid Solana/Email address`,
        })
        setLoading(false);
        return;
      }
    }

    const result = await axios.post('/api/gcp/upload', {
      recipients: mintAddresses.join(',')
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (result.status !== httpStatus.OK) {
      console.log(result.data);
      setLoading(false);
      renderNotification({
        title: "Something went wrong",
        description: `Please try again`,
      })
      return
    }

    const response = result.data;

    console.log("JSON file name");
    console.log(response.data[0].fileName);

    try {
      const res = await payPaymentLink({
        lineItemQuantities: [
          {
            lineItemId: `${process.env.NEXT_PUBLIC_SPHERE_LINE_ITEM}`,
            quantity: mintAddresses.length,
          }
        ],
        metadata: {
          subject: subject,
          content: content,
          csvFileName: response.data[0].fileName,
          passportAddress: userPassportAddress,
          sentAt: new Date().toISOString(),
        }
      })

      console.log(res);

      if (res) {
        renderNotification({
          title: "Mail sent successfully",
        })
        form.reset();
        setLoading(false);
      }

    } catch (e: any) {
      console.log(e);
      setLoading(false);
      renderNotification({
        title: "Error",
        description: `${e.message}`,
      })
    }

  };

  const onError = (errors: FieldErrors<FormValues>) => {
    setLoading(false);
    console.log("Form errors", errors);
  };

  const csvValidation = () => {
    var fileInput = document.getElementById('csvFile') as HTMLInputElement;

    var filePath = fileInput?.value;

    var allowedExtensions = /(\.csv)$/i;

    if (!allowedExtensions.exec(filePath)) {
      renderNotification({
        title: "Only CSV File Allowed",
        description: "Please upload a valid CSV file",
      })
      fileInput.value = '';
      return false;
    }

    if (fileInput!.files!.length > 0) {
      var file = fileInput!.files![0];
      var reader = new FileReader();
      reader.onload = function (event) {
        var fileContent = event!.target!.result?.toString();
        mintAddresses.push(...fileContent!.split(","))
        console.log(mintAddresses);

      };

      reader.readAsText(file);
      fileInput.value = "";
    } else {
      renderNotification({
        title: "Invalid CSV File",
        description: "Please upload a valid CSV file",
      })
    }

  };

  return (
    <Container className="space-y-4">
      <ConnectWalletButton type="secondary" className="flex-shrink-0" />
      <form onSubmit={handleSubmit(formSubmit, onError)} noValidate className="space-y-6">
        <Input label="Subject" help="Subject of your mail" className="text-light"
          {...register("subject", {
            required: { value: true, message: "Subject is required" },
          })}
          error={errors.subject}
        />

        <TextArea label="Content" help="Content of your mail" className="text-light" rows={10}
          {...register("content", {
            required: { value: false, message: "Content is required" },
          })}
          error={errors.content}
        />

        <TextArea label="Recipients Address" help="Receivers of your mail" className="text-light" rows={6}
          {...register("recipients", {
            required: { value: false, message: "Recipients is required" },
          })}
          error={errors.recipients}
        />

        {/* Uncomment this to enable CSV file upload */}
        {/* <Input
          id="csvFile"
          name="csvFile"
          type="file"
          htmlType="file"
          label="CSV File"
          help="CSV file containing the recipients address"
          className="cursor-pointer text-light"
          onChange={(e) => {
            csvValidation();
          }}
        /> */}


        {loading ? (
          <Spin />
        ) : (
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        )}

      </form>
    </Container>
  );
};
