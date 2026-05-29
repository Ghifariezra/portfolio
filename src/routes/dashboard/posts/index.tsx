import { createFileRoute } from "@tanstack/react-router";
import { RouteComponent } from "@/lib/features/dashboard/posts";

export const Route = createFileRoute("/dashboard/posts/")({
	component: RouteComponent,
});
