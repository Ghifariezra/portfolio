import type { AdminApp } from "@/features/admin/apps/schemas/admin-app.schema";
import { orNull, parseSortOrder, slugify } from "@/features/admin/lib/form-utils";
import type { AppStatus } from "@/features/apps/schemas/app.schema";

/** Field yang dikirim ke POST/PATCH. Server memakai strictObject, jadi jangan kirim field lain. */
export interface AppPayload {
    project_id: string | null;
    slug: string;
    name: string;
    description: string | null;
    status: AppStatus;
    microsoft_store_id: string | null;
    store_url: string | null;
    website_url: string | null;
    icon_url: string | null;
    released_at: string | null;
    is_visible: boolean;
    sort_order: number;
}

export interface AppFormState {
    name: string;
    slug: string;
    description: string;
    status: AppStatus;
    microsoft_store_id: string;
    store_url: string;
    website_url: string;
    icon_url: string;
    /** "YYYY-MM-DD" (format <input type="date">). */
    released_at: string;
    /** "" = tidak terkait project mana pun. */
    project_id: string;
    sort_order: string;
    is_visible: boolean;
    skill_ids: string[];
}

export const emptyAppForm: AppFormState = {
    name: "",
    slug: "",
    description: "",
    status: "coming_soon",
    microsoft_store_id: "",
    store_url: "",
    website_url: "",
    icon_url: "",
    released_at: "",
    project_id: "",
    sort_order: "0",
    is_visible: true,
    skill_ids: [],
};

export function toAppForm(a: AdminApp): AppFormState {
    return {
        name: a.name,
        slug: a.slug,
        description: a.description ?? "",
        status: a.status,
        microsoft_store_id: a.microsoft_store_id ?? "",
        store_url: a.store_url ?? "",
        website_url: a.website_url ?? "",
        icon_url: a.icon_url ?? "",
        released_at: a.released_at?.slice(0, 10) ?? "",
        project_id: a.project_id ?? "",
        sort_order: String(a.sort_order),
        is_visible: a.is_visible,
        skill_ids: a.skills.map((s) => s.id),
    };
}

export function toAppPayload(form: AppFormState): AppPayload {
    return {
        project_id: orNull(form.project_id),
        // Slug kosong: turunkan dari nama (lowercase-kebab-case, sesuai aturan API).
        slug: form.slug.trim() || slugify(form.name),
        name: form.name.trim(),
        description: orNull(form.description),
        status: form.status,
        microsoft_store_id: orNull(form.microsoft_store_id),
        store_url: orNull(form.store_url),
        website_url: orNull(form.website_url),
        icon_url: orNull(form.icon_url),
        released_at: orNull(form.released_at),
        is_visible: form.is_visible,
        sort_order: parseSortOrder(form.sort_order),
    };
}
