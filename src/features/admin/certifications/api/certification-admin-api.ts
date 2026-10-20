import { adminCertificationSchema } from "@/features/admin/certifications/schemas/admin-certification.schema";
import { createAdminResource } from "@/features/admin/lib/admin-resource";

export const certificationResource = createAdminResource("certifications", adminCertificationSchema);

export const adminCertificationsQuery = certificationResource.listQuery;
export const adminCertificationQuery = certificationResource.detailQuery;
