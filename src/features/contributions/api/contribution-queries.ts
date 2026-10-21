import { queryOptions } from "@tanstack/react-query";
import { STALE_TIME } from "@/config/cache";
import { closedIssuesSchema } from "@/features/contributions/schemas/contribution.schema";
import { apiGet } from "@/lib/api";

export const contributionKeys = {
    issues: ["github", "contributions", "issues"] as const,
};

/** Data live GitHub lewat API (bukan data DB), jadi halaman tetap bisa menampilkan state error sendiri saat upstream 502. */
export const closedIssuesQuery = () =>
    queryOptions({
        queryKey: contributionKeys.issues,
        queryFn: ({ signal }) => apiGet("/contributions/issues", closedIssuesSchema, signal),
        staleTime: STALE_TIME.CONTRIBUTIONS,
    });
