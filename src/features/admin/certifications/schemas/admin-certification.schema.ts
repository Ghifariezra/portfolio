import { z } from "zod";
import { certificationSchema } from "@/features/portfolio/schemas/certification.schema";

/** Bentuk publik + field yang hanya terlihat di admin. */
export const adminCertificationSchema = certificationSchema.extend({
    is_visible: z.boolean(),
});
export type AdminCertification = z.infer<typeof adminCertificationSchema>;
