import { createFileRoute } from "@tanstack/react-router";
import { NewEducationPage } from "@/features/admin/education/pages/admin-education-form-page";
import { adminHead } from "@/features/admin/lib/admin-head";

export const Route = createFileRoute("/admin/_authed/education/new")({
    head: () => adminHead("New education"),
    component: NewEducationPage,
});
