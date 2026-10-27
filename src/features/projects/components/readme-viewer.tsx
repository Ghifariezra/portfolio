import { BookOpen, FileText, ListBullets, MagnifyingGlass, RocketLaunch } from "@phosphor-icons/react";
import { Popover as PopoverPrimitive } from "radix-ui";
import { type KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { MarkdownContent } from "@/components/markdown/markdown-content";
import { EmptyState } from "@/components/ui/empty-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePostmanCollection } from "@/features/projects/hooks/use-postman-collection";
import { extractDocPaths } from "@/features/projects/lib/docs-links";
import { createReadmeUrlTransform } from "@/features/projects/lib/readme-url";
import type { GithubRepo } from "@/features/projects/schemas/github.schema";
import { DocsViewer } from "./docs-viewer";
import { PostmanViewer } from "./postman-viewer";

type OutlineItem = { id: string; text: string; level: number };

const FILTER_THRESHOLD = 6;
const SPY_OFFSET = 120;

const headerButton =
    "inline-flex size-8 shrink-0 items-center justify-center border-2 border-transparent text-muted-foreground transition-colors hover:border-border hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:outline-none data-[state=open]:border-border data-[state=open]:bg-muted data-[state=open]:text-foreground";

const tabTrigger =
    "h-auto flex-none cursor-pointer gap-1.5 px-2.5 py-3 text-sm font-semibold text-foreground after:bg-primary group-data-horizontal/tabs:after:bottom-0 sm:gap-2 sm:px-3";

export function ReadmeViewer({ repo }: { repo: GithubRepo }) {
    const bodyRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const [tab, setTab] = useState("readme");
    const [outline, setOutline] = useState<OutlineItem[]>([]);
    const [outlineOpen, setOutlineOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [activeId, setActiveId] = useState<string>();

    const { data: postman } = usePostmanCollection(repo.name);

    // Tab Docs muncul kalau README merujuk file di folder docs/.
    const docPaths = useMemo(() => extractDocPaths(repo.readme), [repo.readme]);

    useEffect(() => {
        if (!repo.readme) return;

        // Outline diambil dari heading yang sudah dirender, id-nya dari rehype-slug.
        const headings = bodyRef.current?.querySelectorAll<HTMLHeadingElement>("h1[id], h2[id], h3[id], h4[id]") ?? [];
        setOutline(
            Array.from(headings, (el) => ({
                id: el.id,
                text: el.textContent ?? "",
                level: Number(el.tagName[1]),
            })),
        );

        // README dirender setelah data dimuat, jadi hash di URL (/projects/x#overview) harus digulung manual.
        const id = decodeURIComponent(window.location.hash.slice(1));
        if (id) document.getElementById(id)?.scrollIntoView({ behavior: "instant" });
    }, [repo.readme]);

    // Scroll-spy: heading terakhir yang sudah lewat batas atas viewport dianggap aktif.
    useEffect(() => {
        if (!outline.length || tab !== "readme") return;
        const elements = outline.map((o) => document.getElementById(o.id)).filter((el): el is HTMLElement => !!el);
        if (!elements.length) return;

        let raf = 0;
        const update = () => {
            raf = 0;
            let current = elements[0].id;
            for (const el of elements) {
                if (el.getBoundingClientRect().top <= SPY_OFFSET) current = el.id;
                else break;
            }
            setActiveId(current);
        };
        const onScroll = () => {
            if (!raf) raf = requestAnimationFrame(update);
        };

        update();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", onScroll);
            if (raf) cancelAnimationFrame(raf);
        };
    }, [outline, tab]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return q ? outline.filter((o) => o.text.toLowerCase().includes(q)) : outline;
    }, [outline, query]);

    if (!repo.readme) return <EmptyState className="p-8">This repository has no README.</EmptyState>;

    const minLevel = Math.min(...outline.map((o) => o.level));
    const showFilter = outline.length > FILTER_THRESHOLD;

    const handleOpenChange = (open: boolean) => {
        setOutlineOpen(open);
        if (!open) setQuery("");
    };

    const goTo = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        history.replaceState(null, "", `#${id}`);
        handleOpenChange(false);
    };

    const itemButtons = () =>
        Array.from(listRef.current?.querySelectorAll<HTMLButtonElement>("[data-outline-item]") ?? []);

    const onInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            itemButtons()[0]?.focus();
        } else if (e.key === "Enter" && filtered[0]) {
            goTo(filtered[0].id);
        }
    };

    const onListKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
        if (!(e.target instanceof HTMLElement) || !e.target.closest("[data-outline-item]")) return;
        e.preventDefault();
        const items = itemButtons();
        const index = items.indexOf(e.target as HTMLButtonElement);
        if (e.key === "ArrowDown") items[Math.min(index + 1, items.length - 1)]?.focus();
        else if (index <= 0 && showFilter) inputRef.current?.focus();
        else items[Math.max(index - 1, 0)]?.focus();
    };

    return (
        <section aria-label="README">
            <Tabs value={tab} onValueChange={setTab} className="gap-0 border-2 border-border bg-card">
                <div className="flex items-center justify-between gap-2 border-b-2 border-border bg-card pr-2 pl-2">
                    {/* Tiga tab bisa melebihi lebar card di layar sempit, jadi daftar tab boleh digeser ke samping. */}
                    <div className="min-w-0 overflow-x-auto scrollbar-none">
                        <TabsList variant="line" className="group-data-horizontal/tabs:h-auto gap-0 p-0">
                            <TabsTrigger value="readme" className={tabTrigger}>
                                <BookOpen weight="bold" />
                                README
                            </TabsTrigger>
                            {docPaths.length > 0 && (
                                <TabsTrigger value="docs" className={tabTrigger}>
                                    <FileText weight="bold" />
                                    Docs
                                </TabsTrigger>
                            )}
                            {postman && (
                                <TabsTrigger value="postman" className={tabTrigger}>
                                    <RocketLaunch weight="bold" />
                                    Postman
                                </TabsTrigger>
                            )}
                        </TabsList>
                    </div>

                    {tab === "readme" && outline.length > 0 && (
                        <PopoverPrimitive.Root open={outlineOpen} onOpenChange={handleOpenChange}>
                            <PopoverPrimitive.Trigger aria-label="Outline" title="Outline" className={headerButton}>
                                <ListBullets size={18} />
                            </PopoverPrimitive.Trigger>

                            <PopoverPrimitive.Portal>
                                <PopoverPrimitive.Content
                                    align="end"
                                    sideOffset={8}
                                    collisionPadding={16}
                                    onKeyDown={onListKeyDown}
                                    onOpenAutoFocus={() => {
                                        // Gulung ke item aktif supaya posisi pembaca langsung kelihatan.
                                        requestAnimationFrame(() =>
                                            listRef.current
                                                ?.querySelector("[data-active='true']")
                                                ?.scrollIntoView({ block: "center" }),
                                        );
                                    }}
                                    // Jangan kembalikan fokus ke tombol, itu bikin halaman loncat balik.
                                    onCloseAutoFocus={(e) => e.preventDefault()}
                                    className="z-50 flex max-h-[min(24rem,var(--radix-popover-content-available-height))] w-80 max-w-[calc(100vw-2rem)] origin-(--radix-popover-content-transform-origin) flex-col border-2 border-border bg-popover text-popover-foreground shadow-brutal-sm outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2"
                                >
                                    <div className="flex shrink-0 items-center justify-between border-b-2 border-border px-3 py-2">
                                        <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                            Outline
                                        </span>
                                        <span className="border border-border bg-muted px-1.5 text-[11px] font-medium text-muted-foreground tabular-nums">
                                            {outline.length}
                                        </span>
                                    </div>

                                    {showFilter && (
                                        <div className="flex shrink-0 items-center gap-2 border-b-2 border-border px-3">
                                            <MagnifyingGlass size={14} className="shrink-0 text-muted-foreground" />
                                            <input
                                                ref={inputRef}
                                                value={query}
                                                onChange={(e) => setQuery(e.target.value)}
                                                onKeyDown={onInputKeyDown}
                                                placeholder="Filter headings"
                                                aria-label="Filter headings"
                                                className="h-9 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                                            />
                                        </div>
                                    )}

                                    <div ref={listRef} className="min-h-0 flex-1 overflow-y-auto p-1 scrollbar-thin">
                                        {filtered.length === 0 && (
                                            <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                                                No headings match "{query}"
                                            </p>
                                        )}

                                        {filtered.map((item) => {
                                            const active = item.id === activeId;
                                            const nested = item.level > minLevel;
                                            return (
                                                <button
                                                    key={item.id}
                                                    type="button"
                                                    data-outline-item
                                                    data-active={active}
                                                    aria-current={active ? "location" : undefined}
                                                    onClick={() => goTo(item.id)}
                                                    style={{ paddingLeft: 10 + (item.level - minLevel) * 14 }}
                                                    className={`line-clamp-2 block w-full border-l-2 py-1.5 pr-2 text-left text-sm leading-snug transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none ${
                                                        active
                                                            ? "border-primary bg-primary/10 font-semibold text-foreground"
                                                            : `border-transparent ${nested ? "text-muted-foreground" : "text-foreground"}`
                                                    }`}
                                                >
                                                    {item.text}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </PopoverPrimitive.Content>
                            </PopoverPrimitive.Portal>
                        </PopoverPrimitive.Root>
                    )}
                </div>

                {/* forceMount: README tetap ada di DOM saat pindah tab, jadi outline, anchor, dan diagram mermaid tidak dirender ulang. */}
                <TabsContent value="readme" forceMount className="p-4 text-base sm:p-6 data-[state=inactive]:hidden">
                    <div ref={bodyRef}>
                        <MarkdownContent urlTransform={createReadmeUrlTransform(repo)}>{repo.readme}</MarkdownContent>
                    </div>
                </TabsContent>

                {/* Tanpa forceMount: id heading dokumen bisa kembar dengan README, jadi hanya di-mount saat tab aktif. */}
                {docPaths.length > 0 && (
                    <TabsContent value="docs" className="p-4 text-base sm:p-6">
                        <DocsViewer repo={repo} />
                    </TabsContent>
                )}

                {postman && (
                    <TabsContent value="postman" className="p-4 text-base sm:p-6">
                        <PostmanViewer source={postman} />
                    </TabsContent>
                )}
            </Tabs>
        </section>
    );
}
