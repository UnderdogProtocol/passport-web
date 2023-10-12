import { z } from 'zod';

export const SendMailFormSchema = z.object({
    subject: z.string().min(1,{message: "Subject is required"}),
    content: z.string().min(1,{message: "Content is required"}),
    recipients: z.string().optional(),
})

export const PaymentMetadataSchema = z.object({
    subject: z.string().min(1,{message: "Subject is required"}),
    content: z.string().min(1,{message: "Content is required"}),
    passportAddress: z.string().min(1,{message: "Passport Address is required"}),
    csvFileName: z.string().min(6,{message: "CSV File Name is required"}),
    sentAt: z.string().min(6,{message: "Sent At is required"}),
})

export const MailSchema = z.object({
    assets: z.object({
        items: z.array(z.any()),
        limit: z.number(),
        page: z.number(),
        total: z.number()
    })
})