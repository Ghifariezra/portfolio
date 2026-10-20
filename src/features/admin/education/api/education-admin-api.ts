import { adminEducationSchema } from "@/features/admin/education/schemas/admin-education.schema";
import { createAdminResource } from "@/features/admin/lib/admin-resource";

export const educationResource = createAdminResource("education", adminEducationSchema);

export const adminEducationListQuery = educationResource.listQuery;
export const adminEducationQuery = educationResource.detailQuery;
