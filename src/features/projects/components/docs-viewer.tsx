import { useMemo, useState } from "react";
import { MarkdownContent } from "@/components/markdown/markdown-content";
import { EmptyState } from "@/components/ui/empty-state";
import { ArrowSquareOut, Clock, FileText } from "@/components/ui/icons";
import { Skeleton } from "@/components/ui/skeleton";
import { useRepoDocs } from "@/features/projects/hooks/use-repo-docs";
import { createDocUrlTransform, docTitle, readingMinutes } from "@/features/projects/lib/docs-links";
import type { GithubRepo } from "@/features/projects/schemas/github.schema";
import { cn } from "@/lib/utils";

const LAYOUT = "grid gap-6 lg:grid-cols-[15rem_minmax(0,1fr)]";

function DocsSkeleton() {
    return (
        <div className={LAYOUT}>
            <div className="flex gap-2 lg:flex-col">
                {Array.from({ length: 4 }, (_, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: placeholder statis
                    <Skeleton key={i} className="h-16 w-56 shrink-0 border-2 border-border lg:w-full" />
                ))}
            </div>
            <Skeleton className="h-96 border-2 border-border" />
        </div>
    );
}

/** Dimuat terpisah dari README: dokumen baru diambil saat tab Docs dibuka, dan kegagalannya tidak menjatuhkan tab lain. */
export function DocsViewer({ repo }: { repo: GithubRepo }) {
    const { data, isPending, error } = useRepoDocs(repo.name);
    const [activePath, setActivePath] = useState<string>();

    const items = useMemo(
        () =>
            (data?.files ?? []).map((file) => ({
                ...file,
                title: docTitle(file.content, file.path),
                minutes: readingMinutes(file.content),
            })),
        [data],
    );

    const current = items.find((f) => f.path === activePath) ?? items[0];

    const urlTransform = useMemo(
        () => (current ? createDocUrlTransform(repo, current.path) : undefined),
        [repo, current],
    );

    if (isPending) return <DocsSkeleton />;

    if (error) return <EmptyState className="p-5 text-left text-sm">Docs are unavailable right now.</EmptyState>;

    if (!current) return <EmptyState className="p-8 text-sm">No documentation files were found.</EmptyState>;

    return (
        <div className={LAYOUT}>
            <nav
                aria-label="Docs"
                className="scrollbar-thin -mx-1 flex gap-2 self-start overflow-x-auto px-1 pb-2 lg:sticky lg:top-20 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0"
            >
                {items.map((item) => {
                    const active = item.path === current.path;
                    return (
                        <button
                            key={item.path}
                            type="button"
                            onClick={() => setActivePath(item.path)}
                            aria-current={active ? "page" : undefined}
                            className={cn(
                                "flex w-56 shrink-0 cursor-pointer items-start gap-3 border-2 p-3 text-left transition-colors lg:w-full",
                                active
                                    ? "border-primary bg-primary/10 shadow-brutal-sm"
                                    : "border-border bg-card hover:border-foreground",
                            )}
                        >
                            <FileText
                                size={20}
                                weight="bold"
                                className={cn("mt-0.5 shrink-0", active ? "text-primary" : "text-muted-foreground")}
                            />
                            <span className="min-w-0">
                                <span
                                    className={cn(
                                        "line-clamp-2 block text-sm leading-snug font-semibold",
                                        active ? "text-foreground" : "text-foreground/80",
                                    )}
                                >
                                    {item.title}
                                </span>
                                <span className="mt-1 block truncate font-mono text-[11px] text-muted-foreground">
                                    {item.path}
                                </span>
                            </span>
                        </button>
                    );
                })}
            </nav>

            <div className="min-w-0 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-border pb-4">
                    <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1">
                        <p className="min-w-0 font-mono text-xs break-all text-muted-foreground">
                            <span className="text-foreground">{current.path.split("/").slice(0, -1).join("/")}</span>
                            {" / "}
                            <span className="font-semibold text-foreground">{current.path.split("/").at(-1)}</span>
                        </p>
                        <span className="inline-flex items-center gap-1 border border-border bg-muted px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
                            <Clock size={12} />
                            {current.minutes} min read
                        </span>
                    </div>

                    <a
                        href={current.blobUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex shrink-0 items-center gap-1.5 border-2 border-border px-3 py-1.5 text-sm font-medium transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary"
                    >
                        View on GitHub
                        <ArrowSquareOut size={14} />
                    </a>
                </div>

                {/* key: pindah dokumen me-remount renderer, jadi diagram mermaid dan highlight tidak membawa state dokumen lama. */}
                <MarkdownContent key={current.path} urlTransform={urlTransform}>
                    {current.content}
                </MarkdownContent>
            </div>
        </div>
    );
}
