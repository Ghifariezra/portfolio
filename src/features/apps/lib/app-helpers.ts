import type { AppItem, AppStatus } from "@/features/apps/schemas/app.schema";

export const APP_STATUS_LABEL: Record<AppStatus, string> = {
    coming_soon: "Coming soon",
    published: "Live",
    archived: "Archived",
};

/** App yang diarsipkan tidak perlu dipamerkan. */
export const isVisibleApp = (app: AppItem): boolean => app.status !== "archived";

/** Dipakai sebagai `select` (didefinisikan di luar hook supaya referensinya stabil). */
export const selectVisibleApps = (apps: AppItem[]): AppItem[] => apps.filter(isVisibleApp);

/** Metrics hanya untuk app yang sudah rilis dan punya Store ID (API menjamin published => ada Store ID). */
export const getStoreId = (app: AppItem): string | null => (app.status === "published" ? app.microsoft_store_id : null);
