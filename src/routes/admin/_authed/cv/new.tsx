import { createFileRoute } from "@tanstack/react-router";
import { NewCvVariantPage } from "@/features/admin/cv/pages/admin-cv-variant-form-page";
import { adminHead } from "@/features/admin/lib/admin-head";

export const Route = createFileRoute("/admin/_authed/cv/new")({
    head: () => adminHead("New CV variant"),
    component: NewCvVariantPage,
});
