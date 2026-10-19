import { createFileRoute } from "@tanstack/react-router";
import { ProjectDetailPage } from "@/features/projects/pages/project-detail-page";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/projects/$slug")({
    head: ({ params }) => pageHead(params.slug),
    component: ProjectRoute,
});

function ProjectRoute() {
    const { slug } = Route.useParams();
    return <ProjectDetailPage slug={slug} />;
}
