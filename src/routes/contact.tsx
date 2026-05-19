import { createFileRoute } from "@tanstack/react-router";
import { RouteComponent } from "@/lib/features/contact";

export const Route = createFileRoute("/contact")({
	head: () => ({
		meta: [
			{
				title: "Contact | Ghifari Ezra Ramadhan",
			},
			{
				name: "description",
				content:
					"Hubungi Ghifari Ezra Ramadhan — Software Developer berbasis Jakarta. Terbuka untuk peluang kerja, kolaborasi proyek, dan diskusi teknis seputar web development dan data engineering.",
			},
			{
				name: "keywords",
				content:
					"contact, hire, ghifari ezra ramadhan, software developer, jakarta, web developer, freelance, collaboration, data engineer",
			},
			// Open Graph
			{ property: "og:type", content: "website" },
			{ property: "og:title", content: "Contact | Ghifari Ezra Ramadhan" },
			{
				property: "og:description",
				content:
					"Terbuka untuk peluang kerja, kolaborasi proyek, dan diskusi teknis. Mari membangun sesuatu yang luar biasa bersama.",
			},
			{ property: "og:url", content: "https://ezdev.xyz/contact" },
			// Twitter Card
			{ name: "twitter:card", content: "summary" },
			{ name: "twitter:title", content: "Contact | Ghifari Ezra Ramadhan" },
			{
				name: "twitter:description",
				content:
					"Terbuka untuk peluang kerja, kolaborasi proyek, dan diskusi teknis.",
			},
		],
		links: [
			{ rel: "icon", href: "/favicon.ico" },
			{ rel: "canonical", href: "https://ezdev.xyz/contact" },
		],
	}),
	component: RouteComponent,
});
