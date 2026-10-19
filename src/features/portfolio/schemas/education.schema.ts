import { z } from "zod";
import { skillRefSchema } from "@/lib/schemas/skill-ref.schema";

export const EDUCATION_KINDS = ["formal", "training"] as const;

export const educationSchema = z.object({
    id: z.string(),
    institution: z.string(),
    program: z.string(),
    kind: z.enum(EDUCATION_KINDS),
    location: z.string().nullable(),
    start_date: z.string(),
    end_date: z.string().nullable(),
    grade: z.string().nullable(),
    summary: z.string().nullable(),
    sort_order: z.number(),
    bullets: z.array(z.string()),
    skills: z.array(skillRefSchema),
});
export type Education = z.infer<typeof educationSchema>;
