import { createFileRoute } from "@tanstack/react-router";
import { EditEducationPage } from "@/features/admin/education/pages/admin-education-form-page";
import { adminHead } from "@/features/admin/lib/admin-head";

export const Route = createFileRoute("/admin/_authed/education/$id")({
    head: () => adminHead("Edit education"),
    component: EditRoute,
});

function EditRoute() {
    const { id } = Route.useParams();
    return <EditEducationPage id={id} />;
}
