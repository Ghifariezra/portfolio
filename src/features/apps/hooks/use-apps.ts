import { useQuery } from "@tanstack/react-query";
import { appsQuery } from "@/features/apps/api/app-queries";
import { selectVisibleApps } from "@/features/apps/lib/app-helpers";

/** Daftar app yang layak ditampilkan (tanpa yang diarsipkan). */
export const useApps = () => useQuery({ ...appsQuery(), select: selectVisibleApps });
