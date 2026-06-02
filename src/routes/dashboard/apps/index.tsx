import { createFileRoute } from "@tanstack/react-router";
import { RouteComponent } from "@/lib/features/dashboard/apps";

export const Route = createFileRoute("/dashboard/apps/")({
	component: RouteComponent,
});
