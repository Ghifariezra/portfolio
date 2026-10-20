import { createFileRoute } from "@tanstack/react-router";
import { queryClient } from "@/app/query-client";
import { SITE } from "@/config/site";
import { projectQuery } from "@/features/projects/api/project-queries";
import { ProjectDetailPage } from "@/features/projects/pages/project-detail-page";
import { pageHead, seoHead } from "@/lib/seo";

export const Route = createFileRoute("/projects/$slug")({
    // Data masuk cache yang sama dengan useProject(), jadi halaman tidak fetch dua kali.
    // Gagal (404/jaringan) -> null; ErrorState di halaman yang menangani.
    loader: ({ params }) => queryClient.ensureQueryData(projectQuery(params.slug)).catch(() => null),
    head: ({ params, loaderData }) => {
        const path = `/projects/${params.slug}`;
        if (!loaderData) return pageHead(params.slug, undefined, path);
        return seoHead({
            title: `${loaderData.title} | ${SITE.fullName}`,
            description: loaderData.description ?? undefined,
            path,
            image: loaderData.image_url,
        });
    },
    component: ProjectRoute,
});

function ProjectRoute() {
    const { slug } = Route.useParams();
    return <ProjectDetailPage slug={slug} />;
}
