import { ArrowUpRight, GithubLogo, Spinner } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import {
    ActivityRow,
    ContributionGraph,
} from "@/components/shared/github-parts";
import { publicActions } from "@/lib/actions/public.action";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function categoryOf(type: string): string {
    switch (type) {
        case "PullRequestEvent":
        case "PullRequestReviewEvent":
        case "PullRequestReviewCommentEvent":
            return "Pull Requests";
        case "IssuesEvent":
        case "IssueCommentEvent":
            return "Issues & Comments";
        case "CreateEvent":
        case "DeleteEvent":
            return "Branches";
        case "PushEvent":
            return "Commits";
        default:
            return "Other";
    }
}

function formatDay(day: string) {
    return new Date(`${day}T00:00:00`).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}

function FilterButton({
    active,
    onClick,
    children,
}: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`px-5 py-2 rounded-md font-mono text-[11px] font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer border-2 ${active
                    ? "bg-primary text-primary-foreground border-primary shadow-brutal-sm dark:shadow-none translate-x-0.5 translate-y-0.5"
                    : "border-border bg-card text-muted-foreground hover:border-foreground hover:text-foreground shadow-brutal-sm dark:shadow-none hover:translate-x-0.5 hover:translate-y-0.5"
                }`}
        >
            {children}
        </button>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function RouteComponent() {
    const contrib = publicActions.useGetGithubContributions();
    const activity = publicActions.useGetGithubActivity(100);
    const profile = publicActions.useGetGithubProfile();

    const [filter, setFilter] = useState<string>("All");

    const stats = contrib.data?.data;
    const gh = profile.data?.data;
    const events = useMemo(() => activity.data?.data ?? [], [activity.data]);

    const categories = useMemo(
        () => ["All", ...Array.from(new Set(events.map((e) => categoryOf(e.type))))],
        [events],
    );

    const filtered = useMemo(
        () =>
            filter === "All"
                ? events
                : events.filter((e) => categoryOf(e.type) === filter),
        [events, filter],
    );

    // Event sudah urut terbaru dulu, jadi urutan insert Map ikut urut.
    const groups = useMemo(() => {
        const map = new Map<string, typeof events>();
        for (const e of filtered) {
            const day = new Date(e.createdAt).toLocaleDateString("en-CA");
            map.set(day, [...(map.get(day) ?? []), e]);
        }
        return Array.from(map.entries());
    }, [filtered]);

    const topRepos = useMemo(() => {
        const counts = new Map<string, number>();
        for (const e of events) counts.set(e.repo, (counts.get(e.repo) ?? 0) + 1);
        return Array.from(counts.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
    }, [events]);

    const countOf = (c: string) =>
        c === "All" ? events.length : events.filter((e) => categoryOf(e.type) === c).length;

    if (contrib.isLoading || activity.isLoading) {
        return (
            <div className="flex h-[70vh] w-full items-center justify-center flex-col gap-4">
                <Spinner size={40} className="animate-spin text-primary" weight="bold" />
                <p className="font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground animate-pulse">
                    Fetching GitHub Activity...
                </p>
            </div>
        );
    }

    if (contrib.isError && activity.isError) {
        return (
            <main className="grow w-full max-w-300 mx-auto px-6 py-20">
                <div className="p-8 border-2 border-dashed border-border rounded-lg text-center bg-muted/50">
                    <p className="font-mono text-sm text-muted-foreground uppercase tracking-widest">
                        GitHub is unavailable right now. Try again later.
                    </p>
                </div>
            </main>
        );
    }

    const statCards = stats
        ? [
            { label: "Contributions", value: stats.total },
            { label: "Commits", value: stats.commits },
            { label: "Pull Requests", value: stats.pullRequests },
            { label: "Issues", value: stats.issues },
            { label: "Reviews", value: stats.reviews },
        ]
        : [];

    return (
        <main className="grow w-full max-w-300 mx-auto px-6 py-20 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Page Header */}
            <header className="mb-8">
                <p className="font-mono text-[11px] font-bold text-muted-foreground tracking-[0.15em] uppercase mb-4">
                    — Open Source
                </p>
                <h1 className="font-heading text-5xl md:text-6xl font-bold text-foreground tracking-tight mb-6">
                    GitHub Activity
                </h1>
                <p className="font-sans text-lg text-muted-foreground max-w-2xl leading-relaxed">
                    A live look at what I'm building — contributions over the past year
                    and the latest public activity across my repositories.
                </p>
                {gh && (
                    <div className="mt-6 flex flex-wrap items-center gap-4 font-mono text-xs text-muted-foreground">
                        <span>{gh.followers} followers</span>
                        <span>{gh.following} following</span>
                        <span>{gh.publicRepos} public repos</span>
                        <a
                            href={gh.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-primary font-bold uppercase tracking-widest hover:text-primary/80"
                        >
                            <GithubLogo weight="fill" className="w-4 h-4" />
                            Open on GitHub
                            <ArrowUpRight weight="bold" className="w-4 h-4" />
                        </a>
                    </div>
                )}
            </header>

            {/* Stats */}
            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {statCards.map((s) => (
                        <div
                            key={s.label}
                            className="bg-card border-2 border-border rounded-lg p-5"
                        >
                            <p className="font-heading text-3xl font-bold text-foreground">
                                {s.value}
                            </p>
                            <p className="font-mono text-[11px] tracking-wider uppercase text-muted-foreground mt-1">
                                {s.label}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* Contribution Graph */}
            {stats && (
                <div className="bg-card border-2 border-border rounded-lg p-6 mt-2">
                    <ContributionGraph weeks={stats.weeks} showMonths />
                </div>
            )}

            {/* Feed + Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
                <section className="lg:col-span-2">
                    <div className="flex flex-wrap items-center gap-3 pb-6 border-b-2 border-border mb-6">
                        {categories.map((c) => (
                            <FilterButton
                                key={c}
                                active={filter === c}
                                onClick={() => setFilter(c)}
                            >
                                {c} <span className="ml-1.5 opacity-60">({countOf(c)})</span>
                            </FilterButton>
                        ))}
                    </div>

                    {groups.length > 0 ? (
                        <div className="flex flex-col gap-8">
                            {groups.map(([day, items]) => (
                                <div key={day}>
                                    <h3 className="font-mono text-[11px] font-bold tracking-wider uppercase text-muted-foreground mb-3">
                                        {formatDay(day)}
                                    </h3>
                                    <ul className="space-y-3 border-l-4 border-border pl-4">
                                        {items.map((e) => (
                                            <ActivityRow key={e.id} e={e} />
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 border-2 border-dashed border-border rounded-lg text-center bg-muted/50">
                            <p className="font-mono text-sm text-muted-foreground uppercase tracking-widest">
                                No activity found.
                            </p>
                        </div>
                    )}

                    <p className="font-mono text-[11px] text-muted-foreground mt-8">
                        Showing the latest {events.length} public events. GitHub only keeps
                        up to 90 days of activity.
                    </p>
                </section>

                <aside>
                    <div className="bg-card border-2 border-border rounded-lg p-6">
                        <h3 className="font-heading text-xl font-medium text-foreground mb-4">
                            Most Active Repos
                        </h3>
                        <ul className="space-y-3">
                            {topRepos.map(([repo, count]) => (
                                <li key={repo} className="flex items-center justify-between gap-3">
                                    <a
                                        href={`https://github.com/${repo}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="font-mono text-xs font-semibold truncate hover:text-primary hover:underline"
                                    >
                                        {repo}
                                    </a>
                                    <span className="font-mono text-[11px] text-muted-foreground shrink-0">
                                        {count} events
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>
            </div>
        </main>
    );
}