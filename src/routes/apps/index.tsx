import { createFileRoute } from "@tanstack/react-router";
import { RouteComponent } from "@/lib/features/apps";

export const Route = createFileRoute("/apps/")({
	component: RouteComponent,
});
