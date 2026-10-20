import { type HomeLocators, homeLocators } from "@e2e/locators/home.locators";
import type { Page } from "@playwright/test";

export class HomePage {
    readonly page: Page;
    readonly locators: HomeLocators;

    constructor(page: Page) {
        this.page = page;
        this.locators = homeLocators(page);
    }

    async goto() {
        await this.page.goto("/");
    }
}
