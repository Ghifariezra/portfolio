import { createAdminResource } from "@/features/admin/lib/admin-resource";
import { adminExperienceSchema } from "../schemas/admin-experience.schema";

export const experienceResource = createAdminResource("experiences", adminExperienceSchema);

export const adminExperiencesQuery = experienceResource.listQuery;
export const adminExperienceQuery = experienceResource.detailQuery;
