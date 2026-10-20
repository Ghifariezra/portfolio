import { queryOptions } from "@tanstack/react-query";
import { z } from "zod";
import { adminCvVariantSchema, cvResolvedSchema } from "@/features/admin/cv/schemas/admin-cv-variant.schema";
import { createAdminResource } from "@/features/admin/lib/admin-resource";
import { adminGet, adminRequest } from "@/lib/api";

export interface CvItems {
    experience_ids: string[];
    education_ids: string[];
    certification_ids: string[];
    project_ids: string[];
    skill_ids: string[];
}

const base = createAdminResource("cv-variants", adminCvVariantSchema);

export const cvResource = {
    ...base,
    resolvedQuery: (id: string) =>
        queryOptions({
            queryKey: [...base.keys.detail(id), "resolved"] as const,
            queryFn: ({ signal }) =>
                adminGet(`/cv-variants/${encodeURIComponent(id)}/resolved`, cvResolvedSchema, signal),
        }),
    /** Mengganti semua item varian sekaligus. Server membalas dengan data resolved, bukan baris varian. */
    setItems: (id: string, items: CvItems) =>
        adminRequest("PUT", `/cv-variants/${encodeURIComponent(id)}/items`, z.unknown(), items),
    setDefault: (id: string) =>
        adminRequest("POST", `/cv-variants/${encodeURIComponent(id)}/default`, adminCvVariantSchema),
};

export const adminCvVariantsQuery = cvResource.listQuery;
export const adminCvVariantQuery = cvResource.detailQuery;

export interface SaveCvVariantInput {
    id: string | null;
    payload: object;
    items: CvItems;
    onCreated?: (id: string) => void;
}

/**
 * Dua request: baris varian (POST/PATCH), lalu PUT /items. Kalau PUT gagal, varian sudah tersimpan;
 * onCreated memberi tahu form id-nya supaya percobaan berikutnya memakai PATCH.
 */
export async function saveCvVariant({ id, payload, items, onCreated }: SaveCvVariantInput) {
    const row = id ? await cvResource.update(id, payload) : await cvResource.create(payload);
    if (!id) onCreated?.(row.id);

    await cvResource.setItems(row.id, items);
    return row;
}
