import { adminExperienceSchema } from "@/features/admin/experiences/schemas/admin-experience.schema";
import { createAdminResource } from "@/features/admin/lib/admin-resource";

export const experienceResource = createAdminResource("experiences", adminExperienceSchema);

export const adminExperiencesQuery = experienceResource.listQuery;
export const adminExperienceQuery = experienceResource.detailQuery;
