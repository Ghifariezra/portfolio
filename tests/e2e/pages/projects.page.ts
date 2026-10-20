import { type ProjectsLocators, projectsLocators } from "@e2e/locators/projects.locators";
import type { Page } from "@playwright/test";

export class ProjectsPage {
    readonly page: Page;
    readonly locators: ProjectsLocators;

    constructor(page: Page) {
        this.page = page;
        this.locators = projectsLocators(page);
    }

    async goto() {
        await this.page.goto("/projects");
    }
}
