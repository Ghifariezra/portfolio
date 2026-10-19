import { z } from "zod";

/** Data live dari Microsoft Store (GET /azure/apps/:storeId/analytics). */
export const storeAnalyticsSchema = z.object({
    applicationId: z.string(),
    range: z.object({ startDate: z.string(), endDate: z.string() }),
    totalInstalls: z.number(),
    topRegions: z.array(z.object({ market: z.string(), installCount: z.number(), percentage: z.number() })),
    dataFreshnessAt: z.string().nullable(),
});
export type StoreAnalytics = z.infer<typeof storeAnalyticsSchema>;
