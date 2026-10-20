import { useQuery } from "@tanstack/react-query";
import { AdminEditGate } from "@/features/admin/components/admin-edit-gate";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { adminEducationQuery } from "@/features/admin/education/api/education-admin-api";
import { EducationForm } from "@/features/admin/education/components/education-form";
import { emptyEducationForm, toEducationForm } from "@/features/admin/education/lib/education-form-state";

export function NewEducationPage() {
    return (
        <section>
            <AdminPageHeader title="New education" />
            <EducationForm initial={emptyEducationForm} educationId={null} />
        </section>
    );
}

export function EditEducationPage({ id }: { id: string }) {
    const query = useQuery(adminEducationQuery(id));

    return (
        <AdminEditGate query={query} entity="education" title={(e) => e.program}>
            {(data) => <EducationForm key={data.id} initial={toEducationForm(data)} educationId={data.id} />}
        </AdminEditGate>
    );
}
