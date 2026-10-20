import type { Page } from "@playwright/test";

export const projectDetailLocators = (page: Page) => {
    // <header> yang berisi h1 (bukan header navbar)
    const header = page.locator("header").filter({ has: page.getByRole("heading", { level: 1 }) });

    return {
        backLink: page.getByRole("link", { name: /all projects/i }),

        // Header
        header,
        heading: header.getByRole("heading", { level: 1 }),
        // Baris badge: status, featured, rentang tanggal
        metaRow: header.locator(":scope > div").first(),
        sourceLink: header.getByRole("link", { name: "Source" }),
        liveLink: header.getByRole("link", { name: "Live site" }),
        headerLinks: header.getByRole("link"),

        // Sections (hanya muncul kalau datanya ada)
        highlights: page.getByRole("region", { name: "Highlights", exact: true }),
        stack: page.getByRole("region", { name: "Stack", exact: true }),

        // States
        notFoundMessage: page.getByText("This project doesn't exist or isn't public."),
        loadError: page.getByText("Could not load this project right now."),
        githubNotFound: page.getByText("The GitHub repository isn't public or no longer exists."),
        githubUnavailable: page.getByText("GitHub details are unavailable right now."),
    };
};

export type ProjectDetailLocators = ReturnType<typeof projectDetailLocators>;
