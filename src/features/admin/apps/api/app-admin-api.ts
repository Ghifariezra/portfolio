import { createAdminResource } from "@/features/admin/lib/admin-resource";
import { adminAppSchema } from "../schemas/admin-app.schema";

export const appResource = createAdminResource("apps", adminAppSchema);

export const adminAppsQuery = appResource.listQuery;
export const adminAppQuery = appResource.detailQuery;
