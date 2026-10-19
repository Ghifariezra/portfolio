import { z } from "zod";

export const skillSchema = z.object({
    id: z.string(),
    name: z.string(),
    category: z.string(),
    sort_order: z.number(),
});
export type Skill = z.infer<typeof skillSchema>;
