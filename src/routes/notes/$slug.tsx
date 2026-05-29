import { createFileRoute } from "@tanstack/react-router";
import { RouteComponent } from "@/lib/features/notes/slug";
import { publicService } from "@/lib/services/public.service";

export const Route = createFileRoute("/notes/$slug")({
	// 1. LOADER: Ambil data sebelum render agar SEO bisa membacanya
	loader: async ({ params }) => {
		try {
			const response = await publicService.getNoteBySlug(params.slug);
			return response.data; // Mengembalikan data BlogListItem
		} catch (_error) {
			return null;
		}
	},

	// 2. HEAD: Tangkap data dari loader untuk Injeksi Meta Tags Dinamis
	head: ({ loaderData }) => {
		const note = loaderData;

		// Fallback jika artikel tidak ditemukan
		if (!note) {
			return {
				meta: [
					{ title: "Note Not Found | Ghifari Ezra" },
					{
						name: "description",
						content: "The requested technical note could not be found.",
					},
				],
			};
		}

		// Variabel untuk mempermudah injeksi
		const title = `${note.title} | Ghifari Ezra`;
		const description =
			note.description ||
			"Technical note and exploration by Ghifari Ezra Ramadhan.";
		const url = `https://ezdev.xyz/notes/${note.slug}`;
		const keywords =
			note.tags?.map((t) => t.name).join(", ") ||
			"software development, tech notes, data engineering";

		return {
			meta: [
				{ title },
				{ name: "description", content: description },
				{ name: "keywords", content: keywords },

				// Open Graph (SEO untuk Share Link di WhatsApp/LinkedIn)
				{ property: "og:type", content: "article" },
				{ property: "og:title", content: title },
				{ property: "og:description", content: description },
				{ property: "og:url", content: url },
				...(note.image ? [{ property: "og:image", content: note.image }] : []),

				// Twitter Card
				{
					name: "twitter:card",
					content: note.image ? "summary_large_image" : "summary",
				},
				{ name: "twitter:title", content: title },
				{ name: "twitter:description", content: description },
				...(note.image ? [{ name: "twitter:image", content: note.image }] : []),
			],
			links: [{ rel: "canonical", href: url }],
		};
	},
	component: RouteComponent,
});
