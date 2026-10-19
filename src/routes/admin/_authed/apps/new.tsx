import { createFileRoute } from "@tanstack/react-router";
import { NewAppPage } from "@/features/admin/apps/pages/admin-app-form-page";
import { adminHead } from "@/features/admin/lib/admin-head";

export const Route = createFileRoute("/admin/_authed/apps/new")({
    head: () => adminHead("New app"),
    component: NewAppPage,
});
