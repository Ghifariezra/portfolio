import { orNull } from "@/features/admin/lib/form-utils";
import type { AdminProfile } from "@/features/admin/profile/schemas/admin-profile.schema";

/** Field yang dikirim ke PATCH. Server memakai strictObject, jadi jangan kirim field lain (id, dst). */
export interface ProfilePayload {
    full_name: string;
    headline: string | null;
    summary: string | null;
    email: string;
    phone: string | null;
    city: string | null;
    region: string | null;
    country: string;
    linkedin_url: string | null;
    github_url: string | null;
    website_url: string | null;
    avatar_url: string | null;
}

export interface ProfileFormState {
    full_name: string;
    headline: string;
    summary: string;
    email: string;
    phone: string;
    city: string;
    region: string;
    country: string;
    linkedin_url: string;
    github_url: string;
    website_url: string;
    avatar_url: string;
}

export function toProfileForm(p: AdminProfile): ProfileFormState {
    return {
        full_name: p.full_name,
        headline: p.headline ?? "",
        summary: p.summary ?? "",
        email: p.email,
        phone: p.phone ?? "",
        city: p.city ?? "",
        region: p.region ?? "",
        country: p.country,
        linkedin_url: p.linkedin_url ?? "",
        github_url: p.github_url ?? "",
        website_url: p.website_url ?? "",
        avatar_url: p.avatar_url ?? "",
    };
}

export function toProfilePayload(form: ProfileFormState): ProfilePayload {
    return {
        full_name: form.full_name.trim(),
        headline: orNull(form.headline),
        summary: orNull(form.summary),
        email: form.email.trim(),
        phone: orNull(form.phone),
        city: orNull(form.city),
        region: orNull(form.region),
        country: form.country.trim(),
        linkedin_url: orNull(form.linkedin_url),
        github_url: orNull(form.github_url),
        website_url: orNull(form.website_url),
        avatar_url: orNull(form.avatar_url),
    };
}