import { expect, test } from "@e2e/fixtures";
import { isProjectsList, mockResponse } from "@e2e/helpers/api-mocks";
import { ProjectsPage } from "@e2e/pages/projects.page";

// Ambil angka dari label chip, mis. "Done (3)" -> 3
const countOf = (label: string) => Number(/\((\d+)\)\s*$/.exec(label)?.[1]);

test.describe("Projects page", () => {
    test.describe("Header", () => {
        test("should render title and description", async ({ projectsPage }) => {
            const { heading, description } = projectsPage.locators;

            await expect(heading).toBeVisible();
            await expect(description).toBeVisible();
        });
    });

    test.describe("Project list", () => {
        test("should display at least 1 project with title and description", async ({ projectsPage }) => {
            const { cards, cardTitles, cardDescription } = projectsPage.locators;

            await expect(cards).not.toHaveCount(0);
            await expect(cards.first()).toBeVisible();

            for (const el of [cardTitles.first(), cardDescription(cards.first())]) {
                await expect(el).toBeVisible();
                await expect(el).not.toBeEmpty();
            }
        });

        test("should render external links with valid URLs", async ({ projectsPage }) => {
            const { cards, cardExternalLinks } = projectsPage.locators;

            await expect(cards.first()).toBeVisible();

            for (const link of await cardExternalLinks.all()) {
                await expect(link).toHaveAttribute("href", /^https?:\/\//);
            }
        });

        test("should open the project detail when a card is clicked", async ({ projectsPage }) => {
            const { page, locators } = projectsPage;

            await expect(locators.cards.first()).toBeVisible();
            const title = (await locators.cardTitles.first().innerText()).trim();

            await locators.cardTitleLinks.first().click();

            await expect(page).toHaveURL(/\/projects\/[^/]+$/);
            await expect(page.getByRole("heading", { level: 1, name: title, exact: true })).toBeVisible();
        });
    });

    test.describe("Filters", () => {
        test("should filter projects by status and reset with 'All'", async ({ projectsPage }) => {
            const { cards, allChip, statusChips } = projectsPage.locators;

            await expect(cards.first()).toBeVisible();
            test.skip((await allChip.count()) === 0, "Filter hanya muncul kalau ada lebih dari satu status");

            const total = countOf(await allChip.innerText());
            await expect(allChip).toHaveAttribute("aria-pressed", "true");
            await expect(cards).toHaveCount(total);

            const chip = statusChips.first();
            const expected = countOf(await chip.innerText());

            await chip.click();
            await expect(chip).toHaveAttribute("aria-pressed", "true");
            await expect(allChip).toHaveAttribute("aria-pressed", "false");
            await expect(cards).toHaveCount(expected);

            await allChip.click();
            await expect(allChip).toHaveAttribute("aria-pressed", "true");
            await expect(cards).toHaveCount(total);
        });
    });

    test.describe("Empty and error states", () => {
        test("should show an empty state when there are no projects", async ({ page }) => {
            const projectsPage = new ProjectsPage(page);

            await mockResponse(page, isProjectsList, 200, { data: [] });
            await projectsPage.goto();

            await expect(projectsPage.locators.emptyMessage).toBeVisible();
            await expect(projectsPage.locators.cards).toHaveCount(0);
        });

        test("should show an error message when projects fail to load", async ({ page }) => {
            const projectsPage = new ProjectsPage(page);

            await mockResponse(page, isProjectsList, 500, { error: { message: "Internal error" } });
            await projectsPage.goto();

            // Timeout panjang: query bisa retry dulu untuk error 5xx sebelum error muncul
            await expect(projectsPage.locators.errorMessage).toBeVisible({ timeout: 15_000 });
        });
    });
});
