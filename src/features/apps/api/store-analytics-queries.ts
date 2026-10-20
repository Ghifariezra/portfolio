import { queryOptions } from "@tanstack/react-query";
import { STALE_TIME } from "@/config/cache";
import { storeAnalyticsSchema } from "@/features/apps/schemas/store-analytics.schema";
import { apiGet } from "@/lib/api";

export const storeAnalyticsKeys = {
    detail: (storeId: string) => ["azure", "analytics", storeId] as const,
};

export const storeAnalyticsQuery = (storeId: string) =>
    queryOptions({
        queryKey: storeAnalyticsKeys.detail(storeId),
        queryFn: ({ signal }) =>
            apiGet(`/azure/apps/${encodeURIComponent(storeId)}/analytics`, storeAnalyticsSchema, signal),
        staleTime: STALE_TIME.STORE_ANALYTICS,
    });
