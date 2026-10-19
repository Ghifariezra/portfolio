import { createFileRoute } from "@tanstack/react-router";
import { adminHead } from "@/features/admin/lib/admin-head";
import { DashboardPage } from "@/features/admin/pages/dashboard-page";

export const Route = createFileRoute("/admin/_authed/")({
    head: () => adminHead("Dashboard"),
    component: DashboardPage,
});
