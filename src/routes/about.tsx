import { createFileRoute } from "@tanstack/react-router";
import { AboutPage } from "@/features/portfolio/pages/about-page";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/about")({
    head: () =>
        pageHead(
            "About",
            "About Ghifari Ezra Ramadhan: skills, experience, education, and certifications.",
            "/about",
        ),
    component: AboutPage,
});
