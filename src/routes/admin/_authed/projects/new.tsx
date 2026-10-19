import { createFileRoute } from "@tanstack/react-router";
import { adminHead } from "@/features/admin/lib/admin-head";
import { NewProjectPage } from "@/features/admin/projects/pages/admin-project-form-page";

export const Route = createFileRoute("/admin/_authed/projects/new")({
    head: () => adminHead("New project"),
    component: NewProjectPage,
});
