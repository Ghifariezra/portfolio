import { createFileRoute } from "@tanstack/react-router";
import { AdminCvVariantsPage } from "@/features/admin/cv/pages/admin-cv-variants-page";
import { adminHead } from "@/features/admin/lib/admin-head";

export const Route = createFileRoute("/admin/_authed/cv/")({
    head: () => adminHead("CV"),
    component: AdminCvVariantsPage,
});
