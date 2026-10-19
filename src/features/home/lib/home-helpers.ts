import type { SkillGroup } from "@/features/portfolio/lib/portfolio-helpers";
import type { Certification } from "@/features/portfolio/schemas/certification.schema";
import type { Experience } from "@/features/portfolio/schemas/experience.schema";
import type { ProjectItem } from "@/features/projects/schemas/project.schema";

/** Jumlah item di Home. Daftar lengkapnya ada di halaman Projects dan About. */
export const HOME_LIMITS = { projects: 3, certifications: 3 } as const;

/** Kategori skill yang paling relevan untuk peran QA, dalam urutan tampil. Kategori yang kosong dilewati. */
export const HOME_SKILL_CATEGORIES = ["testing", "practice", "language"] as const;

/** Project featured lebih dulu, lalu sisanya; project yang diarsipkan tidak dipamerkan. */
export function selectFeaturedProjects(
    projects: readonly ProjectItem[],
    limit: number = HOME_LIMITS.projects,
): ProjectItem[] {
    const active = projects.filter((p) => p.status !== "archived");
    const featured = active.filter((p) => p.featured);
    const rest = active.filter((p) => !p.featured);
    return [...featured, ...rest].slice(0, limit);
}

/** Ambil grup skill sesuai urutan kategori yang diminta; kategori yang tidak ada dilewati. */
export function pickSkillGroups(
    groups: readonly SkillGroup[],
    categories: readonly string[] = HOME_SKILL_CATEGORIES,
): SkillGroup[] {
    return categories.flatMap((category) => groups.filter((g) => g.category.toLowerCase() === category));
}

/** Peran yang sedang berjalan (end_date kosong); kalau tidak ada, peran dengan tanggal mulai terbaru. */
export function selectCurrentExperience(experiences: readonly Experience[]): Experience | null {
    const ongoing = experiences.filter((e) => !e.end_date);
    const pool = ongoing.length > 0 ? ongoing : experiences;
    // tanggal ISO (YYYY-MM-DD) bisa dibandingkan sebagai string
    return [...pool].sort((a, b) => b.start_date.localeCompare(a.start_date))[0] ?? null;
}

export function selectTopCertifications(
    certifications: readonly Certification[],
    limit: number = HOME_LIMITS.certifications,
): Certification[] {
    return [...certifications].sort((a, b) => a.sort_order - b.sort_order).slice(0, limit);
}