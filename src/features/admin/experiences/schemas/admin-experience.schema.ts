import { z } from "zod";
import { experienceSchema } from "@/features/portfolio/schemas/experience.schema";

/** Bentuk publik + field yang hanya terlihat di admin. */
export const adminExperienceSchema = experienceSchema.extend({
    is_visible: z.boolean(),
});
export type AdminExperience = z.infer<typeof adminExperienceSchema>;
