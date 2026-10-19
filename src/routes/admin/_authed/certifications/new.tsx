import { createFileRoute } from "@tanstack/react-router";
import { NewCertificationPage } from "@/features/admin/certifications/pages/admin-certification-form-page";
import { adminHead } from "@/features/admin/lib/admin-head";

export const Route = createFileRoute("/admin/_authed/certifications/new")({
    head: () => adminHead("New certification"),
    component: NewCertificationPage,
});
