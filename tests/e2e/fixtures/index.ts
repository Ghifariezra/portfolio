import { AboutPage } from "@e2e/pages/about.page";
import { AppsPage } from "@e2e/pages/apps.page";
import { HomePage } from "@e2e/pages/home.page";
import { ProjectDetailPage } from "@e2e/pages/project-detail.page";
import { ProjectsPage } from "@e2e/pages/projects.page";
import { test as base } from "@playwright/test";

type Fixtures = {
    homePage: HomePage;
    aboutPage: AboutPage;
    projectsPage: ProjectsPage;
    projectDetailPage: ProjectDetailPage;
    appsPage: AppsPage;
};

export const test = base.extend<Fixtures>({
    homePage: async ({ page }, use) => {
        const homePage = new HomePage(page);
        await homePage.goto();
        await use(homePage);
    },
    aboutPage: async ({ page }, use) => {
        const aboutPage = new AboutPage(page);
        await aboutPage.goto();
        await use(aboutPage);
    },
    projectsPage: async ({ page }, use) => {
        const projectsPage = new ProjectsPage(page);
        await projectsPage.goto();
        await use(projectsPage);
    },
    // Slug tidak di-hardcode: masuk lewat list, klik project pertama
    projectDetailPage: async ({ page }, use) => {
        const projectsPage = new ProjectsPage(page);
        await projectsPage.goto();
        await projectsPage.locators.cardTitleLinks.first().click();
        await page.waitForURL(/\/projects\/[^/]+$/);
        await use(new ProjectDetailPage(page));
    },
    appsPage: async ({ page }, use) => {
        const appsPage = new AppsPage(page);
        await appsPage.goto();
        await use(appsPage);
    },
});

export { expect } from "@playwright/test";