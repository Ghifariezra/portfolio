import type { Locator, Page } from "@playwright/test";

export const projectsLocators = (page: Page) => {
    // Di halaman /projects satu-satunya <article> adalah kartu project
    const cards = page.getByRole("article");
    const cardTitles = cards.getByRole("heading", { level: 2 });

    // Chip filter berformat "Label (n)". "Any language" tidak punya angka, jadi tidak ikut.
    const filterChips = page.getByRole("button", { name: /\(\d+\)$/ });

    return {
        // Header
        heading: page.getByRole("heading", { name: "Projects", exact: true }),
        description: page.getByText(/Things I have built/),

        // Cards
        cards,
        cardTitles,
        cardTitleLinks: cardTitles.getByRole("link"),
        // Deskripsi adalah <p> pertama di kartu (fallback "No description." kalau kosong)
        cardDescription: (card: Locator): Locator => card.locator("p").first(),
        // Icon link "<title> live site" / "<title> on GitHub"
        cardExternalLinks: cards.getByRole("link", { name: / (on GitHub|live site)$/ }),

        // Filters
        filterChips,
        allChip: page.getByRole("button", { name: /^All \(\d+\)$/ }),
        statusChips: filterChips.filter({ hasNotText: /^All/ }),

        // States
        errorMessage: page.getByText("Could not load projects right now."),
        emptyMessage: page.getByText("No projects yet."),
    };
};

export type ProjectsLocators = ReturnType<typeof projectsLocators>;