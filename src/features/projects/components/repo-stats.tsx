import { GitFork, Star } from "@phosphor-icons/react";
import { formatMonth, formatNumber } from "@/lib/utils";
import type { GithubRepo } from "../schemas/github.schema";

export function RepoStats({ repo }: { repo: GithubRepo }) {
    return (
        <dl className="flex flex-wrap gap-x-8 gap-y-2 border-y-2 border-border py-3 font-mono text-xs">
            <div className="flex items-center gap-1">
                <Star size={14} />
                <dd>{formatNumber(repo.stars)}</dd>
                <dt className="sr-only">Stars</dt>
            </div>
            <div className="flex items-center gap-1">
                <GitFork size={14} />
                <dd>{formatNumber(repo.forks)}</dd>
                <dt className="sr-only">Forks</dt>
            </div>
            {repo.license && repo.license !== "NOASSERTION" && (
                <div className="flex gap-1">
                    <dt className="text-muted-foreground">License</dt>
                    <dd>{repo.license}</dd>
                </div>
            )}
            <div className="flex gap-1">
                <dt className="text-muted-foreground">Branch</dt>
                <dd>{repo.defaultBranch}</dd>
            </div>
            <div className="flex gap-1">
                <dt className="text-muted-foreground">Last push</dt>
                <dd>{formatMonth(repo.pushedAt)}</dd>
            </div>
        </dl>
    );
}
