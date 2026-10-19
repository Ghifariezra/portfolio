import { z } from "zod";

/** Data live dari GitHub (GET /projects/:repo, tanpa envelope). */
export const githubRepoSchema = z.object({
    name: z.string(),
    url: z.string(),
    about: z.string().nullable(),
    homepage: z.string().nullable(),
    topics: z.array(z.string()),
    license: z.string().nullable(),
    stars: z.number(),
    forks: z.number(),
    archived: z.boolean(),
    isFork: z.boolean(),
    defaultBranch: z.string(),
    pushedAt: z.string(),
    languages: z.array(z.object({ name: z.string(), percent: z.number() })),
    contributors: z.array(
        z.object({ login: z.string(), avatarUrl: z.string(), url: z.string(), contributions: z.number() }),
    ),
    readme: z.string().nullable(),
});
export type GithubRepo = z.infer<typeof githubRepoSchema>;
