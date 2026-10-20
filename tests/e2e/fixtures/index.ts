import { HomePage } from "@e2e/pages/home.page";
import { test as base } from "@playwright/test";

type Fixtures = {
    homePage: HomePage;
};

export const test = base.extend<Fixtures>({
    homePage: async ({ page }, use) => {
        const homePage = new HomePage(page);
        await homePage.goto();
        await use(homePage);
    },
});

export { expect } from "@playwright/test";
