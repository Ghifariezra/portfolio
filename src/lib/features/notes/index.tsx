import {
	ArrowRight,
	Article,
	CaretLeft,
	CaretRight,
	Spinner,
} from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { publicActions } from "@/lib/actions/public.action";
import type { BlogListItem } from "../../schemas/blog.schema";

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
			className={`px-4 py-1.5 rounded-md font-mono text-[11px] font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer border-2 ${
				active
					? "bg-primary text-primary-foreground border-primary shadow-brutal-sm dark:shadow-none translate-x-0.5 translate-y-0.5"
					: "bg-card text-muted-foreground border-border hover:border-foreground hover:text-foreground shadow-brutal-sm dark:shadow-none hover:translate-x-0.5 hover:translate-y-0.5"
			}`}
		>
			{label}
		</button>
	);
}

function NoteCard({ blog }: { blog: BlogListItem }) {
	// 1. Format Tanggal
	const date = new Date(
		blog.published_at || blog.created_at
	).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});

	// 2. Tentukan "Kategori Utama" (Gunakan tipe bahasa atau tag pertama)
	const primaryCategory =
		blog.type_language ||
		(blog.tags && blog.tags.length > 0 ? blog.tags[0].name : "General");

	// 3. Estimasi Waktu Baca (Asumsi 200 kata per menit)
	const textContent = blog.content || blog.description || "";
	const wordCount = textContent.trim().split(/\s+/).length;
	const readingTimeMins = Math.max(1, Math.ceil(wordCount / 200));

	return (
		<article className="group bg-card border-2 border-border rounded-lg p-6 flex flex-col h-full relative overflow-hidden hover:border-foreground hover:-translate-y-1 hover:shadow-brutal transition-all duration-300 dark:hover:shadow-none">
			{/* Category badge */}
			<div className="mb-4">
				<span className="inline-block bg-muted text-foreground font-mono text-[10px] font-bold tracking-wider uppercase px-2 py-1 rounded shadow-sm border border-border/50">
					{primaryCategory}
				</span>
			</div>

			{/* Title */}
			<Link to={`/notes/${blog.slug}` as string} className="outline-none">
				<h2 className="font-heading text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-200 line-clamp-2 leading-snug">
					{blog.title}
				</h2>
			</Link>

			{/* Date + reading time */}
			<div className="flex items-center gap-3 mb-4">
				<time
					dateTime={blog.published_at || blog.created_at}
					className="font-mono text-[11px] text-muted-foreground tracking-wider"
				>
					{date}
				</time>
				<span className="text-border">·</span>
				<span className="font-mono text-[11px] text-muted-foreground tracking-wider">
					{readingTimeMins} min read
				</span>
			</div>

			{/* Excerpt */}
			<p className="font-sans text-sm text-muted-foreground leading-relaxed grow line-clamp-3 mb-6">
				{blog.description || "Click to read more about this topic..."}
			</p>

			{/* Footer */}
			<div className="mt-auto flex items-center justify-between pt-4 border-t-2 border-border">
				<div className="flex gap-2 flex-wrap">
					{blog.tags && blog.tags.length > 0 ? (
						blog.tags.slice(0, 2).map((tag) => (
							<span
								key={tag.id}
								className="font-mono text-[10px] text-muted-foreground font-bold uppercase tracking-wider bg-background px-1.5 py-0.5 border border-border rounded"
							>
								{tag.name}
							</span>
						))
					) : (
						<span className="font-mono text-[10px] text-muted-foreground tracking-wider">
							No tags
						</span>
					)}
				</div>
				<Link
					to={`/notes/${blog.slug}` as string}
					className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-primary hover:text-primary/80 transition-colors tracking-wider uppercase shrink-0 bg-primary/10 px-2 py-1 rounded"
					aria-label={`Read ${blog.title}`}
				>
					Read More <ArrowRight size={12} weight="bold" />
				</Link>
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
			className="w-10 h-10 flex items-center justify-center border-2 border-border rounded-md text-muted-foreground hover:border-foreground hover:text-foreground hover:shadow-brutal-sm transition-all disabled:opacity-30 disabled:hover:shadow-none disabled:cursor-not-allowed cursor-pointer bg-card dark:hover:shadow-none"
		>
			{children}
		</button>
	);
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function RouteComponent() {
	// 1. Fetch data notes (blogs) dari backend
	const { data: response, isLoading } = publicActions.useGetNotes();
	const notes = response?.data || [];

	const [activeCategory, setActiveCategory] = useState("All");
	const [page, setPage] = useState(1);

	// 2. Ekstrak Kategori Unik Dinamis (Menggunakan tipe bahasa atau tag pertama)
	const availableCategories = useMemo(() => {
		const categories = notes.map(
			(n) =>
				n.type_language ||
				(n.tags && n.tags.length > 0 ? n.tags[0].name : "General")
		);
		const unique = Array.from(new Set(categories));
		return ["All", ...unique];
	}, [notes]);

	// 3. Filter berdasarkan Kategori
	const filtered = useMemo(() => {
		if (activeCategory === "All") return notes;
		return notes.filter((n) => {
			const cat =
				n.type_language ||
				(n.tags && n.tags.length > 0 ? n.tags[0].name : "General");
			return cat === activeCategory;
		});
	}, [notes, activeCategory]);

	// 4. Hitung Pagination
	const totalPages = Math.ceil(filtered.length / NOTES_PER_PAGE);
	const paginated = filtered.slice(
		(page - 1) * NOTES_PER_PAGE,
		page * NOTES_PER_PAGE
	);

	function handleCategory(cat: string) {
		setActiveCategory(cat);
		setPage(1); // Kembalikan ke halaman pertama saat filter berubah
	}

	if (isLoading) {
		return (
			<div className="flex h-[70vh] w-full items-center justify-center flex-col gap-4">
				<Spinner
					size={40}
					className="animate-spin text-primary"
					weight="bold"
				/>
				<p className="font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground animate-pulse">
					Fetching Notes...
				</p>
			</div>
		);
	}

	return (
		<main className="grow w-full max-w-300 mx-auto px-6 py-20 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
			{/* Header */}
			<header className="mb-16 max-w-2xl">
				<p className="font-mono text-[11px] font-bold text-muted-foreground tracking-[0.15em] uppercase mb-4">
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

			{/* Category Filter (Dinamis) */}
			<div className="flex flex-wrap gap-3 mb-10 pb-6 border-b-2 border-border">
				{availableCategories.map((cat) => (
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
				<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 grow">
					{paginated.map((note) => (
						<NoteCard key={note.id} blog={note} />
					))}
				</div>
			) : (
				<div className="grow flex flex-col items-center justify-center py-24 border-2 border-dashed border-border rounded-lg bg-muted/50 text-center">
					<Article
						size={48}
						className="text-muted-foreground mb-4 opacity-50"
					/>
					<p className="font-heading text-xl font-bold text-foreground mb-2">
						No notes found.
					</p>
					<p className="font-mono text-sm text-muted-foreground uppercase tracking-widest">
						Check back later for new articles.
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
						<CaretLeft size={16} weight="bold" />
					</PaginationButton>

					<span className="font-mono text-xs font-bold text-foreground tracking-widest bg-muted px-4 py-2 border-2 border-border rounded-md shadow-brutal-sm dark:shadow-none">
						PAGE {page} OF {totalPages}
					</span>

					<PaginationButton
						onClick={() => setPage((p) => p + 1)}
						disabled={page === totalPages}
						ariaLabel="Next page"
					>
						<CaretRight size={16} weight="bold" />
					</PaginationButton>
				</div>
			)}
		</main>
	);
}
