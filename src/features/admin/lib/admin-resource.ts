import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { adminGet, adminRequest } from "@/lib/api";

export interface AdminEntity {
    id: string;
}

const deletedSchema = z.object({ id: z.string() });

/**
 * Satu resource admin = satu path di /api/v1/admin/<path>. Menghasilkan query key, query options,
 * dan fungsi request, supaya tiap fitur (projects, apps, experiences, ...) tidak menulis ulang pola yang sama.
 */
export function createAdminResource<T extends AdminEntity>(path: string, schema: z.ZodType<T>) {
    const base = `/${path}`;
    const item = (id: string) => `${base}/${encodeURIComponent(id)}`;
    const keys = {
        all: ["admin", path] as const,
        detail: (id: string) => ["admin", path, id] as const,
    };

    return {
        path,
        keys,
        // Tanpa staleTime: data admin selalu dianggap basi, jadi form edit tidak menampilkan data lama.
        listQuery: () =>
            queryOptions({
                queryKey: keys.all,
                queryFn: ({ signal }) => adminGet(base, z.array(schema), signal),
            }),
        detailQuery: (id: string) =>
            queryOptions({
                queryKey: keys.detail(id),
                queryFn: ({ signal }) => adminGet(item(id), schema, signal),
            }),
        create: (payload: object) => adminRequest("POST", base, schema, payload),
        update: (id: string, payload: object) => adminRequest("PATCH", item(id), schema, payload),
        remove: (id: string) => adminRequest("DELETE", item(id), deletedSchema),
        replaceBullets: (id: string, bullets: string[]) =>
            adminRequest("PUT", `${item(id)}/bullets`, schema, { bullets }),
        replaceSkills: (id: string, skillIds: string[]) =>
            adminRequest("PUT", `${item(id)}/skills`, schema, { skill_ids: skillIds }),
    };
}

export type AdminResource<T extends AdminEntity> = ReturnType<typeof createAdminResource<T>>;

/** Setelah tulis: segarkan data admin dan cache query publik, supaya halaman publik tidak menampilkan data lama. */
export function useRefreshAfterWrite() {
    const queryClient = useQueryClient();
    return () =>
        Promise.all([
            queryClient.invalidateQueries({ queryKey: ["admin"] }),
            queryClient.invalidateQueries({ queryKey: ["portfolio"] }),
        ]);
}

export function useToggleResource<T extends AdminEntity>(resource: AdminResource<T>) {
    const refresh = useRefreshAfterWrite();
    return useMutation({
        mutationFn: ({ id, patch }: { id: string; patch: Record<string, boolean> }) => resource.update(id, patch),
        onSettled: refresh,
    });
}

export function useDeleteResource<T extends AdminEntity>(resource: AdminResource<T>) {
    const refresh = useRefreshAfterWrite();
    return useMutation({
        mutationFn: (id: string) => resource.remove(id),
        onSettled: refresh,
    });
}

export interface SaveResourceInput {
    /** null = baru (POST), selain itu PATCH. */
    id: string | null;
    payload: object;
    /** Diisi hanya untuk resource yang punya PUT /:id/bullets. */
    bullets?: string[];
    /** Diisi hanya untuk resource yang punya PUT /:id/skills. */
    skillIds?: string[];
    /** Dipanggil begitu POST berhasil, sebelum langkah berikutnya. Percobaan ulang lalu memakai PATCH, bukan POST (409). */
    onCreated?: (id: string) => void;
}

/**
 * Menyimpan satu entitas dalam maksimal tiga request: baris utama, bullets, lalu skills.
 * Server memisahkannya dan tiap PUT atomik sendiri-sendiri.
 */
export async function saveResource<T extends AdminEntity>(
    resource: AdminResource<T>,
    input: SaveResourceInput,
): Promise<T> {
    let row = input.id ? await resource.update(input.id, input.payload) : await resource.create(input.payload);
    if (!input.id) input.onCreated?.(row.id);

    if (input.bullets) row = await resource.replaceBullets(row.id, input.bullets);
    if (input.skillIds) row = await resource.replaceSkills(row.id, input.skillIds);
    return row;
}
