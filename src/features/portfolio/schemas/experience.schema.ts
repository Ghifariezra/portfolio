import { z } from "zod";
import { skillRefSchema } from "@/lib/schemas/skill-ref.schema";

export const EMPLOYMENT_TYPES = ["full_time", "part_time", "internship", "freelance", "contract"] as const;

export const experienceSchema = z.object({
    id: z.string(),
    company: z.string(),
    position: z.string(),
    employment_type: z.enum(EMPLOYMENT_TYPES),
    location: z.string().nullable(),
    start_date: z.string(),
    end_date: z.string().nullable(),
    summary: z.string().nullable(),
    sort_order: z.number(),
    bullets: z.array(z.string()),
    skills: z.array(skillRefSchema),
});
export type Experience = z.infer<typeof experienceSchema>;
