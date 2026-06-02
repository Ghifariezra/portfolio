import { createFileRoute } from "@tanstack/react-router";
import { RouteComponent } from "@/lib/features/dashboard/apps/edit";

export const Route = createFileRoute("/dashboard/apps/edit/$appId")({
	component: RouteComponent,
});
