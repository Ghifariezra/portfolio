import type { GithubActivityItem, GithubContributionDay } from "@/lib/services/public.service";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const LEVELS = [
    "bg-muted",
    "bg-primary/25",
    "bg-primary/50",
    "bg-primary/75",
    "bg-primary",
];

function level(n: number) {
    if (n === 0) return 0;
    if (n <= 3) return 1;
    if (n <= 7) return 2;
    if (n <= 14) return 3;
    return 4;
}

export function describeEvent(e: GithubActivityItem) {
    switch (e.type) {
        case "PushEvent":
            return "Pushed to";
        case "PullRequestEvent":
            return `${e.action ?? "Updated"} a pull request in`;
        case "PullRequestReviewEvent":
            return "Reviewed a pull request in";
        case "IssuesEvent":
            return `${e.action ?? "Updated"} an issue in`;
        case "IssueCommentEvent":
            return "Commented in";
        case "CreateEvent":
            return e.ref ? `Created ${e.ref} in` : "Created";
        case "DeleteEvent":
            return `Deleted ${e.ref ?? "a ref"} in`;
        default:
            return `${e.type.replace("Event", "")} in`;
    }
}

export function ContributionGraph({
    weeks,
    showMonths = false,
}: {
    weeks: GithubContributionDay[][];
    showMonths?: boolean;
}) {
    return (
        <div className="overflow-x-auto pb-1">
            <div className="w-max">
                {showMonths && (
                    <div className="flex gap-1 mb-1 h-4">
                        {weeks.map((w, i) => {
                            const month = new Date(w[0].date).getUTCMonth();
                            const prev = i > 0 ? new Date(weeks[i - 1][0].date).getUTCMonth() : -1;
                            return (
                                <div key={w[0].date} className="relative size-3">
                                    {month !== prev && (
                                        <span className="absolute left-0 font-mono text-[10px] text-muted-foreground">
                                            {MONTHS[month]}
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
                <div className="flex gap-1">
                    {weeks.map((w, i) => (
                        <div key={w[0].date} className="flex flex-col gap-1">
                            {/* Minggu pertama tidak penuh: geser ke bawah sesuai weekday */}
                            {i === 0 &&
                                [0, 1, 2, 3, 4, 5, 6]
                                    .slice(0, w[0].weekday)
                                    .map((n) => <div key={`pad-${n}`} className="size-3" />)}
                            {w.map((d) => (
                                <div
                                    key={d.date}
                                    title={`${d.contributionCount} contributions on ${d.date}`}
                                    className={`size-3 rounded-sm ${LEVELS[level(d.contributionCount)]}`}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export function ActivityRow({ e }: { e: GithubActivityItem }) {
    return (
        <li className="flex flex-wrap items-baseline gap-x-1.5 text-sm">
            <span className="text-muted-foreground">{describeEvent(e)}</span>
            <a
                href={`https://github.com/${e.repo}`}
                target="_blank"
                rel="noreferrer"
                className="font-mono font-semibold hover:text-primary hover:underline"
            >
                {e.repo}
            </a>
            {e.title && (
                <a
                    href={e.url ?? `https://github.com/${e.repo}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-foreground hover:text-primary hover:underline"
                >
                    — {e.title}
                </a>
            )}
            <span className="text-muted-foreground">
                · {new Date(e.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
            </span>
        </li>
    );
}