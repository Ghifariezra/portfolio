import { createFileRoute } from "@tanstack/react-router";
import { adminHead } from "@/features/admin/lib/admin-head";
import { AdminSkillsPage } from "@/features/admin/skills/pages/admin-skills-page";

export const Route = createFileRoute("/admin/_authed/skills/")({
    head: () => adminHead("Skills"),
    component: AdminSkillsPage,
});
