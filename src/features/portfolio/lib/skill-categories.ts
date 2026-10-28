import {
    Bug,
    ChartLineUp,
    Code,
    Database,
    GitBranch,
    type Icon,
    ListChecks,
    PenNib,
    Sparkle,
    Stack,
    Wrench,
} from "@/components/ui/icons";

interface SkillCategoryMeta {
    label: string;
    icon: Icon;
}

// Kunci = nilai `category` dari API (huruf kecil). Kategori baru yang belum terdaftar tetap tampil
// lewat fallback di bawah, jadi menambah kategori di DB tidak merusak halaman.
const CATEGORY_META: Record<string, SkillCategoryMeta> = {
    ai: { label: "AI", icon: Sparkle },
    data: { label: "Data", icon: ChartLineUp },
    database: { label: "Database", icon: Database },
    design: { label: "Design", icon: PenNib },
    devops: { label: "DevOps", icon: GitBranch },
    framework: { label: "Frameworks", icon: Stack },
    language: { label: "Languages", icon: Code },
    practice: { label: "Practices", icon: ListChecks },
    testing: { label: "Testing", icon: Bug },
};

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

export function getSkillCategoryMeta(category: string): SkillCategoryMeta {
    return CATEGORY_META[category.toLowerCase()] ?? { label: capitalize(category), icon: Wrench };
}
