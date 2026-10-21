import { createFileRoute } from "@tanstack/react-router";
import { ContributionsPage } from "@/features/contributions/pages/contributions-page";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/contribute")({
    head: () =>
        pageHead(
            "Contribute",
            "Open-source issues resolved by Ghifari Ezra Ramadhan, each with its merged pull request as proof.",
            "/contribute",
        ),
    component: ContributionsPage,
});
