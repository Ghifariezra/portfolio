import { createFileRoute } from "@tanstack/react-router";
import { RouteComponent } from "@/lib/features/dashboard/collaborators";

export const Route = createFileRoute("/dashboard/collaborators")({
	component: RouteComponent,
});
