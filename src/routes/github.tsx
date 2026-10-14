import { createFileRoute } from "@tanstack/react-router";
import { RouteComponent } from "@/lib/features/github";

export const Route = createFileRoute("/github")({
  head: () => ({
    meta: [
      { title: "GitHub Activity | Ghifari Ezra Ramadhan" },
      {
        name: "description",
        content:
          "Aktivitas GitHub Ghifari Ezra Ramadhan — kontribusi setahun terakhir, pull request, dan aktivitas repository terbaru.",
      },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "GitHub Activity | Ghifari Ezra Ramadhan" },
      { property: "og:url", content: "https://ezdev.xyz/github" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "GitHub Activity | Ghifari Ezra Ramadhan" },
    ],
    links: [
      { rel: "icon", href: "/favicon.ico" },
      { rel: "canonical", href: "https://ezdev.xyz/github" },
    ],
  }),
  component: RouteComponent,
});