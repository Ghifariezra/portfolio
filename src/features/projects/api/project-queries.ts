import { queryOptions } from "@tanstack/react-query";
import { z } from "zod";
import { STALE_TIME } from "@/config/cache";
import { fetchPublic } from "@/lib/api";
import { projectItemSchema } from "../schemas/project.schema";

export const projectKeys = {
    all: ["portfolio", "projects"] as const,
    detail: (slug: string) => ["portfolio", "projects", slug] as const,
};

export const projectsQuery = () =>
    queryOptions({
        queryKey: projectKeys.all,
        queryFn: ({ signal }) => fetchPublic("/projects", z.array(projectItemSchema), signal),
        staleTime: STALE_TIME.PORTFOLIO,
    });

export const projectQuery = (slug: string) =>
    queryOptions({
        queryKey: projectKeys.detail(slug),
        queryFn: ({ signal }) => fetchPublic(`/projects/${encodeURIComponent(slug)}`, projectItemSchema, signal),
        staleTime: STALE_TIME.PORTFOLIO,
    });
