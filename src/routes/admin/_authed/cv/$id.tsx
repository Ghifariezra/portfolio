import { createFileRoute } from "@tanstack/react-router";
import { EditCvVariantPage } from "@/features/admin/cv/pages/admin-cv-variant-form-page";
import { adminHead } from "@/features/admin/lib/admin-head";

export const Route = createFileRoute("/admin/_authed/cv/$id")({
    head: () => adminHead("Edit CV variant"),
    component: EditRoute,
});

function EditRoute() {
    const { id } = Route.useParams();
    return <EditCvVariantPage id={id} />;
}
