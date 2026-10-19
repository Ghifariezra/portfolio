import { queryOptions } from "@tanstack/react-query";
import { STALE_TIME } from "@/config/cache";
import { apiGet } from "@/lib/api";
import { githubRepoSchema } from "../schemas/github.schema";

export const githubKeys = {
    repo: (repo: string) => ["github", "repo", repo] as const,
};

/**
 * Data live, dipisah dari data DB supaya halaman tetap tampil walau upstream sedang 502.
 * Dipakai bersama oleh halaman list dan detail, jadi cache-nya dibagi.
 */
export const githubRepoQuery = (repo: string) =>
    queryOptions({
        queryKey: githubKeys.repo(repo),
        queryFn: ({ signal }) => apiGet(`/projects/${encodeURIComponent(repo)}`, githubRepoSchema, signal),
        staleTime: STALE_TIME.GITHUB,
    });
