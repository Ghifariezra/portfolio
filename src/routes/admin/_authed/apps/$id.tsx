import { createFileRoute } from "@tanstack/react-router";
import { EditAppPage } from "@/features/admin/apps/pages/admin-app-form-page";
import { adminHead } from "@/features/admin/lib/admin-head";

export const Route = createFileRoute("/admin/_authed/apps/$id")({
    head: () => adminHead("Edit app"),
    component: EditRoute,
});

function EditRoute() {
    const { id } = Route.useParams();
    return <EditAppPage id={id} />;
}
