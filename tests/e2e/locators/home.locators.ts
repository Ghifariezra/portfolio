import type { Locator, Page } from "@playwright/test";

export const homeLocators = (page: Page) => {
    // `exact: true` supaya nama region tidak ke-match secara substring
    const region = (name: string) => page.getByRole("region", { name, exact: true });

    // Introduction
    const intro = region("Introduction");
    const paragraphs = intro.locator("p");

    // Featured projects
    const featuredProjects = region("Featured projects");
    const projectCards = featuredProjects.getByRole("article");

    // Currently
    const currentRole = region("Currently");
    const currentRoleCard = currentRole.getByRole("article");

    // What I work with
    const skills = region("What I work with");
    const skillCards = skills.getByRole("article");

    // Certifications
    const certifications = region("Certifications");
    const certificationItems = certifications.getByRole("listitem");

    // Open source
    const contributions = region("Open source");
    const contributionItems = contributions.getByRole("listitem");

    // Contact
    const contact = region("Contact");

    return {
        // Introduction
        intro,
        heading: intro.getByRole("heading", { level: 1 }),
        location: paragraphs.nth(0),
        jobTitle: intro.locator("h1 + p"),
        summary: intro.locator("h1 + p + p"),
        viewProjectsLink: intro.getByRole("link", { name: "View projects" }),
        aboutLink: intro.getByRole("link", { name: "About me" }),
        githubLink: intro.getByRole("link", { name: "GitHub profile" }),
        linkedinLink: intro.getByRole("link", { name: "LinkedIn profile" }),
        websiteLink: intro.getByRole("link", { name: "Website" }),

        // Featured projects
        featuredProjects,
        projectCards,
        allProjectsLink: featuredProjects.getByRole("link", { name: /all projects/i }),
        projectCard: (title: string): Locator =>
            projectCards.filter({ has: page.getByRole("heading", { name: title }) }),

        // Currently
        currentRole,
        currentRoleCard,
        currentRolePosition: currentRoleCard.getByRole("heading", { level: 3 }),
        currentRoleCompany: currentRoleCard.locator("h3 + p"),
        fullBackgroundLink: currentRole.getByRole("link", { name: /full background/i }),

        // Skills
        skills,
        skillCards,
        skillCardTitles: skillCards.getByRole("heading", { level: 3 }),
        allSkillsLink: skills.getByRole("link", { name: /all skills/i }),

        // Certifications
        certifications,
        certificationItems,
        certificationTitles: certificationItems.getByRole("heading", { level: 3 }),
        allCertificationsLink: certifications.getByRole("link", { name: /all certifications/i }),

        // Open source
        contributions,
        contributionItems,
        contributionTitles: contributionItems.getByRole("heading", { level: 3 }),
        contributionStatValues: contributions.locator("dd"),
        allContributionsLink: contributions.getByRole("link", { name: /all contributions/i }),
        contributionsErrorMessage: page.getByText("Could not load open source right now."),

        // Contact
        contact,
        contactHeading: contact.getByRole("heading", { name: "Get in touch" }),
        contactLinkedinLink: contact.getByRole("link", { name: "LinkedIn" }),
        contactGithubLink: contact.getByRole("link", { name: "GitHub" }),
    };
};

export type HomeLocators = ReturnType<typeof homeLocators>;
