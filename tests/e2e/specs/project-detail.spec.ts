import { expect, test } from "@e2e/fixtures";
import { forceGithubRepo, isGithubRepo, isProjectDetail, mockResponse } from "@e2e/helpers/api-mocks";
import { ProjectDetailPage } from "@e2e/pages/project-detail.page";
import { ProjectsPage } from "@e2e/pages/projects.page";
import type { Page } from "@playwright/test";

async function openFirstProject(page: Page) {
    const projectsPage = new ProjectsPage(page);
    await projectsPage.goto();
    await projectsPage.locators.cardTitleLinks.first().click();
    await page.waitForURL(/\/projects\/[^/]+$/);
    return new ProjectDetailPage(page);
}

test.describe("Project detail page", () => {
    test.describe("Header", () => {
        test("should render title and status info", async ({ projectDetailPage }) => {
            const { heading, metaRow } = projectDetailPage.locators;

            for (const el of [heading, metaRow]) {
                await expect(el).toBeVisible();
                await expect(el).not.toBeEmpty();
            }
        });

        test("should render source and live links safely", async ({ projectDetailPage }) => {
            const { heading, headerLinks } = projectDetailPage.locators;

            await expect(heading).toBeVisible();

            // Semua link di header adalah link eksternal (Source / Live site)
            for (const link of await headerLinks.all()) {
                await expect(link).toHaveAttribute("href", /^https?:\/\//);
                await expect(link).toHaveAttribute("target", "_blank");
                await expect(link).toHaveAttribute("rel", /noreferrer/);
            }
        });
    });

    test.describe("Navigation", () => {
        test("should go back to the projects page from 'All projects'", async ({ projectDetailPage }) => {
            await projectDetailPage.locators.backLink.click();

            await expect(projectDetailPage.page).toHaveURL(/\/projects$/);
        });
    });

    test.describe("Not found and errors", () => {
        test("should show a not found message when the project does not exist", async ({ page }) => {
            const detailPage = new ProjectDetailPage(page);

            await mockResponse(page, isProjectDetail, 404, { error: { message: "Project not found" } });
            await detailPage.goto("this-project-does-not-exist");

            await expect(detailPage.locators.notFoundMessage).toBeVisible();
            await expect(detailPage.locators.backLink).toBeVisible();
        });

        test("should show a generic error when the server fails", async ({ page }) => {
            const detailPage = new ProjectDetailPage(page);

            await mockResponse(page, isProjectDetail, 500, { error: { message: "Internal error" } });
            await detailPage.goto("any-slug");

            await expect(detailPage.locators.loadError).toBeVisible({ timeout: 15_000 });
        });
    });

    test.describe("GitHub section", () => {
        test("should explain when the repository is not public (404)", async ({ page }) => {
            await forceGithubRepo(page);
            await mockResponse(page, isGithubRepo, 404, { error: "Repository not found" });

            const detailPage = await openFirstProject(page);

            await expect(detailPage.locators.githubNotFound).toBeVisible();
        });

        test("should not break the page when GitHub is down (502)", async ({ page }) => {
            await forceGithubRepo(page);
            await mockResponse(page, isGithubRepo, 502, { error: "Bad gateway" });

            const detailPage = await openFirstProject(page);

            await expect(detailPage.locators.githubUnavailable).toBeVisible({ timeout: 15_000 });
            // Data dari DB tetap tampil walau GitHub gagal
            await expect(detailPage.locators.heading).toBeVisible();
        });
    });
});