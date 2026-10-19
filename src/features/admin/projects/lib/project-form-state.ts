import type { ProjectStatus } from "@/features/projects/schemas/project.schema";
import type { ProjectPayload } from "../api/project-admin-api";
import type { AdminProject } from "../schemas/admin-project.schema";

/** State form: semua input berupa string supaya cocok dengan <input>; diubah ke tipe API di toPayload(). */
export interface ProjectFormState {
    title: string;
    slug: string;
    github_repo: string;
    description: string;
    repo_url: string;
    live_url: string;
    image_url: string;
    status: ProjectStatus;
    featured: boolean;
    is_visible: boolean;
    sort_order: string;
    /** "YYYY-MM" (format <input type="month">), "" = kosong. */
    start_date: string;
    end_date: string;
    /** Satu bullet per baris. */
    bullets: string;
    skill_ids: string[];
}

export const emptyProjectForm: ProjectFormState = {
    title: "",
    slug: "",
    github_repo: "",
    description: "",
    repo_url: "",
    live_url: "",
    image_url: "",
    status: "completed",
    featured: false,
    is_visible: true,
    sort_order: "0",
    start_date: "",
    end_date: "",
    bullets: "",
    skill_ids: [],
};

export function toFormState(p: AdminProject): ProjectFormState {
    return {
        title: p.title,
        slug: p.slug,
        github_repo: p.github_repo ?? "",
        description: p.description ?? "",
        repo_url: p.repo_url ?? "",
        live_url: p.live_url ?? "",
        image_url: p.image_url ?? "",
        status: p.status,
        featured: p.featured,
        is_visible: p.is_visible,
        sort_order: String(p.sort_order),
        start_date: p.start_date?.slice(0, 7) ?? "", // "2026-08-01" -> "2026-08"
        end_date: p.end_date?.slice(0, 7) ?? "",
        bullets: p.bullets.join("\n"),
        skill_ids: p.skills.map((s) => s.id),
    };
}

const orNull = (value: string): string | null => {
    const trimmed = value.trim();
    return trimmed === "" ? null : trimmed;
};

export function toPayload(form: ProjectFormState): ProjectPayload {
    const repo = orNull(form.github_repo);
    const sortOrder = Number.parseInt(form.sort_order, 10);

    return {
        // Slug kosong: pakai nama repo GitHub, supaya URL-nya sama dengan repo-nya.
        slug: form.slug.trim() || repo || "",
        github_repo: repo,
        title: form.title.trim(),
        description: orNull(form.description),
        repo_url: orNull(form.repo_url),
        live_url: orNull(form.live_url),
        image_url: orNull(form.image_url),
        status: form.status,
        featured: form.featured,
        is_visible: form.is_visible,
        sort_order: Number.isNaN(sortOrder) ? 0 : sortOrder,
        start_date: orNull(form.start_date),
        end_date: orNull(form.end_date),
    };
}

export const parseBullets = (raw: string): string[] =>
    raw
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
