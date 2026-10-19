import { createFileRoute } from "@tanstack/react-router";
import { SITE } from "@/config/site";
import { HomePage } from "@/features/home/pages/home-page";
import { homeHead } from "@/lib/seo";

export const Route = createFileRoute("/")({
    head: () => homeHead(`Portfolio of ${SITE.fullName}: featured projects, testing skills, and certifications.`),
    component: HomePage,
});