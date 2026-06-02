import { createFileRoute } from "@tanstack/react-router";
import { RouteComponent } from "@/lib/features/apps";

export const Route = createFileRoute("/apps/")({
    head: () => ({
        meta: [
            {
                title: "Apps & Open Metrics | Ghifari Ezra Ramadhan",
            },
            {
                name: "description",
                content:
                    "Koleksi perangkat lunak desktop (Windows App) dan utility tools yang dikembangkan oleh Ghifari Ezra Ramadhan. Dilengkapi dengan transparansi open metrics dari Microsoft Store.",
            },
            {
                name: "keywords",
                content:
                    "apps, software, windows app, uwp, electron, desktop application, microsoft store, open metrics, analytics, ghifari ezra ramadhan, ezdev",
            },
            // Open Graph
            { property: "og:type", content: "website" },
            { property: "og:title", content: "Apps & Open Metrics | Ghifari Ezra Ramadhan" },
            {
                property: "og:description",
                content:
                    "Koleksi perangkat lunak desktop dan utility tools oleh Ghifari Ezra Ramadhan dengan transparansi open metrics.",
            },
            { property: "og:url", content: "https://ezdev.xyz/apps" },
            // Twitter Card
            { name: "twitter:card", content: "summary" },
            { name: "twitter:title", content: "Apps & Open Metrics | Ghifari Ezra Ramadhan" },
            {
                name: "twitter:description",
                content:
                    "Koleksi perangkat lunak desktop dan utility tools oleh Ghifari Ezra Ramadhan dengan transparansi open metrics.",
            },
        ],
        links: [
            { rel: "icon", href: "/favicon.ico" },
            { rel: "canonical", href: "https://ezdev.xyz/apps" },
        ],
    }),
    component: RouteComponent,
});