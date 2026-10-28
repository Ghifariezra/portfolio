import { RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppProviders } from "./app/providers";
import { router } from "./app/router";
import "./styles/globals.css";
import { z } from "zod";
import { profileQuery } from "@/features/portfolio/api/portfolio-queries";
import { profileSchema } from "@/features/portfolio/schemas/profile.schema";
import { projectsQuery } from "@/features/projects/api/project-queries";
import { projectItemSchema } from "@/features/projects/schemas/project.schema";
import { queryClient } from "./app/query-client";

// Tag SEO hasil scripts/prerender-seo.mjs untuk crawler; setelah app jalan, head() router yang mengelola.
document.head.querySelectorAll("[data-prerender]").forEach((el) => {
    el.remove();
});

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Element #root tidak ditemukan di index.html");

const seedEl = document.getElementById("__SEED__");
if (seedEl?.textContent) {
    try {
        const seed = JSON.parse(seedEl.textContent);
        queryClient.setQueryData(profileQuery().queryKey, profileSchema.parse(seed.profile), {
            updatedAt: seed.builtAt,
        });
        queryClient.setQueryData(projectsQuery().queryKey, z.array(projectItemSchema).parse(seed.projects), {
            updatedAt: seed.builtAt,
        });
    } catch {
        // seed rusak atau skema berubah: fallback ke fetch runtime
    }
    seedEl.remove();
}

createRoot(rootElement).render(
    <StrictMode>
        <AppProviders>
            <RouterProvider router={router} />
        </AppProviders>
    </StrictMode>,
);
