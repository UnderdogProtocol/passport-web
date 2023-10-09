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

// type FormValues = {
//   subject: string;
//   content: string;
//   recipients: string;
// }

type FormValues = z.infer<typeof SendMailFormSchema>;

export const MailView: React.FC = () => {

  const form = useForm<FormValues>({
    resolver: zodResolver(SendMailFormSchema),
  });
  const { handleSubmit, register, formState, getValues, watch } = form;
  const { errors } = formState;

  const mintAddresses: string[] = []

  const { payPaymentLink } = useSphere();

  const formSubmit = async (data: FormValues) => {
    console.log("Form submitted");

    const { subject, content, recipients } = data;
    console.log(subject);
    console.log(content);
    

    if(recipients && recipients.split(",").length > 0){
      console.log(recipients);
      console.log("Split");
      
      mintAddresses.push(...recipients.split(",").filter((item) => item.trim().length > 0))
    }

    if(mintAddresses.length == 0){
      alert("No recipients found");
      return;
    }

    if(mintAddresses.length > 1000){
      alert("Max 1000 recipients allowed");
      return;
    }

    console.log(mintAddresses);

    for(let i=0;i<mintAddresses.length;i++){
      try{
        
        // Clean up the address
        const addressValue = mintAddresses[i].replace(/(\r\n|\n|\r)/gm, "");

        // Check if address is valid
        new PublicKey(addressValue);

        // Replace the address with the cleaned up one
        mintAddresses[i] = addressValue;

      }catch(e){
        alert(`Value ${mintAddresses[i]} is not a valid Solana address`);
        return;
      }
    }

    const result = await fetch("/api/gcp/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recipients: mintAddresses.join(","),
      }),
    });

    const { data: response, error } = await result.json();

    if (error) {
      console.log(error[0].message);
      alert(error[0].message)
      return;
    }

    console.log("JSON file name");
    console.log(response[0].fileName);

    try {
      const res = await payPaymentLink({
        lineItemQuantities: [
          {
            lineItemId: "lineItem_b62f464f29c3469f8cf8bfecec7cb00b",
            quantity: 1
          }
        ],
        metadata: {
          subject: subject,
          content: content,
          csvFileName: response[0].fileName,
        }
      })

      console.log(res);
    } catch (e: any) {
      console.log(e);
      alert(e.message)
    }

  };

  const onError = (errors: FieldErrors<FormValues>) => {
    console.log("Form errors", errors);
  };

  const csvValidation = () => {
    var fileInput = document.getElementById('csvFile') as HTMLInputElement;

    var filePath = fileInput?.value;

    var allowedExtensions = /(\.csv)$/i;

    if (!allowedExtensions.exec(filePath)) {
      alert(`Only CSV Allowed`);
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
      alert("Invalid CSV file");
    }

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
          required: { value: false, message: "Recipients is required" },
        })} rows={10}
        />

        <input
          id="csvFile"
          name="csvFile"
          type="file"
          className="cursor-pointer"
          onChange={(e) => {
            csvValidation();
          }}
        />

        <Button type="primary" htmlType="submit">Submit</Button>

      </form>
    </Container>
  );
};
