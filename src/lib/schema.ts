import { z } from 'zod';

export const SendMailFormSchema = z.object({
    subject: z.string().min(1,{message: "Subject is required"}),
    content: z.string().min(1,{message: "Content is required"}),
    recipients: z.string().optional(),
})

export const PaymentMetadataSchema = z.object({
    subject: z.string().min(1,{message: "Subject is required"}),
    content: z.string().min(1,{message: "Content is required"}),
    csvFileName: z.string().min(6,{message: "CSV File Name is required"}),
})