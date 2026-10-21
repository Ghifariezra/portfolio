import type { ClosedIssue, ClosedIssues, ContributionRepo } from "../schemas/contribution.schema";

export interface RepoGroup {
    repo: ContributionRepo;
    issues: ClosedIssue[];
}

export interface ContributionSummary {
    issues: number;
    mergedPullRequests: number;
    repos: number;
}

export interface ContributionView {
    summary: ContributionSummary;
    groups: RepoGroup[];
}

/** Kelompokkan per repo. API mengurutkan issue terbaru dulu, jadi repo dengan kontribusi terbaru tampil paling atas. */
export function groupByRepo(issues: readonly ClosedIssue[]): RepoGroup[] {
    const groups = new Map<string, RepoGroup>();

    for (const issue of issues) {
        const group = groups.get(issue.repo.name);
        if (group) group.issues.push(issue);
        else groups.set(issue.repo.name, { repo: issue.repo, issues: [issue] });
    }

    return [...groups.values()];
}

/** PR yang sama bisa menutup lebih dari satu issue, jadi dihitung per URL unik. */
export function summarize(issues: readonly ClosedIssue[], groups: readonly RepoGroup[]): ContributionSummary {
    const mergedUrls = new Set(issues.flatMap((i) => i.pullRequests.filter((pr) => pr.merged).map((pr) => pr.url)));

    return { issues: issues.length, mergedPullRequests: mergedUrls.size, repos: groups.length };
}

/** Dipakai sebagai `select` (didefinisikan di luar hook supaya referensinya stabil). */
export function toContributionView({ issues }: ClosedIssues): ContributionView {
    const groups = groupByRepo(issues);
    return { summary: summarize(issues, groups), groups };
}
