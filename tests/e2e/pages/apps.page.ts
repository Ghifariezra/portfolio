import { type AppsLocators, appsLocators } from "@e2e/locators/apps.locators";
import type { Page } from "@playwright/test";

export class AppsPage {
    readonly page: Page;
    readonly locators: AppsLocators;

    constructor(page: Page) {
        this.page = page;
        this.locators = appsLocators(page);
    }

    async goto() {
        await this.page.goto("/apps");
    }
}
