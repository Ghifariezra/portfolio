import { useCallback, useMemo, useState } from "react";
import { topLanguage } from "../lib/project-helpers";
import { PROJECT_STATUSES, type ProjectItem, type ProjectStatus } from "../schemas/project.schema";
import { type RepoState, useGithubRepos } from "./use-github-repos";

/**
 * State dan turunan untuk filter halaman list: status (dari DB) dan bahasa (dari GitHub).
 * Bahasa muncul bertahap seiring query GitHub selesai.
 */
export function useProjectFilters(projects: readonly ProjectItem[] | undefined) {
    // Key query GitHub sama dengan halaman detail, jadi cache-nya dibagi.
    const githubByRepo = useGithubRepos(projects);

    const [status, setStatus] = useState<ProjectStatus | null>(null);
    const [language, setLanguage] = useState<string | null>(null);

    const githubOf = useCallback(
        (p: ProjectItem): RepoState | undefined => (p.github_repo ? githubByRepo.get(p.github_repo) : undefined),
        [githubByRepo],
    );

    // Hanya tampilkan status yang benar-benar ada di data, dengan urutan tetap.
    const statusCounts = useMemo(() => {
        const counts = new Map<ProjectStatus, number>();
        for (const p of projects ?? []) counts.set(p.status, (counts.get(p.status) ?? 0) + 1);
        return PROJECT_STATUSES.filter((s) => counts.has(s)).map((s) => [s, counts.get(s) ?? 0] as const);
    }, [projects]);

    const languageCounts = useMemo(() => {
        const counts = new Map<string, number>();
        for (const p of projects ?? []) {
            const lang = topLanguage(githubOf(p)?.data);
            if (lang) counts.set(lang, (counts.get(lang) ?? 0) + 1);
        }
        return [...counts].sort((a, b) => b[1] - a[1]);
    }, [projects, githubOf]);

    const filtered = useMemo(
        () =>
            (projects ?? []).filter(
                (p) => (!status || p.status === status) && (!language || topLanguage(githubOf(p)?.data) === language),
            ),
        [projects, status, language, githubOf],
    );

    return {
        status,
        setStatus,
        language,
        setLanguage,
        statusCounts,
        languageCounts,
        showFilters: statusCounts.length > 1 || languageCounts.length > 1,
        filtered,
        githubOf,
    };
}
