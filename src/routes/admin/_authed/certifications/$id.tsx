import { createFileRoute } from "@tanstack/react-router";
import { EditCertificationPage } from "@/features/admin/certifications/pages/admin-certification-form-page";
import { adminHead } from "@/features/admin/lib/admin-head";

export const Route = createFileRoute("/admin/_authed/certifications/$id")({
    head: () => adminHead("Edit certification"),
    component: EditRoute,
});

function EditRoute() {
    const { id } = Route.useParams();
    return <EditCertificationPage id={id} />;
}
