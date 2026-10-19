import { createAdminResource } from "@/features/admin/lib/admin-resource";
import { adminCertificationSchema } from "../schemas/admin-certification.schema";

export const certificationResource = createAdminResource("certifications", adminCertificationSchema);

export const adminCertificationsQuery = certificationResource.listQuery;
export const adminCertificationQuery = certificationResource.detailQuery;
