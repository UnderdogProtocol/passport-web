import crypto from 'crypto';
import { NextApiRequest, NextApiResponse } from 'next';
import { gcpStorage } from '../../gcp/upload';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log("IN WEBHOOK HANDLER API");

    const requestBody = req.body;


    // get the header 'signature' from the request
    const headerSignature = req.headers['signature'];

    if (!headerSignature) {
        return res.status(401).json({ message: "Unauthorized" })
    }

    if (!process.env.SPHERE_SIGNING_SECRET) {
        throw new Error("Env SPHERE_SIGNING_SECRET not set")
    }

    // create a signature from the request body and verify it
    const signature = crypto
        .createHmac("sha256", Buffer.from(process.env.SPHERE_SIGNING_SECRET))
        .update(JSON.stringify(requestBody), "utf8")
        .digest("hex");

    if (signature !== headerSignature) {
        return res.status(401).json({ message: "Unauthorized" })
    }

    const {
        name,
        data: { payment: { id: paymentID, status, transactions, customer, meta } },
    } = requestBody;

    const { id: customerId, amountUSD } = customer

    const { csvFileName, subject, content: description } = meta
    const bucket = gcpStorage.bucket("underdog-public");
    const file = bucket.file(csvFileName);

    const fileExists = await file.exists();

    if (fileExists[0]) {
        const [content] = await file.download();


        const mintAddresses = content.toString().split(",").map((address) => {
            return { receiverAddress: address.replace(/(\r\n|\n|\r)/gm, "") }
        })

        console.log(mintAddresses);
        console.log(subject);
        console.log(content);


        fetch(`${process.env.UNDERDOG_API_URL}/v2/projects/50/nfts/batch`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "accept": "application/json",
                "authorization": `Bearer ${process.env.UNDERDOG_API_KEY}`
            },
            body: JSON.stringify({
                mintAddresses,
                name: subject,
                description: description,
                image: process.env.MAIL_IMAGE,
                batch: mintAddresses
            }),
        }).then(async (res) => {
            const response = await res.json();

            console.log(JSON.stringify(response));
            console.log(res.status);

        })


    } else {
        console.log(`File '${csvFileName}' does not exist in the bucket.`);
    }

    // TODO: Implement the logic here
    console.log('Webhook processed successfully');

    res.status(200).json({ message: 'Webhook processed successfully' });
}
