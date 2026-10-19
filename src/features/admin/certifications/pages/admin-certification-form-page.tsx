import { useQuery } from "@tanstack/react-query";
import { AdminEditGate } from "../../components/admin-edit-gate";
import { AdminPageHeader } from "../../components/admin-page-header";
import { adminCertificationQuery } from "../api/certification-admin-api";
import { CertificationForm } from "../components/certification-form";
import { emptyCertificationForm, toCertificationForm } from "../lib/certification-form-state";

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
