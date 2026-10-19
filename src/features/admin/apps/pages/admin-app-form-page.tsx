import { useQuery } from "@tanstack/react-query";
import { AdminEditGate } from "../../components/admin-edit-gate";
import { AdminPageHeader } from "../../components/admin-page-header";
import { adminAppQuery } from "../api/app-admin-api";
import { AppForm } from "../components/app-form";
import { emptyAppForm, toAppForm } from "../lib/app-form-state";

export function NewAppPage() {
    return (
        <section>
            <AdminPageHeader title="New app" />
            <AppForm initial={emptyAppForm} appId={null} />
        </section>
    );
}

export function EditAppPage({ id }: { id: string }) {
    const query = useQuery(adminAppQuery(id));

    return (
        <AdminEditGate query={query} entity="app" title={(a) => a.name}>
            {(data) => <AppForm key={data.id} initial={toAppForm(data)} appId={data.id} />}
        </AdminEditGate>
    );
}
