import { createFileRoute } from "@tanstack/react-router";
import { RouteComponent } from "@/lib/features/dashboard/apps/create";

export const Route = createFileRoute("/dashboard/apps/create")({
	component: RouteComponent,
});
