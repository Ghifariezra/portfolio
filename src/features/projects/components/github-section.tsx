import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { isNotFound } from "@/lib/api";
import { useGithubRepo } from "../hooks/use-github-repo";
import { GithubDetail } from "./github-detail";

/** Dimuat terpisah dari data DB, jadi kegagalan GitHub (502) tidak menjatuhkan seluruh halaman. */
export function GithubSection({ repo }: { repo: string }) {
    const { data, isPending, error } = useGithubRepo(repo);

    if (isPending) return <Skeleton className="h-64 border-2 border-border" />;

    if (error) {
        return (
            <EmptyState className="p-5 text-left text-sm">
                {isNotFound(error)
                    ? "The GitHub repository isn't public or no longer exists."
                    : "GitHub details are unavailable right now."}
            </EmptyState>
        );
    }

    return <GithubDetail repo={data} />;
}
