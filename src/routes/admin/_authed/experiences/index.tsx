import { createFileRoute } from "@tanstack/react-router";
import { AdminExperiencesPage } from "@/features/admin/experiences/pages/admin-experiences-page";
import { adminHead } from "@/features/admin/lib/admin-head";

export const Route = createFileRoute("/admin/_authed/experiences/")({
    head: () => adminHead("Experience"),
    component: AdminExperiencesPage,
});
