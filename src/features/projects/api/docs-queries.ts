import { queryOptions } from "@tanstack/react-query";
import { STALE_TIME } from "@/config/cache";
import { type RepoDocs, repoDocsSchema } from "@/features/projects/schemas/docs.schema";
import { apiGet, isNotFound } from "@/lib/api";

export const docsKeys = {
    repo: (repo: string) => ["github", "docs", repo] as const,
};

/** Dipisah dari data repo supaya isi dokumen (bisa ratusan KB) hanya dimuat saat tab Docs dibuka. */
export const repoDocsQuery = (repo: string) =>
    queryOptions({
        queryKey: docsKeys.repo(repo),
        queryFn: async ({ signal }): Promise<RepoDocs | null> => {
            try {
                return await apiGet(`/projects/${encodeURIComponent(repo)}/docs`, repoDocsSchema, signal);
            } catch (error) {
                if (isNotFound(error)) return null; // repo tanpa docs/*.md
                throw error;
            }
        },
        staleTime: STALE_TIME.GITHUB,
    });
