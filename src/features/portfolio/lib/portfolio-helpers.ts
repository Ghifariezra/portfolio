import type { Education } from "../schemas/education.schema";
import type { Experience } from "../schemas/experience.schema";
import type { Skill } from "../schemas/skill.schema";

export const EMPLOYMENT_LABEL: Record<Experience["employment_type"], string> = {
    full_time: "Full-time",
    part_time: "Part-time",
    internship: "Internship",
    freelance: "Freelance",
    contract: "Contract",
};

export const EDUCATION_KIND_LABEL: Record<Education["kind"], string> = {
    formal: "Formal",
    training: "Training",
};

/** Gabungkan bagian yang terisi: ["Jakarta", null, "Indonesia"] -> "Jakarta, Indonesia". */
export const joinParts = (parts: readonly (string | null | undefined)[], separator = ", "): string =>
    parts.filter(Boolean).join(separator);

export interface SkillGroup {
    category: string;
    skills: Skill[];
}

/** Kelompokkan skill per kategori. Urutan kategori mengikuti skill pertama (sort_order terkecil). */
export function groupSkillsByCategory(skills: readonly Skill[]): SkillGroup[] {
    const groups = new Map<string, Skill[]>();
    for (const skill of [...skills].sort((a, b) => a.sort_order - b.sort_order)) {
        const list = groups.get(skill.category) ?? [];
        list.push(skill);
        groups.set(skill.category, list);
    }
    return [...groups].map(([category, items]) => ({ category, skills: items }));
}

export interface EducationGroups {
    formal: Education[];
    training: Education[];
}

/** Pisahkan pendidikan formal dan training/bootcamp. Urutan dari API (sort_order) dipertahankan di tiap grup. */
export function splitEducationByKind(education: readonly Education[]): EducationGroups {
    return {
        formal: education.filter((e) => e.kind === "formal"),
        training: education.filter((e) => e.kind === "training"),
    };
}