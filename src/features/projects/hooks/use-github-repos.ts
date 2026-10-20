import { type UseQueryResult, useQueries } from "@tanstack/react-query";
import { useMemo } from "react";
import { githubRepoQuery } from "@/features/projects/api/github-queries";
import type { GithubRepo } from "@/features/projects/schemas/github.schema";
import type { ProjectItem } from "@/features/projects/schemas/project.schema";

/**
 * Status detail GitHub per repo.
 * data kosong + isPending false = gagal (404/502): UI tetap tampil dari data DB.
 */
export interface RepoState {
    data: GithubRepo | undefined;
    isPending: boolean;
}

// Di luar hook supaya referensinya stabil (syarat `combine` di useQueries).
const combineRepoStates = (results: UseQueryResult<GithubRepo, Error>[]): RepoState[] =>
    results.map((r) => ({ data: r.data, isPending: r.isPending }));

/**
 * Satu query GitHub per repo unik, hasilnya Map<nama repo, state>.
 * Memakai githubRepoQuery yang sama dengan halaman detail, jadi cache-nya dibagi:
 * repo yang sudah dimuat di list tidak di-fetch lagi saat detail dibuka (dan sebaliknya).
 */
export function useGithubRepos(projects: readonly ProjectItem[] | undefined): Map<string, RepoState> {
    const repoNames = useMemo(
        () => [...new Set((projects ?? []).map((p) => p.github_repo).filter((r): r is string => r !== null))],
        [projects],
    );

    const states = useQueries({
        queries: repoNames.map((repo) => githubRepoQuery(repo)),
        combine: combineRepoStates,
    });

    return useMemo(
        () => new Map<string, RepoState>(repoNames.map((repo, i) => [repo, states[i]] as const)),
        [repoNames, states],
    );
}
