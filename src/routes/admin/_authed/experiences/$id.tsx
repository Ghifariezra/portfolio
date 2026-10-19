import { createFileRoute } from "@tanstack/react-router";
import { EditExperiencePage } from "@/features/admin/experiences/pages/admin-experience-form-page";
import { adminHead } from "@/features/admin/lib/admin-head";

export const Route = createFileRoute("/admin/_authed/experiences/$id")({
    head: () => adminHead("Edit experience"),
    component: EditRoute,
});

function EditRoute() {
    const { id } = Route.useParams();
    return <EditExperiencePage id={id} />;
}
