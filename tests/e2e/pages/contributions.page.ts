import { type ContributionsLocators, contributionsLocators } from "@e2e/locators/contributions.locators";
import type { Page } from "@playwright/test";

export class ContributionsPage {
    readonly page: Page;
    readonly locators: ContributionsLocators;

    constructor(page: Page) {
        this.page = page;
        this.locators = contributionsLocators(page);
    }

    async goto() {
        await this.page.goto("/contribute");
    }
}
