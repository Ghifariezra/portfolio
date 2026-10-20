import { createFileRoute } from "@tanstack/react-router";
import { AppsPage } from "@/features/apps/pages/apps-page";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/apps/")({
    head: () =>
        pageHead(
            "Apps",
            "Windows apps by Ghifari Ezra Ramadhan, with install numbers straight from the Microsoft Store.",
            "/apps",
        ),
    component: AppsPage,
});
