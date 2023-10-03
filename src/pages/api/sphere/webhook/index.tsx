import crypto from 'crypto';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const requestBody = req.body;

    // get the header 'signature' from the request
    const headerSignature = req.headers['signature'];
    
    if(!headerSignature) {
        return res.status(401).json({ message: "Unauthorized" })
    }

    if(!process.env.SPHERE_SIGNING_SECRET){
        throw new Error("Env SPHERE_SIGNING_SECRET not set")
    }

    const signature = crypto
    .createHmac("sha256", Buffer.from(process.env.SPHERE_SIGNING_SECRET))
    .update(JSON.stringify(requestBody), "utf8")
    .digest("hex");

    if(signature !== headerSignature){
        return res.status(401).json({ message: "Unauthorized" })
    }

    const {
        name,
        data: {payment: {id:paymentID, status, transactions, customer}},
    } = requestBody;
    
    const {id:customerId, amountUSD} = customer
    
    // TODO: Implement the logic here

    res.status(200).json({ message: 'Webhook processed successfully' });
}
