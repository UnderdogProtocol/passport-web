import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const webhookData = req.body;

    const {
        name,
        data: {payment: {id:paymentID, status, transactions, customer}},
    } = webhookData;
    
    const {id:customerId, amountUSD} = customer
    
    // TODO: Implement the logic here

    res.status(200).json({ message: 'Webhook processed successfully' });
}
