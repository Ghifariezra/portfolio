import { ArrowRight, CaretLeft, CaretRight } from "@phosphor-icons/react";
import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Note {
    id: string;
    title: string;
    excerpt: string;
    date: string;
    datetime: string;
    category: string;
    tags: string[];
    readingTime: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
// Notes topik relevan dengan background CV: Data Engineering, Web Dev, OOP, DB

const notes: Note[] = [
    {
        id: "state-management-2024",
        title: "State Management Architectures in 2024",
        excerpt:
            "An analysis of shifting paradigms in frontend state management, moving from monolithic stores to atomic and derived state patterns — comparing Zustand, Jotai, and React Query.",
        date: "Oct 24, 2024",
        datetime: "2024-10-24",
        category: "Architecture",
        tags: ["TypeScript", "React"],
        readingTime: "8 min read",
    },
    {
        id: "postgresql-read-heavy",
        title: "Optimizing PostgreSQL for Read-Heavy Workloads",
        excerpt:
            "Practical techniques for index tuning, materialized views, and query restructuring to handle high-throughput analytical reads — lessons from real data migration work.",
        date: "Sep 12, 2024",
        datetime: "2024-09-12",
        category: "Database",
        tags: ["SQL", "PostgreSQL"],
        readingTime: "10 min read",
    },
    {
        id: "etl-pipeline-patterns",
        title: "ETL Pipeline Design Patterns",
        excerpt:
            "A breakdown of Extract-Transform-Load architecture decisions: batch vs streaming, idempotency, error handling, and orchestration with Apache Airflow based on hands-on experience.",
        date: "Jul 30, 2024",
        datetime: "2024-07-30",
        category: "Data Engineering",
        tags: ["Python", "Airflow"],
        readingTime: "12 min read",
    },
    {
        id: "web-scraping-at-scale",
        title: "Web Scraping at Scale Without Getting Blocked",
        excerpt:
            "Techniques for building resilient scrapers — rate limiting, rotating user agents, handling dynamic content, and structuring data cleanly into CSV and relational databases.",
        date: "Jun 5, 2024",
        datetime: "2024-06-05",
        category: "Data Engineering",
        tags: ["Python", "PostgreSQL"],
        readingTime: "9 min read",
    },
    {
        id: "docker-for-data-engineers",
        title: "Docker for Data Engineers: Beyond the Basics",
        excerpt:
            "Moving past simple containerization — multi-stage builds, volume strategies for persistent data, networking between pipeline services, and compose for local development environments.",
        date: "Apr 18, 2024",
        datetime: "2024-04-18",
        category: "Infrastructure",
        tags: ["Docker", "Infrastructure"],
        readingTime: "7 min read",
    },
    {
        id: "oop-java-patterns",
        title: "OOP Patterns That Actually Matter in Java",
        excerpt:
            "A practical look at inheritance, polymorphism, and composition — illustrated with real patterns from a JavaFX desktop application project and when to prefer each approach.",
        date: "Mar 2, 2024",
        datetime: "2024-03-02",
        category: "Software Design",
        tags: ["Java", "OOP"],
        readingTime: "6 min read",
    },
    {
        id: "react-tanstack-query",
        title: "Server State vs Client State with TanStack Query",
        excerpt:
            "Why treating server data as client state is the root of most React complexity — and how TanStack Query's mental model of stale-while-revalidate cleans it up fundamentally.",
        date: "Feb 10, 2024",
        datetime: "2024-02-10",
        category: "Architecture",
        tags: ["React", "TypeScript"],
        readingTime: "8 min read",
    },
    {
        id: "data-modeling-erd",
        title: "ERD Design That Scales: Lessons from Database Systems",
        excerpt:
            "How early normalization decisions compound over time — covering entity relationships, foreign key strategies, and when to denormalize for read performance in analytical schemas.",
        date: "Jan 15, 2024",
        datetime: "2024-01-15",
        category: "Database",
        tags: ["SQL", "Data Modeling"],
        readingTime: "11 min read",
    },
    {
        id: "pyspark-streaming",
        title: "Batch vs Streaming: Choosing the Right Processing Model",
        excerpt:
            "A comparison of batch and streaming processing paradigms using Apache Spark (PySpark), when latency requirements change the architecture, and trade-offs in fault tolerance.",
        date: "Dec 3, 2023",
        datetime: "2023-12-03",
        category: "Data Engineering",
        tags: ["Python", "PySpark"],
        readingTime: "10 min read",
    },
];

const CATEGORIES = ["All", "Architecture", "Data Engineering", "Database", "Infrastructure", "Software Design"];
const NOTES_PER_PAGE = 6;

// ─── Sub-components ───────────────────────────────────────────────────────────

function CategoryChip({
    label,
    active,
    onClick,
}: {
    label: string;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`px-4 py-1.5 rounded font-mono text-[11px] font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer ${active
                    ? "bg-primary text-primary-foreground"
                    : "border border-border text-muted-foreground hover:border-primary hover:text-primary bg-transparent"
                }`}
        >
            {label}
        </button>
    );
}

function NoteCard({ note }: { note: Note }) {
    return (
        <article className="group bg-card border border-border rounded-lg p-6 flex flex-col h-full relative overflow-hidden hover:border-primary/40 transition-colors duration-300">
            {/* Hover glow */}
            <div className="absolute inset-0 bg-linear-to-br from-primary/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-lg" />

            {/* Category badge */}
            <div className="mb-4">
                <span className="inline-block bg-muted text-foreground font-mono text-[10px] font-semibold tracking-wider uppercase px-2 py-1 rounded">
                    {note.category}
                </span>
            </div>

            {/* Title */}
            <h2 className="font-heading text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-200 line-clamp-2 leading-snug">
                {note.title}
            </h2>

            {/* Date + reading time */}
            <div className="flex items-center gap-3 mb-4">
                <time
                    dateTime={note.datetime}
                    className="font-mono text-[11px] text-muted-foreground tracking-wider"
                >
                    {note.date}
                </time>
                <span className="text-border">·</span>
                <span className="font-mono text-[11px] text-muted-foreground tracking-wider">
                    {note.readingTime}
                </span>
            </div>

            {/* Excerpt */}
            <p className="font-sans text-sm text-muted-foreground leading-relaxed grow line-clamp-3 mb-6">
                {note.excerpt}
            </p>

            {/* Footer */}
            <div className="mt-auto flex items-center justify-between pt-4 border-t border-border">
                <div className="flex gap-2 flex-wrap">
                    {note.tags.map((tag) => (
                        <span
                            key={tag}
                            className="font-mono text-[11px] text-muted-foreground tracking-wider"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
                <a
                    href={`/notes/${note.id}`}
                    className="inline-flex items-center gap-1 font-mono text-[11px] text-primary hover:text-primary/80 transition-colors tracking-wider uppercase shrink-0"
                    aria-label={`Read ${note.title}`}
                >
                    Read More <ArrowRight size={12} />
                </a>
            </div>
        </article>
    );
}

function PaginationButton({
    onClick,
    disabled,
    children,
    ariaLabel,
}: {
    onClick: () => void;
    disabled: boolean;
    children: React.ReactNode;
    ariaLabel: string;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            aria-label={ariaLabel}
            className="w-9 h-9 flex items-center justify-center border border-border rounded text-muted-foreground hover:border-primary hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
            {children}
        </button>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function RouteComponent() {
    const [activeCategory, setActiveCategory] = useState("All");
    const [page, setPage] = useState(1);

    const filtered =
        activeCategory === "All"
            ? notes
            : notes.filter((n) => n.category === activeCategory);

    const totalPages = Math.ceil(filtered.length / NOTES_PER_PAGE);
    const paginated = filtered.slice(
        (page - 1) * NOTES_PER_PAGE,
        page * NOTES_PER_PAGE,
    );

    function handleCategory(cat: string) {
        setActiveCategory(cat);
        setPage(1);
    }

    return (
        <main className="grow w-full max-w-300 mx-auto px-6 py-20 flex flex-col">
            {/* Header */}
            <header className="mb-16 max-w-2xl">
                <p className="font-mono text-[11px] text-muted-foreground tracking-[0.15em] uppercase mb-4">
                    — Writing
                </p>
                <h1 className="font-heading text-5xl md:text-6xl font-bold text-foreground tracking-tight mb-4">
                    Technical Notes
                </h1>
                <p className="font-sans text-lg text-muted-foreground leading-relaxed">
                    Deep dives into data engineering, architecture, and software design. A
                    collection of thoughts, post-mortems, and technical explorations.
                </p>
            </header>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-10 pb-6 border-b border-border">
                {CATEGORIES.map((cat) => (
                    <CategoryChip
                        key={cat}
                        label={cat}
                        active={activeCategory === cat}
                        onClick={() => handleCategory(cat)}
                    />
                ))}
            </div>

            {/* Notes Grid */}
            {paginated.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 grow">
                    {paginated.map((note) => (
                        <NoteCard key={note.id} note={note} />
                    ))}
                </div>
            ) : (
                <div className="grow flex items-center justify-center">
                    <p className="font-mono text-sm text-muted-foreground tracking-wider">
                        No notes in this category yet.
                    </p>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-16 flex justify-center items-center gap-4">
                    <PaginationButton
                        onClick={() => setPage((p) => p - 1)}
                        disabled={page === 1}
                        ariaLabel="Previous page"
                    >
                        <CaretLeft size={14} />
                    </PaginationButton>

                    <span className="font-mono text-[12px] text-muted-foreground tracking-wider">
                        Page {page} of {totalPages}
                    </span>

                    <PaginationButton
                        onClick={() => setPage((p) => p + 1)}
                        disabled={page === totalPages}
                        ariaLabel="Next page"
                    >
                        <CaretRight size={14} />
                    </PaginationButton>
                </div>
            )}
        </main>
    );
}