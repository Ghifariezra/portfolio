import type { TagItem } from "@/components/ui/tag-list";
import type { GithubRepo } from "@/features/projects/schemas/github.schema";
import type { ProjectItem, ProjectStatus } from "@/features/projects/schemas/project.schema";
import { isHttpUrl } from "@/lib/utils";

export const STATUS_LABEL: Record<ProjectStatus, string> = {
    in_progress: "In progress",
    completed: "Completed",
    archived: "Archived",
};

/** Bahasa utama = bahasa dengan persentase terbesar (API sudah mengurutkannya). */
export const topLanguage = (gh: GithubRepo | undefined): string | null => gh?.languages[0]?.name ?? null;

export interface ProjectDisplay {
    description: string | null;
    repoUrl: string | null;
    liveUrl: string | null;
    tags: TagItem[];
    language: string | null;
}

/**
 * Gabungkan data DB dengan data GitHub untuk ditampilkan.
 * Data DB menang; data GitHub mengisi yang kosong.
 */
export function resolveProjectDisplay(project: ProjectItem, gh: GithubRepo | undefined): ProjectDisplay {
    const homepage = gh?.homepage;

    // Skills dari DB dulu; kalau kosong, pakai topics GitHub.
    const tags: TagItem[] =
        project.skills.length > 0
            ? project.skills.map((s) => ({ key: s.id, label: s.name }))
            : (gh?.topics ?? []).map((t) => ({ key: t, label: t }));

    return {
        description: project.description ?? gh?.about ?? null,
        repoUrl: project.repo_url ?? gh?.url ?? null,
        liveUrl: project.live_url ?? (isHttpUrl(homepage) ? homepage : null),
        tags,
        language: topLanguage(gh),
    };
}
