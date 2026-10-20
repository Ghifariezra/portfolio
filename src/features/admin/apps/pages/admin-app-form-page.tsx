import { useQuery } from "@tanstack/react-query";
import { adminAppQuery } from "@/features/admin/apps/api/app-admin-api";
import { AppForm } from "@/features/admin/apps/components/app-form";
import { emptyAppForm, toAppForm } from "@/features/admin/apps/lib/app-form-state";
import { AdminEditGate } from "@/features/admin/components/admin-edit-gate";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";

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
