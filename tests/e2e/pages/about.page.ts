import { type AboutLocators, aboutLocators } from "@e2e/locators/about.locators";
import type { Page } from "@playwright/test";

export class AboutPage {
    readonly page: Page;
    readonly locators: AboutLocators;

    constructor(page: Page) {
        this.page = page;
        this.locators = aboutLocators(page);
    }

    async goto() {
        await this.page.goto("/about");
    }
}