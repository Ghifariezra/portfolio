import { createFileRoute } from "@tanstack/react-router";
import { NewExperiencePage } from "@/features/admin/experiences/pages/admin-experience-form-page";
import { adminHead } from "@/features/admin/lib/admin-head";

export const Route = createFileRoute("/admin/_authed/experiences/new")({
    head: () => adminHead("New experience"),
    component: NewExperiencePage,
});
