import { expect, test } from "@e2e/fixtures";
import { isAppsList, isStoreAnalytics, mockResponse, patchFirstApp } from "@e2e/helpers/api-mocks";
import { AppsPage } from "@e2e/pages/apps.page";

test.describe("Apps page", () => {
    test.describe("Header", () => {
        test("should render title and description", async ({ appsPage }) => {
            const { heading, description } = appsPage.locators;

            await expect(heading).toBeVisible();
            await expect(description).toBeVisible();
        });
    });

    test.describe("App list", () => {
        test("should display at least 1 app with name, description, and status", async ({ appsPage }) => {
            const { cards, cardTitles, cardDescription, cardStatus } = appsPage.locators;

            await expect(cards).not.toHaveCount(0);
            await expect(cards.first()).toBeVisible();

            for (const el of [cardTitles.first(), cardDescription(cards.first()), cardStatus(cards.first())]) {
                await expect(el).toBeVisible();
                await expect(el).not.toBeEmpty();
            }
        });

        test("should render external links with valid URLs", async ({ appsPage }) => {
            const { cards, cardExternalLinks } = appsPage.locators;

            await expect(cards.first()).toBeVisible();

            for (const link of await cardExternalLinks.all()) {
                await expect(link).toHaveAttribute("href", /^https?:\/\//);
            }
        });

        test("should open the related project from an app card", async ({ appsPage }) => {
            const { page, locators } = appsPage;

            await expect(locators.cards.first()).toBeVisible();
            test.skip((await locators.cardProjectLinks.count()) === 0, "Tidak ada app yang terhubung ke project");

            await locators.cardProjectLinks.first().click();

            await expect(page).toHaveURL(/\/projects\/[^/]+$/);
        });
    });

    test.describe("Store metrics", () => {
        test("should show installs and markets for a published app", async ({ appsPage }) => {
            const { cards, publishedCards, installsLabel, marketsLabel } = appsPage.locators;

            await expect(cards.first()).toBeVisible();
            test.skip((await publishedCards.count()) === 0, "Tidak ada app berstatus Live");

            // Metrics datang dari request terpisah ke Partner Center lewat backend, jadi beri waktu lebih
            await expect(installsLabel(publishedCards.first())).toBeVisible({ timeout: 15_000 });
            await expect(marketsLabel(publishedCards.first())).toBeVisible();
        });

        test("should explain that metrics are not available for an unpublished app", async ({ page }) => {
            const appsPage = new AppsPage(page);

            await patchFirstApp(page, { status: "coming_soon" });
            await appsPage.goto();

            const { cards, cardStatus, metricsUnpublished } = appsPage.locators;

            await expect(cardStatus(cards.first())).toHaveText("Coming soon");
            await expect(metricsUnpublished).toBeVisible();
        });

        test("should show 'No metrics' when the store has no analytics (404)", async ({ page }) => {
            const appsPage = new AppsPage(page);

            await patchFirstApp(page, { status: "published", microsoft_store_id: "TESTSTORE001" });
            await mockResponse(page, isStoreAnalytics, 404, { error: "Not found" });
            await appsPage.goto();

            await expect(appsPage.locators.metricsNotFound).toBeVisible();
        });

        test("should not break the page when metrics fail (502)", async ({ page }) => {
            const appsPage = new AppsPage(page);

            await patchFirstApp(page, { status: "published", microsoft_store_id: "TESTSTORE001" });
            await mockResponse(page, isStoreAnalytics, 502, { error: "Bad gateway" });
            await appsPage.goto();

            await expect(appsPage.locators.metricsUnavailable).toBeVisible({ timeout: 15_000 });
            // Info app dari DB tetap tampil walau metrics gagal
            await expect(appsPage.locators.cardTitles.first()).toBeVisible();
        });
    });

    test.describe("Empty and error states", () => {
        test("should show an empty state when there are no apps", async ({ page }) => {
            const appsPage = new AppsPage(page);

            await mockResponse(page, isAppsList, 200, { data: [] });
            await appsPage.goto();

            await expect(appsPage.locators.emptyMessage).toBeVisible();
            await expect(appsPage.locators.cards).toHaveCount(0);
        });

        test("should show an error message when apps fail to load", async ({ page }) => {
            const appsPage = new AppsPage(page);

            await mockResponse(page, isAppsList, 500, { error: { message: "Internal error" } });
            await appsPage.goto();

            // Timeout panjang: query bisa retry dulu untuk error 5xx sebelum error muncul
            await expect(appsPage.locators.errorMessage).toBeVisible({ timeout: 15_000 });
        });
    });
});
