import { z } from "zod";
import { educationSchema } from "@/features/portfolio/schemas/education.schema";

/** Bentuk publik + field yang hanya terlihat di admin. */
export const adminEducationSchema = educationSchema.extend({
    is_visible: z.boolean(),
});
export type AdminEducation = z.infer<typeof adminEducationSchema>;
