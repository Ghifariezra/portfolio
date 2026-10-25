import { queryOptions } from "@tanstack/react-query";
import { STALE_TIME } from "@/config/cache";
import { type PostmanSource, postmanSourceSchema } from "@/features/projects/schemas/postman.schema";
import { apiGet, isNotFound } from "@/lib/api";

export const postmanKeys = {
    repo: (repo: string) => ["github", "postman", repo] as const,
};

/** Dipisah dari data repo supaya payload collection tidak ikut terbawa di halaman list. */
export const postmanCollectionQuery = (repo: string) =>
    queryOptions({
        queryKey: postmanKeys.repo(repo),
        queryFn: async ({ signal }): Promise<PostmanSource | null> => {
            try {
                return await apiGet(`/projects/${encodeURIComponent(repo)}/postman`, postmanSourceSchema, signal);
            } catch (error) {
                if (isNotFound(error)) return null; // repo tanpa collection, tab tidak ditampilkan
                throw error;
            }
        },
        staleTime: STALE_TIME.GITHUB,
    });
