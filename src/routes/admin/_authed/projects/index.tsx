import { createFileRoute } from "@tanstack/react-router";
import { adminHead } from "@/features/admin/lib/admin-head";
import { AdminProjectsPage } from "@/features/admin/projects/pages/admin-projects-page";

export const Route = createFileRoute("/admin/_authed/projects/")({
    head: () => adminHead("Projects"),
    component: AdminProjectsPage,
});
