import { createFileRoute } from "@tanstack/react-router";
import { RouteComponent } from "@/lib/features/dashboard/taxonomies";

export const Route = createFileRoute("/dashboard/taxonomies")({
	component: RouteComponent,
});
