import { createFileRoute } from "@tanstack/react-router";
import { AdminEducationPage } from "@/features/admin/education/pages/admin-education-page";
import { adminHead } from "@/features/admin/lib/admin-head";

export const Route = createFileRoute("/admin/_authed/education/")({
    head: () => adminHead("Education"),
    component: AdminEducationPage,
});
