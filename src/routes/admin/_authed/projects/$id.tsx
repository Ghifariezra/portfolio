import { createFileRoute } from "@tanstack/react-router";
import { adminHead } from "@/features/admin/lib/admin-head";
import { EditProjectPage } from "@/features/admin/projects/pages/admin-project-form-page";

export const Route = createFileRoute("/admin/_authed/projects/$id")({
    head: () => adminHead("Edit project"),
    component: EditRoute,
});

function EditRoute() {
    const { id } = Route.useParams();
    return <EditProjectPage id={id} />;
}
