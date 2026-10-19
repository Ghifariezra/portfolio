import { useQuery } from "@tanstack/react-query";
import { AdminEditGate } from "../../components/admin-edit-gate";
import { AdminPageHeader } from "../../components/admin-page-header";
import { adminExperienceQuery } from "../api/experience-admin-api";
import { ExperienceForm } from "../components/experience-form";
import { emptyExperienceForm, toExperienceForm } from "../lib/experience-form-state";

export function NewExperiencePage() {
    return (
        <section>
            <AdminPageHeader title="New experience" />
            <ExperienceForm initial={emptyExperienceForm} experienceId={null} />
        </section>
    );
}

export function EditExperiencePage({ id }: { id: string }) {
    const query = useQuery(adminExperienceQuery(id));

    return (
        <AdminEditGate query={query} entity="experience" title={(e) => e.position}>
            {/* key: form dibuat ulang kalau yang dibuka item lain, state lama tidak terbawa */}
            {(data) => <ExperienceForm key={data.id} initial={toExperienceForm(data)} experienceId={data.id} />}
        </AdminEditGate>
    );
}
