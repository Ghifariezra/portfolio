import { createFileRoute } from "@tanstack/react-router";
import { RouteComponent } from "@/lib/features/dashboard/projects/index";

export const Route = createFileRoute("/dashboard/projects/")({
	component: RouteComponent,
});
