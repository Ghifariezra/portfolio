import { createFileRoute } from "@tanstack/react-router";
import { RouteComponent } from "@/lib/features/dashboard/projects/create";

export const Route = createFileRoute("/dashboard/projects/create")({
	component: RouteComponent,
});
