import { z } from "zod";

export const contributionPullRequestSchema = z.object({
    number: z.number(),
    title: z.string(),
    url: z.string(),
    merged: z.boolean(),
    mergedAt: z.string().nullable(),
    author: z.string().nullable(),
});
export type ContributionPullRequest = z.infer<typeof contributionPullRequestSchema>;

export const contributionRepoSchema = z.object({
    /** "owner/repo" */
    name: z.string(),
    url: z.string(),
    about: z.string().nullable(),
    stars: z.number(),
    language: z.string().nullable(),
});
export type ContributionRepo = z.infer<typeof contributionRepoSchema>;

export const closedIssueSchema = z.object({
    number: z.number(),
    title: z.string(),
    url: z.string(),
    closedAt: z.string(),
    author: z.string().nullable(),
    labels: z.array(z.string()),
    repo: contributionRepoSchema,
    pullRequests: z.array(contributionPullRequestSchema),
});
export type ClosedIssue = z.infer<typeof closedIssueSchema>;

/** Data live dari GitHub (GET /contributions/issues, tanpa envelope). Issue closed milik orang lain yang di-assign ke saya. */
export const closedIssuesSchema = z.object({
    total: z.number(),
    issues: z.array(closedIssueSchema),
});
export type ClosedIssues = z.infer<typeof closedIssuesSchema>;
