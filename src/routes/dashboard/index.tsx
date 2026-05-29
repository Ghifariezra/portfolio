import { createFileRoute } from "@tanstack/react-router";
import { RouteComponent } from "@/lib/features/dashboard/overview";

export const Route = createFileRoute("/dashboard/")({
	component: RouteComponent,
});
