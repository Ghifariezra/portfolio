import { SectionHeading } from "@/components/ui/section-heading";
import { formatNumber } from "@/lib/utils";
import type { GithubRepo } from "../schemas/github.schema";

const MAX_VISIBLE = 12;

export function ContributorList({ contributors }: { contributors: GithubRepo["contributors"] }) {
    if (contributors.length === 0) return null;

    return (
        <section aria-label="Contributors">
            <SectionHeading>Contributors ({contributors.length})</SectionHeading>
            <ul className="grid gap-3 sm:grid-cols-2">
                {contributors.slice(0, MAX_VISIBLE).map((c) => (
                    <li key={c.login}>
                        <a
                            href={c.url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-3 border-2 border-border bg-card p-2 hover:border-primary"
                        >
                            <img
                                src={c.avatarUrl}
                                alt=""
                                loading="lazy"
                                className="size-10 shrink-0 border-2 border-border"
                            />
                            <span className="min-w-0">
                                <span className="block truncate text-sm font-semibold">{c.login}</span>
                                <span className="block font-mono text-xs text-muted-foreground">
                                    {formatNumber(c.contributions)} {c.contributions === 1 ? "commit" : "commits"}
                                </span>
                            </span>
                        </a>
                    </li>
                ))}
            </ul>
            {contributors.length > MAX_VISIBLE && (
                <p className="mt-3 font-mono text-xs text-muted-foreground">
                    +{contributors.length - MAX_VISIBLE} more on GitHub
                </p>
            )}
        </section>
    );
}
