import type { QueryClient } from "@tanstack/react-query";
import { analyticsKeys } from "./analytics.action";
import { appKeys } from "./apps.action";
import { blogKeys } from "./blog.action";
import { projectKeys } from "./project.action";
import { publicKeys } from "./public.action";

/** Segarkan semua list konten di dashboard + semua query halaman publik. */
export const invalidateContent = (qc: QueryClient) =>
	Promise.all([
		qc.invalidateQueries({ queryKey: projectKeys.all }),
		qc.invalidateQueries({ queryKey: blogKeys.all }),
		qc.invalidateQueries({ queryKey: appKeys.all }),
		qc.invalidateQueries({
			queryKey: publicKeys.all,
			predicate: (q) => q.queryKey[1] !== "github",
		}),
		qc.invalidateQueries({ queryKey: analyticsKeys.overview() }),
	]);
