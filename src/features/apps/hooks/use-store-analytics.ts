import { useQuery } from "@tanstack/react-query";
import { storeAnalyticsQuery } from "@/features/apps/api/store-analytics-queries";

export const useStoreAnalytics = (storeId: string) => useQuery(storeAnalyticsQuery(storeId));
