import {
	// Article,
	BookOpen,
	FolderOpen,
	GlobeHemisphereWest,
	LockKey,
	PencilSimple,
	PlusCircle,
	Spinner,
	Translate,
	Trash,
} from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { memo, useState } from "react";
import { blogActions } from "@/lib/actions/blog.action";
import { useBlogDeletions } from "@/lib/hooks/use-blog";
import type { BlogListItem } from "@/lib/schemas/blog.schema";

// ─── Filter Button ────────────────────────────────────────────────────────────

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
			className={`px-5 py-2 rounded font-mono text-[11px] font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer shadow-brutal-sm dark:shadow-none ${
				active
					? "bg-primary text-primary-foreground border-2 dark:border border-border"
					: "border-2 dark:border border-border text-muted-foreground hover:border-primary hover:text-primary bg-card"
			}`}
		>
			{children}
		</button>
	);
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────

function ProgressBar({ value }: { value: number }) {
	return (
		<div className="space-y-1.5">
			<div className="flex justify-between items-center font-mono text-[10px] font-bold uppercase tracking-widest">
				<span className="text-muted-foreground">Progress</span>
				<span className="text-primary">{value}%</span>
			</div>
			<div className="h-2 w-full bg-muted border-2 dark:border border-border rounded-full overflow-hidden">
				<div
					className="h-full bg-primary transition-all duration-500"
					style={{ width: `${value}%` }}
				/>
			</div>
		</div>
	);
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
	const dot =
		status === "published"
			? "bg-green-500"
			: status === "scheduled"
				? "bg-yellow-500"
				: status === "archived"
					? "bg-red-400"
					: "bg-muted-foreground";

	return (
		<span className="inline-flex items-center gap-1.5 px-2 py-1 rounded font-mono text-[11px] font-bold tracking-wider uppercase text-foreground bg-muted border border-border">
			<span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
			{status}
		</span>
	);
}

// ─── Language Badge ───────────────────────────────────────────────────────────

function LanguageBadge({ lang }: { lang: string | null }) {
	if (!lang) return null;
	return (
		<span className="inline-flex items-center gap-1 px-2 py-1 rounded font-mono text-[11px] font-bold tracking-wider uppercase bg-accent/20 text-accent-foreground border border-accent/40">
			<Translate size={11} weight="bold" />
			{lang.toUpperCase()}
		</span>
	);
}

// ─── Blog Card ────────────────────────────────────────────────────────────────

function BlogCard({
	blog,
	onDelete,
	isDeleting,
}: {
	blog: BlogListItem;
	onDelete: (id: string, title: string) => void;
	isDeleting: boolean;
}) {
	return (
		<article className="group flex flex-col bg-card dark:bg-[#191c1e] border-2 dark:border border-border rounded-lg overflow-hidden shadow-brutal dark:shadow-none transition-all duration-300 hover:-translate-y-1 hover:border-primary relative">
			{/* Lock Indicator */}
			{blog.is_locked && (
				<div className="absolute top-3 left-3 z-10 bg-destructive text-destructive-foreground border-2 border-border px-2 py-1 rounded font-mono text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-brutal-sm">
					<LockKey size={12} weight="bold" />
					Locked
				</div>
			)}

			{/* Publish Status Badge (top-right) */}
			<div className="absolute top-3 right-3 z-10">
				<StatusBadge status={blog.publish_status} />
			</div>

			{/* Thumbnail / Cover */}
			<div className="h-40 w-full relative bg-muted overflow-hidden flex items-center justify-center border-b-2 dark:border-b border-border">
				{blog.image ? (
					<img
						src={blog.image}
						alt={blog.title}
						className="w-full h-full object-cover"
					/>
				) : (
					<div className="absolute inset-0 bg-linear-to-br from-card via-muted to-card flex items-center justify-center">
						<BookOpen
							size={48}
							className="text-border group-hover:text-primary/20 transition-colors duration-300"
						/>
					</div>
				)}
			</div>

			{/* Body */}
			<div className="p-6 flex flex-col grow gap-4">
				{/* Language + Published Date */}
				<div className="flex items-center justify-between gap-2 flex-wrap">
					<LanguageBadge lang={blog.type_language} />
					{blog.published_at ? (
						<span className="font-mono text-[10px] text-muted-foreground flex items-center gap-1">
							<GlobeHemisphereWest size={11} />
							{new Date(blog.published_at).toLocaleDateString("id-ID", {
								day: "numeric",
								month: "short",
								year: "numeric",
							})}
						</span>
					) : blog.publish_date ? (
						<span className="font-mono text-[10px] text-muted-foreground flex items-center gap-1">
							<GlobeHemisphereWest size={11} />
							{new Date(blog.publish_date).toLocaleDateString("id-ID", {
								day: "numeric",
								month: "short",
								year: "numeric",
							})}
						</span>
					) : null}
				</div>

				{/* Title & Description */}
				<div>
					<h3 className="font-heading text-xl font-bold text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
						{blog.title}
					</h3>
					<p className="font-sans text-sm text-muted-foreground line-clamp-2 min-h-10">
						{blog.description || "No description provided."}
					</p>
				</div>

				{/* Progress Bar */}
				<div className="mt-auto">
					<ProgressBar value={blog.progress} />
				</div>

				{/* Tags */}
				{blog.tags.length > 0 && (
					<div className="flex flex-wrap gap-1.5">
						{blog.tags.map((tag) => (
							<span
								key={tag.id}
								className="px-2 py-0.5 bg-background text-muted-foreground border-2 dark:border border-border font-mono text-[10px] font-bold uppercase tracking-wider rounded"
							>
								{tag.name}
							</span>
						))}
					</div>
				)}
			</div>

			{/* Footer Actions */}
			<div className="border-t-2 dark:border-t border-border grid grid-cols-2 divide-x-2 dark:divide-x divide-border">
				<Link
					to="/dashboard/posts/edit/$postId"
					params={{ postId: blog.id }}
					className="flex items-center justify-center gap-2 py-3 bg-card hover:bg-secondary text-foreground hover:text-primary transition-colors font-mono text-[11px] font-bold uppercase tracking-widest"
				>
					<PencilSimple size={14} weight="bold" />
					Edit
				</Link>
				<button
					type="button"
					onClick={() => {
						if (confirm(`Are you sure you want to delete "${blog.title}"?`)) {
							onDelete(blog.id, blog.title);
						}
					}}
					disabled={isDeleting || blog.is_locked}
					className="flex items-center justify-center gap-2 py-3 bg-card hover:bg-destructive text-foreground hover:text-destructive-foreground transition-colors font-mono text-[11px] font-bold uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
				>
					<Trash size={14} weight="bold" />
					Delete
				</button>
			</div>
		</article>
	);
}

// ─── Main Component ───────────────────────────────────────────────────────────

export const RouteComponent = memo(function RouteComponent() {
	const { data: res, isLoading } = blogActions.useGetBlogs();
	const blogs = (res?.data as BlogListItem[]) || [];

	const { deleteBlog, isDeletingBlog } = useBlogDeletions();
	const [filter, setFilter] = useState<
		"all" | "draft" | "published" | "archived" | "scheduled"
	>("all");

	const filteredBlogs = blogs.filter((b) =>
		filter === "all" ? true : b.publish_status === filter
	);

	const counts = {
		all: blogs.length,
		published: blogs.filter((b) => b.publish_status === "published").length,
		scheduled: blogs.filter((b) => b.publish_status === "scheduled").length,
		draft: blogs.filter((b) => b.publish_status === "draft").length,
		archived: blogs.filter((b) => b.publish_status === "archived").length,
	};

	return (
		<div className="flex flex-col h-full overflow-hidden bg-background">
			{/* Header */}
			<header className="border-b-2 dark:border-b border-border py-6 px-8 shrink-0 bg-card dark:bg-background flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div>
					<h2 className="text-3xl font-heading font-bold text-foreground mb-2">
						Posts
					</h2>
					<p className="text-muted-foreground font-mono text-xs uppercase tracking-widest">
						Manage your articles and written content.
					</p>
				</div>
				<Link
					to="/dashboard/posts/create"
					className="h-10 px-6 shrink-0 font-mono text-[11px] font-bold uppercase tracking-widest bg-primary text-primary-foreground border-2 dark:border border-border rounded-md shadow-brutal-sm dark:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all flex items-center justify-center gap-2"
				>
					<PlusCircle size={16} weight="bold" />
					Create New
				</Link>
			</header>

			{/* Scrollable Content */}
			<div className="flex-1 overflow-y-auto p-8">
				<div className="max-w-7xl mx-auto flex flex-col gap-6">
					{/* Filter Bar */}
					<div className="flex flex-wrap items-center gap-3 pb-6 border-b-2 dark:border-b border-border">
						<FilterButton
							active={filter === "all"}
							onClick={() => setFilter("all")}
						>
							All <span className="ml-1.5 opacity-60">({counts.all})</span>
						</FilterButton>
						<FilterButton
							active={filter === "published"}
							onClick={() => setFilter("published")}
						>
							Published{" "}
							<span className="ml-1.5 opacity-60">({counts.published})</span>
						</FilterButton>
						<FilterButton
							active={filter === "scheduled"}
							onClick={() => setFilter("scheduled")}
						>
							Scheduled{" "}
							<span className="ml-1.5 opacity-60">({counts.scheduled})</span>
						</FilterButton>
						<FilterButton
							active={filter === "draft"}
							onClick={() => setFilter("draft")}
						>
							Drafts <span className="ml-1.5 opacity-60">({counts.draft})</span>
						</FilterButton>
						<FilterButton
							active={filter === "archived"}
							onClick={() => setFilter("archived")}
						>
							Archived{" "}
							<span className="ml-1.5 opacity-60">({counts.archived})</span>
						</FilterButton>
					</div>

					{/* Grid */}
					{isLoading ? (
						<div className="flex items-center justify-center h-64 text-muted-foreground gap-3 font-mono text-sm uppercase tracking-widest">
							<Spinner size={24} className="animate-spin" />
							Loading Posts...
						</div>
					) : filteredBlogs.length > 0 ? (
						<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
							{filteredBlogs.map((blog) => (
								<BlogCard
									key={blog.id}
									blog={blog}
									onDelete={deleteBlog}
									isDeleting={isDeletingBlog}
								/>
							))}
						</div>
					) : (
						<div className="border-2 border-dashed border-border rounded-xl p-16 flex flex-col items-center justify-center text-center bg-card/50">
							<FolderOpen
								size={48}
								className="text-muted-foreground mb-4 opacity-50"
							/>
							<h3 className="font-heading text-xl font-bold text-foreground mb-2">
								No Posts Found
							</h3>
							<p className="font-sans text-sm text-muted-foreground mb-6 max-w-md">
								{filter === "all"
									? "You haven't written any posts yet. Start sharing your thoughts."
									: `No posts found with status "${filter}".`}
							</p>
							{filter === "all" && (
								<Link
									to="/dashboard/posts/create"
									className="h-10 px-6 font-mono text-[11px] font-bold uppercase tracking-widest bg-primary text-primary-foreground border-2 dark:border border-border rounded-md shadow-brutal-sm dark:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all flex items-center gap-2"
								>
									<PlusCircle size={16} weight="bold" />
									Write First Post
								</Link>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
});
