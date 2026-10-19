// Sama dengan CHECK constraint `category` di tabel skills (dan z.enum di API).
export const SKILL_CATEGORY_OPTIONS = [
    "language",
    "framework",
    "testing",
    "practice",
    "database",
    "devops",
    "data",
    "ai",
    "design",
    "other",
] as const;

export type SkillCategory = (typeof SKILL_CATEGORY_OPTIONS)[number];

export interface SkillFormState {
    name: string;
    category: SkillCategory;
    sort_order: string;
}

export const emptySkillForm: SkillFormState = { name: "", category: "other", sort_order: "0" };
