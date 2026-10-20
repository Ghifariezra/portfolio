import type { Locator, Page } from "@playwright/test";

export const aboutLocators = (page: Page) => {
    // `exact: true` supaya nama region tidak ke-match secara substring
    const region = (name: string) => page.getByRole("region", { name, exact: true });

    // Experience dan Education sama-sama pakai <TimelineList> (<ol>) berisi <TimelineEntry> (<li>).
    // `ol > li` sengaja dipakai supaya bullet (<ul><li>) di dalam entry tidak ikut ke-match.
    const timeline = (section: Locator) => {
        const entries = section.locator("ol > li");

        return {
            section,
            entries,
            titles: entries.getByRole("heading", { level: 3 }),
            subtitles: entries.locator("div + p"),
            details: entries.locator("div + p + p"),
        };
    };

    // Profile header: <header> yang berisi h1 (bukan header navbar / header kartu skill)
    const profileHeader = page.locator("header").filter({ has: page.getByRole("heading", { level: 1 }) });

    // Skills
    const skills = region("Skills");
    const skillCards = skills.getByRole("article");

    // Certifications
    const certifications = region("Certifications");
    const certificationItems = certifications.getByRole("listitem");

    return {
        // Profile header
        profileHeader,
        heading: profileHeader.getByRole("heading", { level: 1 }),
        headline: profileHeader.locator("h1 + p"),
        location: profileHeader.locator("h1 + p + p"),
        summary: profileHeader.locator("h1 + p + p + p"),
        githubLink: profileHeader.getByRole("link", { name: "GitHub profile" }),
        linkedinLink: profileHeader.getByRole("link", { name: "LinkedIn profile" }),
        websiteLink: profileHeader.getByRole("link", { name: "Website" }),
        downloadCvButton: profileHeader.getByRole("button"),
        downloadCvError: profileHeader.getByRole("alert"),

        // Timelines
        experience: timeline(region("Experience")),
        education: timeline(region("Education")),
        training: timeline(region("Training")),

        // Skills
        skills,
        skillCards,
        skillCardTitles: skillCards.getByRole("heading", { level: 3 }),

        // Certifications
        certifications,
        certificationItems,
        certificationTitles: certificationItems.getByRole("heading", { level: 3 }),
        certificationIssuers: certificationItems.locator("h3 + p"),
        certificationLinks: certifications.getByRole("link"),
    };
};

export type AboutLocators = ReturnType<typeof aboutLocators>;