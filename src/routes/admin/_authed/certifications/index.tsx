import { createFileRoute } from "@tanstack/react-router";
import { AdminCertificationsPage } from "@/features/admin/certifications/pages/admin-certifications-page";
import { adminHead } from "@/features/admin/lib/admin-head";

export const Route = createFileRoute("/admin/_authed/certifications/")({
    head: () => adminHead("Certifications"),
    component: AdminCertificationsPage,
});
