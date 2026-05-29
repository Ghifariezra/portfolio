import { createFileRoute } from "@tanstack/react-router";
import { RouteComponent } from "@/lib/features/projects";

export const Route = createFileRoute("/projects/")({
	head: () => ({
		meta: [
			{
				title: "Projects | Ghifari Ezra Ramadhan",
			},
			{
				name: "description",
				content:
					"Kumpulan proyek Ghifari Ezra Ramadhan — mencakup aplikasi web full-stack, tools berbasis TypeScript, dan eksperimen dengan React, Node.js, PostgreSQL, dan Docker.",
			},
			{
				name: "keywords",
				content:
					"projects, portfolio, react, typescript, node.js, nestjs, postgresql, docker, redis, web scraping, ghifari ezra ramadhan",
			},
			// Open Graph
			{ property: "og:type", content: "website" },
			{ property: "og:title", content: "Projects | Ghifari Ezra Ramadhan" },
			{
				property: "og:description",
				content:
					"Kumpulan proyek Ghifari Ezra Ramadhan — aplikasi web full-stack dan tools berbasis TypeScript.",
			},
			{ property: "og:url", content: "https://ezdev.xyz/projects" },
			// Twitter Card
			{ name: "twitter:card", content: "summary" },
			{ name: "twitter:title", content: "Projects | Ghifari Ezra Ramadhan" },
			{
				name: "twitter:description",
				content:
					"Kumpulan proyek Ghifari Ezra Ramadhan — aplikasi web full-stack dan tools berbasis TypeScript.",
			},
		],
		links: [
			{ rel: "icon", href: "/favicon.ico" },
			{ rel: "canonical", href: "https://ezdev.xyz/projects" },
		],
	}),
	component: RouteComponent,
});
