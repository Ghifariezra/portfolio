import { queryOptions } from "@tanstack/react-query";
import { cvDocumentSchema } from "@/features/cv/schemas/cv.schema";
import { apiData } from "@/lib/api"; // sesuaikan kalau helper fetch envelope { data } lu ada di file lain

const FIVE_MINUTES = 5 * 60 * 1000;

/** CV varian default, sudah dirapikan API. Hanya di-fetch saat tombol diklik (lewat queryClient.fetchQuery). */
export const cvQuery = () =>
    queryOptions({
        queryKey: ["portfolio", "cv", "default"],
        queryFn: ({ signal }) => apiData("/api/v1/public/cv-variants/default", cvDocumentSchema, signal),
        staleTime: FIVE_MINUTES,
    });
