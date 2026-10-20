import { useQuery } from "@tanstack/react-query";
import { adminCertificationQuery } from "@/features/admin/certifications/api/certification-admin-api";
import { CertificationForm } from "@/features/admin/certifications/components/certification-form";
import {
    emptyCertificationForm,
    toCertificationForm,
} from "@/features/admin/certifications/lib/certification-form-state";
import { AdminEditGate } from "@/features/admin/components/admin-edit-gate";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";

export function NewCertificationPage() {
    return (
        <section>
            <AdminPageHeader title="New certification" />
            <CertificationForm initial={emptyCertificationForm} certificationId={null} />
        </section>
    );
}

export function EditCertificationPage({ id }: { id: string }) {
    const query = useQuery(adminCertificationQuery(id));

    return (
        <AdminEditGate query={query} entity="certification" title={(c) => c.name}>
            {(data) => (
                <CertificationForm key={data.id} initial={toCertificationForm(data)} certificationId={data.id} />
            )}
        </AdminEditGate>
    );
}
