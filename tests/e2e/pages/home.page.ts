import type { Page } from "@playwright/test";
import { type HomeLocators, homeLocators } from "../locators/home.locators";

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
