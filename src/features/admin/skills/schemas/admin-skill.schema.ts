import { z } from "zod";
import { skillSchema } from "@/features/portfolio/schemas/skill.schema";

/** Bentuk publik + field yang hanya terlihat di admin (skill tersembunyi ikut muncul). */
export const adminSkillSchema = skillSchema.extend({
    is_visible: z.boolean(),
});
export type AdminSkill = z.infer<typeof adminSkillSchema>;
