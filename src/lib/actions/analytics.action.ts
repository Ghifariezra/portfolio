// src/lib/actions/analytics.action.ts
import { useQuery } from "@tanstack/react-query";
import {
	type AnalyticsOverviewResponse,
	analyticsService,
} from "@/lib/services/analytics.service";
import type { AppResponse } from "@/utils/middleware";

export const analyticsKeys = {
	all: ["analytics"] as const,
	overview: () => [...analyticsKeys.all, "overview"] as const,
};

export const analyticsActions = {
	useGetOverview() {
		return useQuery<AppResponse<AnalyticsOverviewResponse>, Error>({
			queryKey: analyticsKeys.overview(),
			queryFn: () => analyticsService.getOverviewAnalytics(),
			refetchInterval: 300000,
		});
	},
};
