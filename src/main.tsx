import { RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppProviders } from "./app/providers";
import { router } from "./app/router";
import "./styles/globals.css";

// Tag SEO hasil scripts/prerender-seo.mjs untuk crawler; setelah app jalan, head() router yang mengelola.
document.head.querySelectorAll("[data-prerender]").forEach((el) => {
    el.remove();
});

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Element #root tidak ditemukan di index.html");

createRoot(rootElement).render(
    <StrictMode>
        <AppProviders>
            <RouterProvider router={router} />
        </AppProviders>
    </StrictMode>,
);
