import type { Locator, Page } from "@playwright/test";

export const appsLocators = (page: Page) => {
    // Di halaman /apps satu-satunya <article> adalah kartu app
    const cards = page.getByRole("article");
    const cardTitles = cards.getByRole("heading", { level: 2 });

    return {
        // Header
        heading: page.getByRole("heading", { name: "Apps", exact: true }),
        description: page.getByText(/Windows software I build and ship/),

        // Cards
        cards,
        cardTitles,
        card: (name: string): Locator => cards.filter({ has: page.getByRole("heading", { name, exact: true }) }),
        // Deskripsi opsional, jadi dicari lewat posisinya tepat setelah <h2>
        cardDescription: (card: Locator): Locator => card.locator("h2 + p"),
        cardStatus: (card: Locator): Locator => card.getByText(/^(Live|Coming soon|Archived)$/),
        // Icon link "<name> website" / "<name> on the Microsoft Store"
        cardExternalLinks: cards.getByRole("link", { name: / (website|on the Microsoft Store)$/ }),
        cardProjectLinks: cards.getByRole("link", { name: /^Project: / }),

        // Store metrics (hanya untuk app yang sudah rilis)
        publishedCards: cards.filter({ has: page.getByText("Live", { exact: true }) }),
        installsLabel: (card: Locator): Locator => card.getByText("Installs", { exact: true }),
        marketsLabel: (card: Locator): Locator => card.getByText("Markets", { exact: true }),
        metricsUnpublished: page.getByText("Metrics appear once the app is published."),
        metricsNotFound: page.getByText("No metrics for this app yet."),
        metricsUnavailable: page.getByText("Metrics are unavailable right now."),

        // States
        emptyMessage: page.getByText("No apps yet."),
        errorMessage: page.getByText("Could not load apps right now."),
    };
};

export type AppsLocators = ReturnType<typeof appsLocators>;