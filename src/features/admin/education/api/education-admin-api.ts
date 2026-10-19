import { createAdminResource } from "@/features/admin/lib/admin-resource";
import { adminEducationSchema } from "../schemas/admin-education.schema";

export const educationResource = createAdminResource("education", adminEducationSchema);

export const adminEducationListQuery = educationResource.listQuery;
export const adminEducationQuery = educationResource.detailQuery;
