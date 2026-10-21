import { expect, test } from "@e2e/fixtures";
import { EMPTY_CONTRIBUTIONS, isContributions, mockResponse } from "@e2e/helpers/api-mocks";
import { HomePage } from "@e2e/pages/home.page";

test.describe("Home page", () => {
    test.describe("Hero", () => {
        test("should render intro text", async ({ homePage }) => {
            const { heading, location, jobTitle, summary } = homePage.locators;

            for (const el of [heading, location, jobTitle, summary]) {
                await expect(el).toBeVisible();
                await expect(el).not.toBeEmpty();
            }
        });

        test("should navigate to projects page from 'View projects'", async ({ homePage }) => {
            await homePage.locators.viewProjectsLink.click();

            await expect(homePage.page).toHaveURL(/\/projects$/);
        });

        test("should navigate to about page from 'About me'", async ({ homePage }) => {
            await homePage.locators.aboutLink.click();

            await expect(homePage.page).toHaveURL(/\/about$/);
        });

        test("should render social links with valid URLs", async ({ homePage }) => {
            const { githubLink, linkedinLink, websiteLink } = homePage.locators;

            for (const link of [githubLink, linkedinLink, websiteLink]) {
                await expect(link).toHaveAttribute("href", /^https?:\/\//);
            }
        });
    });

    test.describe("Featured projects", () => {
        test("should display at least 1 project", async ({ homePage }) => {
            const { projectCards } = homePage.locators;

            await expect(projectCards).not.toHaveCount(0);
            await expect(projectCards.first()).toBeVisible();
        });

        test("should navigate to projects page from 'All projects'", async ({ homePage }) => {
            await homePage.locators.allProjectsLink.click();

            await expect(homePage.page).toHaveURL(/\/projects$/);
        });
    });

    test.describe("Currently", () => {
        test("should display current role", async ({ homePage }) => {
            const { currentRoleCard, currentRolePosition, currentRoleCompany } = homePage.locators;

            await expect(currentRoleCard).toBeVisible();
            await expect(currentRolePosition).not.toBeEmpty();
            await expect(currentRoleCompany).not.toBeEmpty();
        });

        test("should navigate to experience section from 'Full background'", async ({ homePage }) => {
            await homePage.locators.fullBackgroundLink.click();

            await expect(homePage.page).toHaveURL(/\/about#experience$/);
        });
    });

    test.describe("Skills", () => {
        test("should display at least 1 skill group with a title", async ({ homePage }) => {
            const { skillCards, skillCardTitles } = homePage.locators;

            await expect(skillCards).not.toHaveCount(0);
            await expect(skillCards.first()).toBeVisible();
            await expect(skillCardTitles.first()).not.toBeEmpty();
        });

        test("should navigate to skills section from 'All skills'", async ({ homePage }) => {
            await homePage.locators.allSkillsLink.click();

            await expect(homePage.page).toHaveURL(/\/about#skills$/);
        });
    });

    test.describe("Open source", () => {
        test("should display latest contributions with stats", async ({ homePage }) => {
            const { contributionItems, contributionTitles, contributionStatValues } = homePage.locators;

            await expect(contributionItems).not.toHaveCount(0);
            await expect(contributionItems.first()).toBeVisible();
            await expect(contributionTitles.first()).not.toBeEmpty();
            await expect(contributionStatValues).toHaveCount(3);
        });

        test("should show at most 3 contributions", async ({ homePage }) => {
            const { contributionItems } = homePage.locators;

            await expect(contributionItems.first()).toBeVisible();
            expect(await contributionItems.count()).toBeLessThanOrEqual(3);
        });

        test("should open contribution links safely in a new tab", async ({ homePage }) => {
            const { contributionItems } = homePage.locators;

            await expect(contributionItems.first()).toBeVisible();

            for (const link of await contributionItems.getByRole("link").all()) {
                await expect(link).toHaveAttribute("href", /^https?:\/\//);
                await expect(link).toHaveAttribute("target", "_blank");
                await expect(link).toHaveAttribute("rel", /noreferrer/);
            }
        });

        test("should navigate to contributions page from 'All contributions'", async ({ homePage }) => {
            await homePage.locators.allContributionsLink.click();

            await expect(homePage.page).toHaveURL(/\/contribute$/);
        });

        test("should hide the section when there are no contributions", async ({ page }) => {
            const homePage = new HomePage(page);

            await mockResponse(page, isContributions, 200, EMPTY_CONTRIBUTIONS);
            await homePage.goto();

            await expect(homePage.locators.heading).toBeVisible();
            await expect(homePage.locators.contributions).toHaveCount(0);
        });

        test("should not break the page when contributions fail (500)", async ({ page }) => {
            const homePage = new HomePage(page);

            await mockResponse(page, isContributions, 500, { error: { message: "Internal error" } });
            await homePage.goto();

            await expect(homePage.locators.contributionsErrorMessage).toBeVisible({ timeout: 15_000 });
            // Section lain tetap tampil walau contributions gagal
            await expect(homePage.locators.heading).toBeVisible();
        });
    });

    test.describe("Certifications", () => {
        test("should display at least 1 certification", async ({ homePage }) => {
            const { certificationItems, certificationTitles } = homePage.locators;

            await expect(certificationItems).not.toHaveCount(0);
            await expect(certificationItems.first()).toBeVisible();
            await expect(certificationTitles.first()).not.toBeEmpty();
        });

        test("should navigate to certifications section from 'All certifications'", async ({ homePage }) => {
            await homePage.locators.allCertificationsLink.click();

            await expect(homePage.page).toHaveURL(/\/about#certifications$/);
        });
    });

    test.describe("Contact", () => {
        test("should render heading and external links", async ({ homePage }) => {
            const { contactHeading, contactLinkedinLink, contactGithubLink } = homePage.locators;

            await expect(contactHeading).toBeVisible();

            for (const link of [contactLinkedinLink, contactGithubLink]) {
                await expect(link).toBeVisible();
                await expect(link).toHaveAttribute("href", /^https?:\/\//);
                await expect(link).toHaveAttribute("target", "_blank");
                await expect(link).toHaveAttribute("rel", /noreferrer/);
            }
        });
    });
});
