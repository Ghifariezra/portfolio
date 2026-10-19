import { createFileRoute } from "@tanstack/react-router";
import { ProjectsPage } from "@/features/projects/pages/projects-page";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/projects/")({
    head: () => pageHead("Projects", "Projects by Ghifari Ezra Ramadhan, with live details from GitHub."),
    component: ProjectsPage,
});
