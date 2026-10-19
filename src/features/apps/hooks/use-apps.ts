import { useQuery } from "@tanstack/react-query";
import { appsQuery } from "../api/app-queries";
import { selectVisibleApps } from "../lib/app-helpers";

/** Daftar app yang layak ditampilkan (tanpa yang diarsipkan). */
export const useApps = () => useQuery({ ...appsQuery(), select: selectVisibleApps });
