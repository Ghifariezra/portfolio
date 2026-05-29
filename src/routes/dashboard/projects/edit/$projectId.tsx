import { createFileRoute } from "@tanstack/react-router";
import { RouteComponent } from "@/lib/features/dashboard/projects/edit";

export const Route = createFileRoute("/dashboard/projects/edit/$projectId")({
	component: RouteComponent,
});