import type { Locator, Page } from "@playwright/test";

export const homeLocators = (page: Page) => {
    const intro = page.getByRole("region", { name: "Introduction" });
    const paragraphs = intro.locator("p");
    const featuredProjects = page.getByRole("region", { name: "Featured projects" });
    const projectCards = featuredProjects.getByRole("article");

    return {
        // Introduction
        heading: intro.getByRole("heading", { level: 1 }),
        location: paragraphs.nth(0),
        jobTitle: intro.locator("h1 + p"),
        summary: intro.locator("h1 + p + p"),
        viewProjectsLink: intro.getByRole("link", { name: "View projects" }),
        aboutLink: intro.getByRole("link", { name: "About me" }),
        githubLink: intro.getByRole("link", { name: "GitHub profile" }),
        linkedinLink: intro.getByRole("link", { name: "LinkedIn profile" }),

        // Featured projects
        featuredProjects,
        projectCards,
        projectCard: (title: string): Locator =>
            projectCards.filter({ has: page.getByRole("heading", { name: title }) }),

        // Sections
        skills: page.getByRole("region", { name: "What I work with" }),
        certifications: page.getByRole("region", { name: "Certifications" }),
        contact: page.getByRole("region", { name: "Contact" }),
    };
};

export type HomeLocators = ReturnType<typeof homeLocators>;
