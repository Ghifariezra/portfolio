import { readFile } from "node:fs/promises";
import { expect, test } from "@e2e/fixtures";

test.describe("About page", () => {
    test.describe("Profile header", () => {
        test("should render intro text", async ({ aboutPage }) => {
            const { heading, headline, location, summary } = aboutPage.locators;

            for (const el of [heading, headline, location, summary]) {
                await expect(el).toBeVisible();
                await expect(el).not.toBeEmpty();
            }
        });

        test("should render social links with valid URLs", async ({ aboutPage }) => {
            const { githubLink, linkedinLink, websiteLink } = aboutPage.locators;

            for (const link of [githubLink, linkedinLink, websiteLink]) {
                await expect(link).toHaveAttribute("href", /^https?:\/\//);
            }
        });
    });

    test.describe("Experience", () => {
        test("should display at least 1 entry with title, company, and details", async ({ aboutPage }) => {
            const { entries, titles, subtitles, details } = aboutPage.locators.experience;

            await expect(entries).not.toHaveCount(0);
            await expect(entries.first()).toBeVisible();

            for (const el of [titles.first(), subtitles.first(), details.first()]) {
                await expect(el).toBeVisible();
                await expect(el).not.toBeEmpty();
            }
        });
    });

    test.describe("Download CV", () => {
        const CV_API = "**/api/v1/public/cv-variants/default";

        // Firefox bisa lambat merender halaman about (cold start + request API asli),
        // jadi tunggu tombol muncul dulu sebelum waitForEvent/click memakan budget timeout test.
        const BUTTON_READY = { timeout: 20_000 };

        test("should download a valid PDF named after the profile", async ({ aboutPage }, testInfo) => {
            const { heading, downloadCvButton } = aboutPage.locators;

            await expect(heading).toBeVisible();
            await expect(downloadCvButton).toBeVisible(BUTTON_READY);
            const fullName = (await heading.innerText()).trim();

            const downloadPromise = aboutPage.page.waitForEvent("download", { timeout: 15_000 });
            await downloadCvButton.click();
            const download = await downloadPromise;

            expect(download.suggestedFilename()).toBe(`${fullName.replace(/\s+/g, "-")}-CV.pdf`);

            // 1. Simpan salinan ke folder test-results/<nama-test>/
            const savedPath = testInfo.outputPath("cv.pdf");
            await download.saveAs(savedPath);

            // 2. Lampirkan ke HTML report
            await testInfo.attach("cv.pdf", { path: savedPath, contentType: "application/pdf" });

            // 3. Validasi isi file
            const file = await readFile(savedPath);
            expect(file.byteLength).toBeGreaterThan(0);
            expect(file.subarray(0, 5).toString()).toBe("%PDF-");

            await expect(downloadCvButton).toHaveText(/download cv/i);
            await expect(downloadCvButton).toBeEnabled();
        });

        test("should disable the button and show 'Generating...' while loading", async ({ aboutPage }) => {
            const { page, locators } = aboutPage;

            // Tahan response CV 1 detik supaya state loading bisa dicek dengan stabil
            await page.route(CV_API, async (route) => {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                await route.continue();
            });

            await expect(locators.downloadCvButton).toBeVisible(BUTTON_READY);

            const downloadPromise = page.waitForEvent("download", { timeout: 15_000 });
            await locators.downloadCvButton.click();

            await expect(locators.downloadCvButton).toHaveText("Generating...");
            await expect(locators.downloadCvButton).toBeDisabled();

            await downloadPromise;
            await expect(locators.downloadCvButton).toHaveText(/download cv/i);
            await expect(locators.downloadCvButton).toBeEnabled();
        });

        test("should show an error message when CV generation fails", async ({ aboutPage }) => {
            const { page, locators } = aboutPage;

            await page.route(CV_API, (route) => route.abort());

            await expect(locators.downloadCvButton).toBeVisible(BUTTON_READY);
            await locators.downloadCvButton.click();

            await expect(locators.downloadCvError).toHaveText("Could not generate the CV. Try again.", {
                timeout: 15_000,
            });
            await expect(locators.downloadCvButton).toHaveText(/download cv/i);
            await expect(locators.downloadCvButton).toBeEnabled();
        });
    });

    test.describe("Education", () => {
        test("should display at least 1 entry with program and institution", async ({ aboutPage }) => {
            const { entries, titles, subtitles } = aboutPage.locators.education;

            await expect(entries).not.toHaveCount(0);
            await expect(entries.first()).toBeVisible();

            for (const el of [titles.first(), subtitles.first()]) {
                await expect(el).toBeVisible();
                await expect(el).not.toBeEmpty();
            }
        });
    });

    test.describe("Skills", () => {
        test("should display at least 1 skill group with a title", async ({ aboutPage }) => {
            const { skillCards, skillCardTitles } = aboutPage.locators;

            await expect(skillCards).not.toHaveCount(0);
            await expect(skillCards.first()).toBeVisible();
            await expect(skillCardTitles.first()).not.toBeEmpty();
        });
    });

    test.describe("Certifications", () => {
        test("should display at least 1 certification with name and issuer", async ({ aboutPage }) => {
            const { certificationItems, certificationTitles, certificationIssuers } = aboutPage.locators;

            await expect(certificationItems).not.toHaveCount(0);
            await expect(certificationItems.first()).toBeVisible();

            for (const el of [certificationTitles.first(), certificationIssuers.first()]) {
                await expect(el).toBeVisible();
                await expect(el).not.toBeEmpty();
            }
        });

        test("should open credential and report links safely in a new tab", async ({ aboutPage }) => {
            const { certificationItems, certificationLinks } = aboutPage.locators;

            await expect(certificationItems.first()).toBeVisible();

            for (const link of await certificationLinks.all()) {
                await expect(link).toHaveAttribute("href", /^https?:\/\//);
                await expect(link).toHaveAttribute("target", "_blank");
                await expect(link).toHaveAttribute("rel", /noreferrer/);
            }
        });
    });
});
