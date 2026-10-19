import { queryOptions } from "@tanstack/react-query";
import { z } from "zod";
import { adminGet, adminRequest } from "@/lib/api";
import { adminProjectSchema } from "../schemas/admin-project.schema";

export const adminProjectKeys = {
    all: ["admin", "projects"] as const,
    detail: (id: string) => ["admin", "projects", id] as const,
};

// Tanpa staleTime: data admin selalu dianggap basi, jadi form edit tidak pernah menampilkan data lama.
export const adminProjectsQuery = () =>
    queryOptions({
        queryKey: adminProjectKeys.all,
        queryFn: ({ signal }) => adminGet("/projects", z.array(adminProjectSchema), signal),
    });

export const adminProjectQuery = (id: string) =>
    queryOptions({
        queryKey: adminProjectKeys.detail(id),
        queryFn: ({ signal }) => adminGet(`/projects/${encodeURIComponent(id)}`, adminProjectSchema, signal),
    });

/** Field project yang dikirim ke POST/PATCH. Server memakai strictObject, jadi jangan kirim field lain. */
export interface ProjectPayload {
    slug: string;
    github_repo: string | null;
    title: string;
    description: string | null;
    repo_url: string | null;
    live_url: string | null;
    image_url: string | null;
    status: "in_progress" | "completed" | "archived";
    featured: boolean;
    is_visible: boolean;
    sort_order: number;
    start_date: string | null;
    end_date: string | null;
}

export interface SaveProjectInput {
    /** null = project baru (POST), selain itu PATCH. */
    id: string | null;
    payload: ProjectPayload;
    bullets: string[];
    skillIds: string[];
    /** Dipanggil begitu POST berhasil, sebelum bullets/skills disimpan. Lihat catatan di bawah. */
    onCreated?: (id: string) => void;
}

/**
 * Menyimpan satu project dalam tiga request: baris utama, lalu bullets, lalu skills.
 * Server memang memisahkannya (PUT /:id/bullets dan /:id/skills), dan tiap PUT atomik sendiri-sendiri.
 * Kalau request ke-2 atau ke-3 gagal, project sudah tersimpan; onCreated memberi tahu form id-nya
 * supaya percobaan berikutnya memakai PATCH, bukan POST yang akan ditolak 409 (slug sudah ada).
 */
export async function saveProject({ id, payload, bullets, skillIds, onCreated }: SaveProjectInput) {
    const row = id
        ? await adminRequest("PATCH", `/projects/${id}`, adminProjectSchema, payload)
        : await adminRequest("POST", "/projects", adminProjectSchema, payload);
    if (!id) onCreated?.(row.id);

    await adminRequest("PUT", `/projects/${row.id}/bullets`, adminProjectSchema, { bullets });
    return adminRequest("PUT", `/projects/${row.id}/skills`, adminProjectSchema, { skill_ids: skillIds });
}
