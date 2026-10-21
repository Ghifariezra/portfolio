import type { Locator, Page } from "@playwright/test";

export const contributionsLocators = (page: Page) => {
    // Di halaman /contributions satu-satunya <article> adalah kartu issue,
    // dan satu-satunya <section aria-label> (role region) adalah grup repo.
    const cards = page.getByRole("article");
    const repoSections = page.getByRole("region");

    // Stats: <dl> dengan 3 <dd> (Issues resolved, Merged PRs, Repositories).
    // <dt> sengaja tidak dites lewat teks karena ada dua versi (pendek/panjang) yang disembunyikan CSS.
    const stats = page.locator("dl");
    const statValues = stats.locator("dd");

    return {
        // Header
        heading: page.getByRole("heading", { name: "Contributions", exact: true }),
        description: page.getByText(/Open-source issues I resolved/),

        // Stats
        stats,
        statValues,

        // Repo groups
        repoSections,
        repoHeading: (section: Locator): Locator => section.getByRole("heading", { level: 2 }),
        repoLink: (section: Locator): Locator => section.getByRole("heading", { level: 2 }).getByRole("link"),
        repoIssueBadge: (section: Locator): Locator => section.getByText(/^\d+ issues?$/),
        repoCards: (section: Locator): Locator => section.getByRole("article"),

        // Issue cards
        cards,
        cardTitle: (card: Locator): Locator => card.getByRole("heading", { level: 3 }),
        cardTitleLink: (card: Locator): Locator => card.getByRole("heading", { level: 3 }).getByRole("link"),
        cardResolved: (card: Locator): Locator => card.getByText(/^Resolved · #\d+$/),
        cardDate: (card: Locator): Locator => card.locator("time"),
        cardEvidenceHeading: (card: Locator): Locator => card.getByRole("heading", { name: "Evidence", exact: true }),
        cardNoPullRequest: (card: Locator): Locator => card.getByText("No linked pull request."),
        cardLinks: (card: Locator): Locator => card.getByRole("link"),

        // States
        emptyMessage: page.getByText("No contributions yet."),
        errorMessage: page.getByText("Could not load contributions right now."),
    };
};

export type ContributionsLocators = ReturnType<typeof contributionsLocators>;
