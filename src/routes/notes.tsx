import { RouteComponent } from "@/lib/features/notes";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      {
        title: "Technical Notes | Ghifari Ezra Ramadhan",
      },
      {
        name: "description",
        content:
          "Catatan teknis Ghifari Ezra Ramadhan — eksplorasi mendalam tentang data engineering, web development, arsitektur sistem, Python, TypeScript, PostgreSQL, dan Docker.",
      },
      {
        name: "keywords",
        content:
          "technical notes, blog, data engineering, python, typescript, react, postgresql, docker, etl, web scraping, software engineering, ghifari ezra ramadhan",
      },
      // Open Graph
      { property: "og:type", content: "website" },
      {
        property: "og:title",
        content: "Technical Notes | Ghifari Ezra Ramadhan",
      },
      {
        property: "og:description",
        content:
          "Eksplorasi mendalam tentang data engineering, arsitektur sistem, dan pengembangan web dari sudut pandang seorang software developer.",
      },
      { property: "og:url", content: "https://ezdev.xyz/notes" },
      // Twitter Card
      { name: "twitter:card", content: "summary" },
      {
        name: "twitter:title",
        content: "Technical Notes | Ghifari Ezra Ramadhan",
      },
      {
        name: "twitter:description",
        content:
          "Eksplorasi mendalam tentang data engineering, arsitektur sistem, dan pengembangan web.",
      },
    ],
    links: [
      { rel: "icon", href: "/favicon.ico" },
      { rel: "canonical", href: "https://ezdev.xyz/notes" },
    ],
  }),
  component: RouteComponent,
});