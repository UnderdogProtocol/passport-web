import { createRouter } from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import * as HttpStatus from "http-status"

import { Storage } from '@google-cloud/storage';

const gcpConfigBase64 = process.env.GCP_STORAGE_CONFIG;

const gcpConfig = JSON.parse(Buffer.from(gcpConfigBase64!, 'base64').toString('utf-8'));

export const gcpStorage = new Storage({
    credentials: gcpConfig,
});

const router = createRouter<NextApiRequest, NextApiResponse>();

router.post(async (req, res) => {

    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: "You must be logged in." });
    }

    const { recipients } = req.body;

    if(!recipients || recipients.trim().length === 0) {
        return res.status(HttpStatus.BAD_REQUEST).json({ data: null, error: [{ message: "Invalid recipients" }]});
    }

    // Generates 6 character random string for filename
    const fileName = `mail/${(Math.random() + 1).toString(36).substring(6)}.csv`;

    const bucket = gcpStorage.bucket("underdog-public");
    const file = bucket.file(fileName);
  
    
    await file.save(recipients, {
      contentType: 'text/csv',
    }, (err)=>{
        if(err) {
            console.log(err);
            return res.status(500).json({ data: null, error: [{ message: "Error saving file" }]});
        }
    });

    return res.status(HttpStatus.OK).json({ data: [{fileName}], error: null });
});

export default router.handler();