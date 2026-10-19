import { z } from "zod";

export const certificationSchema = z.object({
    id: z.string(),
    education_id: z.string().nullable(),
    name: z.string(),
    issuer: z.string(),
    issued_date: z.string().nullable(),
    expires_date: z.string().nullable(),
    credential_id: z.string().nullable(),
    credential_url: z.string().nullable(),
    summary: z.string().nullable(),
    sort_order: z.number(),
});
export type Certification = z.infer<typeof certificationSchema>;
