import { z } from "zod";

/** Referensi skill yang disematkan di project, app, experience, dan education. */
export const skillRefSchema = z.object({
    id: z.string(),
    name: z.string(),
    category: z.string(),
});
export type SkillRef = z.infer<typeof skillRefSchema>;
