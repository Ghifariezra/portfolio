import { createFileRoute } from "@tanstack/react-router";
import { publicService } from "@/lib/services/public.service";
import { RouteComponent } from "@/lib/features/projects/slug";

export const Route = createFileRoute("/projects/$slug")({
  // 1. LOADER: Ambil data sebelum render agar SEO bisa membacanya
  loader: async ({ params }) => {
    try {
      const response = await publicService.getProjectBySlug(params.slug);
      return response.data; // Mengembalikan data ProjectListItem
    } catch (_error) {
      return null;
    }
  },

  // 2. HEAD: Tangkap data dari loader untuk Injeksi Meta Tags Dinamis
  head: ({ loaderData }) => {
    const project = loaderData;

    // Fallback jika project tidak ditemukan
    if (!project) {
      return {
        meta: [
          { title: "Project Not Found | Ghifari Ezra" },
          { name: "description", content: "The requested project could not be found." }
        ]
      };
    }

    // Variabel untuk mempermudah injeksi
    const title = `${project.title} | Ghifari Ezra`;
    const description = project.description || "Portfolio project built by Ghifari Ezra Ramadhan.";
    const url = `https://ezdev.xyz/projects/${project.slug}`;
    const keywords = project.tags?.map(t => t.name).join(", ") || "portfolio, software development, web project, ghifari ezra";

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "keywords", content: keywords },

        // Open Graph (SEO untuk Share Link di WhatsApp/LinkedIn)
        { property: "og:type", content: "website" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        ...(project.image ? [{ property: "og:image", content: project.image }] : []),

        // Twitter Card
        { name: "twitter:card", content: project.image ? "summary_large_image" : "summary" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        ...(project.image ? [{ name: "twitter:image", content: project.image }] : []),
      ],
      links: [
        { rel: "canonical", href: url }
      ]
    };
  },
  component: RouteComponent,
});