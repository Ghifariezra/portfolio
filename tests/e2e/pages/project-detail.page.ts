import { type ProjectDetailLocators, projectDetailLocators } from "@e2e/locators/project-detail.locators";
import type { Page } from "@playwright/test";

export class ProjectDetailPage {
    readonly page: Page;
    readonly locators: ProjectDetailLocators;

    constructor(page: Page) {
        this.page = page;
        this.locators = projectDetailLocators(page);
    }

    async goto(slug: string) {
        await this.page.goto(`/projects/${slug}`);
    }
}