import crypto from "crypto";
import { createRouter } from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import httpStatus from "http-status";
import { PaymentMetadataSchema } from "@/lib/schema";
import axios from "axios";
import { initializeDomain } from "@/lib/sphere";
import { paymentLinks } from "@/lib/sphere/constants";
import { publicKey } from "@metaplex-foundation/umi";
import { gcpStorage } from "../../gcp/upload";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.post(async (req, res) => {
  console.log("IN WEBHOOK HANDLER API");

  const requestBody = req.body;

  // get the header 'signature' from the request
  const headerSignature = req.headers.signature;

  if (!headerSignature) {
    return res
      .status(httpStatus.UNAUTHORIZED)
      .json({ message: "Unauthorized" });
  }

  if (!process.env.SPHERE_SIGNING_SECRET) {
    throw new Error("Env SPHERE_SIGNING_SECRET not set");
  }

  // create a signature from the request body and verify it
  const signature = crypto
    .createHmac("sha256", Buffer.from(process.env.SPHERE_SIGNING_SECRET))
    .update(JSON.stringify(requestBody), "utf8")
    .digest("hex");

  if (signature !== headerSignature) {
    console.log("Invalid signature");
    return res
      .status(httpStatus.UNAUTHORIZED)
      .json({ message: "Unauthorized" });
  }

  const {
    data: {
      payment: { customer, meta, paymentLink },
    },
  } = requestBody;

  switch (paymentLink.id) {
    case paymentLinks.domain.partner.sol:
    case paymentLinks.domain.partner.usdc:
    case paymentLinks.domain.sol:
    case paymentLinks.domain.usdc:
      try {
        await initializeDomain(
          publicKey(customer.solanaPubKey),
          meta.namespace,
        );
        return res.status(httpStatus.OK).json({ message: "OK" });
      } catch {
        return res.status(httpStatus.BAD_REQUEST).json({ message: "Not OK" });
      }
    default:
      // TODO: Add a default case here
      console.log("default case");
  }

  // Allow only specific payment link
  if (paymentLink.id !== `${process.env.NEXT_PUBLIC_PAYMENT_LINK_ID}`) {
    console.log("Invalid payment link");
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: "Invalid payment link" });
  }

  // Zod parsing payment metadata
  const paymentMetadata = PaymentMetadataSchema.safeParse(meta);

  if (!paymentMetadata.success) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: "Invalid payment metadata" });
  }

  const {
    csvFileName,
    subject,
    content: description,
    passportAddress,
    sentAt,
  } = meta;

  const bucket = gcpStorage.bucket("underdog-public");
  const file = bucket.file(csvFileName);

  const fileExists = await file.exists();

  if (fileExists[0]) {
    const [content] = await file.download();

    const mintAddresses = content
      .toString()
      .split(",")
      .map((address) => {
        return {
          receiverAddress: address.replace(/(\r\n|\n|\r)/gm, ""),
          attributes: {
            passportAddress,
            sentAt,
          },
        };
      });

    const result = await axios.post(
      `${process.env.UNDERDOG_API_URL}/v2/projects/${process.env.MAIL_PROJECT_ID}/nfts/batch`,
      {
        name: subject,
        description,
        image: process.env.MAIL_IMAGE,
        batch: mintAddresses,
      },
      { headers: { Authorization: `Bearer ${process.env.UNDERDOG_API_KEY}` } },
    );

    if (result.status !== httpStatus.ACCEPTED) {
      console.log(result.data);
      return res.status(result.status).json({ message: result.data });
    }

    console.log(result.data);
  } else {
    console.log(`File '${csvFileName}' does not exist in the bucket.`);
  }

  // TODO: Implement the logic here
  console.log("Webhook processed successfully");

  res.status(httpStatus.OK).json({ message: "Webhook processed successfully" });
});

export default router.handler();
