import { expect, test } from "@e2e/fixtures";
import { EMPTY_CONTRIBUTIONS, isContributions, mockResponse } from "@e2e/helpers/api-mocks";
import { ContributionsPage } from "@e2e/pages/contributions.page";

// TODO: sesuaikan dengan bentuk response kosong yang valid di schema contributions.
// Kalau bentuknya salah, Zod gagal dan yang tampil adalah error state, bukan empty state.

const toNumber = (text: string) => Number(text.replace(/\D/g, ""));

test.describe("Contributions page", () => {
    test.describe("Header", () => {
        test("should render title and description", async ({ contributionsPage }) => {
            const { heading, description } = contributionsPage.locators;

            await expect(heading).toBeVisible();
            await expect(description).toBeVisible();
        });
    });

    test.describe("Stats", () => {
        test("should show three numeric stats", async ({ contributionsPage }) => {
            const { cards, statValues } = contributionsPage.locators;

            await expect(cards.first()).toBeVisible();
            await expect(statValues).toHaveCount(3);

            for (const value of await statValues.all()) {
                await expect(value).toHaveText(/\d/);
            }
        });

        test("should match the number of issues and repositories shown", async ({ contributionsPage }) => {
            const { cards, repoSections, statValues } = contributionsPage.locators;

            await expect(cards.first()).toBeVisible();

            const issues = toNumber(await statValues.nth(0).innerText());
            const repos = toNumber(await statValues.nth(2).innerText());

            await expect(cards).toHaveCount(issues);
            await expect(repoSections).toHaveCount(repos);
        });
    });

    test.describe("Repository groups", () => {
        test("should display repo name, link, and issue count", async ({ contributionsPage }) => {
            const { repoSections, repoHeading, repoLink, repoIssueBadge, repoCards } = contributionsPage.locators;
            const section = repoSections.first();

            await expect(section).toBeVisible();
            await expect(repoHeading(section)).not.toBeEmpty();
            await expect(repoLink(section)).toHaveAttribute("href", /^https?:\/\//);
            await expect(repoLink(section)).toHaveAttribute("target", "_blank");
            await expect(repoLink(section)).toHaveAttribute("rel", /noreferrer/);

            // Badge "n issue(s)" harus sama dengan jumlah kartu di grup itu
            const badge = await repoIssueBadge(section).innerText();
            await expect(repoCards(section)).toHaveCount(toNumber(badge));
        });
    });

    test.describe("Issue cards", () => {
        test("should display at least 1 issue with title, status, and date", async ({ contributionsPage }) => {
            const { cards, cardTitle, cardResolved, cardDate } = contributionsPage.locators;
            const card = cards.first();

            await expect(card).toBeVisible();

            for (const el of [cardTitle(card), cardResolved(card), cardDate(card)]) {
                await expect(el).toBeVisible();
                await expect(el).not.toBeEmpty();
            }
            await expect(cardDate(card)).toHaveAttribute("datetime", /\d{4}-\d{2}-\d{2}/);
        });

        test("should open issue and pull request links safely in a new tab", async ({ contributionsPage }) => {
            const { cards, cardTitleLink, cardLinks } = contributionsPage.locators;
            const card = cards.first();

            await expect(card).toBeVisible();
            await expect(cardTitleLink(card)).toHaveAttribute("href", /^https?:\/\//);

            for (const link of await cardLinks(card).all()) {
                await expect(link).toHaveAttribute("href", /^https?:\/\//);
                await expect(link).toHaveAttribute("target", "_blank");
                await expect(link).toHaveAttribute("rel", /noreferrer/);
            }
        });

        test("should show evidence: linked pull requests or a fallback message", async ({ contributionsPage }) => {
            const { cards, cardEvidenceHeading, cardNoPullRequest, cardLinks } = contributionsPage.locators;
            const card = cards.first();

            await expect(card).toBeVisible();
            await expect(cardEvidenceHeading(card)).toBeVisible();

            // Kartu punya link judul issue (1) + link PR; tanpa PR, pesan fallback harus tampil
            if ((await cardLinks(card).count()) > 1) {
                await expect(cardNoPullRequest(card)).toHaveCount(0);
            } else {
                await expect(cardNoPullRequest(card)).toBeVisible();
            }
        });
    });

    test.describe("Empty and error states", () => {
        test("should show an empty state when there are no contributions", async ({ page }) => {
            const contributionsPage = new ContributionsPage(page);

            await mockResponse(page, isContributions, 200, EMPTY_CONTRIBUTIONS);
            await contributionsPage.goto();

            await expect(contributionsPage.locators.emptyMessage).toBeVisible();
            await expect(contributionsPage.locators.cards).toHaveCount(0);
        });

        test("should show an error message when contributions fail to load", async ({ page }) => {
            const contributionsPage = new ContributionsPage(page);

            await mockResponse(page, isContributions, 500, { error: { message: "Internal error" } });
            await contributionsPage.goto();

            // Timeout panjang: query bisa retry dulu untuk error 5xx sebelum error muncul
            await expect(contributionsPage.locators.errorMessage).toBeVisible({ timeout: 15_000 });
        });
    });
});
