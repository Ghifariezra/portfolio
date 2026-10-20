import { queryOptions } from "@tanstack/react-query";
import { z } from "zod";
import { STALE_TIME } from "@/config/cache";
import { appItemSchema } from "@/features/apps/schemas/app.schema";
import { fetchPublic } from "@/lib/api";

export const appKeys = {
    all: ["portfolio", "apps"] as const,
};

export const appsQuery = () =>
    queryOptions({
        queryKey: appKeys.all,
        queryFn: ({ signal }) => fetchPublic("/apps", z.array(appItemSchema), signal),
        staleTime: STALE_TIME.PORTFOLIO,
    });
