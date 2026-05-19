import { createFileRoute } from "@tanstack/react-router";
import { RouteComponent } from "@/lib/features/home";

export const Route = createFileRoute("/")({
    head: () => ({
        meta: [
            {
                title: "Ghifari Ezra Ramadhan | Software Developer",
            },
            {
                name: "description",
                content:
                    "Portfolio Ghifari Ezra Ramadhan — Software Developer dengan latar belakang Data Engineering. Mahasiswa Teknik Informatika Universitas Pancasila, berfokus pada pengembangan web full-stack dengan React, TypeScript, dan Node.js.",
            },
            {
                name: "keywords",
                content:
                    "ghifari ezra ramadhan, software developer, web developer, full-stack, react, typescript, node.js, next.js, nestjs, postgresql, docker, data engineer, jakarta",
            },
            // Open Graph
            { property: "og:type", content: "website" },
            { property: "og:title", content: "Ghifari Ezra Ramadhan | Software Developer" },
            {
                property: "og:description",
                content:
                    "Software Developer dengan latar belakang Data Engineering. Membangun solusi web yang menjembatani logika dan pengalaman pengguna.",
            },
            { property: "og:url", content: "https://ezdev.xyz" },
            // Twitter Card
            { name: "twitter:card", content: "summary" },
            { name: "twitter:title", content: "Ghifari Ezra Ramadhan | Software Developer" },
            {
                name: "twitter:description",
                content:
                    "Software Developer dengan latar belakang Data Engineering. Membangun solusi web yang menjembatani logika dan pengalaman pengguna.",
            },
        ],
        links: [
            { rel: "icon", href: "/favicon.ico" },
            { rel: "canonical", href: "https://ezdev.xyz" },
        ],
    }),
    component: RouteComponent,
});