import { useQuery } from "@tanstack/react-query";
import { AdminEditGate } from "../../components/admin-edit-gate";
import { AdminPageHeader } from "../../components/admin-page-header";
import { adminEducationQuery } from "../api/education-admin-api";
import { EducationForm } from "../components/education-form";
import { emptyEducationForm, toEducationForm } from "../lib/education-form-state";

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
