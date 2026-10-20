import { adminAppSchema } from "@/features/admin/apps/schemas/admin-app.schema";
import { createAdminResource } from "@/features/admin/lib/admin-resource";

export const appResource = createAdminResource("apps", adminAppSchema);

export const adminAppsQuery = appResource.listQuery;
export const adminAppQuery = appResource.detailQuery;
