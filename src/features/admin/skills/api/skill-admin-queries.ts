import { createAdminResource } from "@/features/admin/lib/admin-resource";
import { adminSkillSchema } from "../schemas/admin-skill.schema";

export const skillResource = createAdminResource("skills", adminSkillSchema);

export const adminSkillKeys = skillResource.keys;

/** Semua skill termasuk yang tersembunyi; dipakai sebagai pilihan di form project/app/experience/education/CV. */
export const adminSkillsQuery = skillResource.listQuery;
