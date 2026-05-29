import { createFileRoute } from "@tanstack/react-router";
import { RouteComponent } from "@/lib/features/dashboard/posts/edit";

export const Route = createFileRoute("/dashboard/posts/edit/$postId")({
	component: RouteComponent,
});
