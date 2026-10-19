import { createFileRoute } from "@tanstack/react-router";
import { AdminAppsPage } from "@/features/admin/apps/pages/admin-apps-page";
import { adminHead } from "@/features/admin/lib/admin-head";

export const Route = createFileRoute("/admin/_authed/apps/")({
    head: () => adminHead("Apps"),
    component: AdminAppsPage,
});
