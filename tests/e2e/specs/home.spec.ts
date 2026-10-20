import { expect, test } from "../fixtures";

test.describe("Home page", () => {
    test.describe("Hero", () => {
        test("should render intro text", async ({ homePage }) => {
            const { heading, location, jobTitle, summary } = homePage.locators;

            for (const el of [heading, location, jobTitle, summary]) {
                await expect(el).toBeVisible();
                await expect(el).not.toBeEmpty();
            }
        });
    });

    test.describe("Featured projects", () => {
        test("should display at least 1 project", async ({ homePage }) => {
            const { projectCards } = homePage.locators;

            await expect(projectCards).not.toHaveCount(0);
            await expect(projectCards.first()).toBeVisible();
        });
    });
});
