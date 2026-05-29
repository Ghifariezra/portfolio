import { createFileRoute } from "@tanstack/react-router";
import { RouteComponent } from "@/lib/features/dashboard/settings";

export const Route = createFileRoute("/dashboard/settings")({
	component: RouteComponent,
});
