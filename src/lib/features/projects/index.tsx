import {
	ArrowUpRight,
	GithubLogo,
	Globe,
	Image as ImageIcon,
	Spinner,
} from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { publicActions } from "@/lib/actions/public.action";
import type { ProjectListItem } from "../../schemas/project.schema";

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
	// Penentuan warna dinamis berdasarkan nama status
	const isCompleted =
		status.toLowerCase().includes("completed") ||
		status.toLowerCase().includes("stable");
	const isArchived = status.toLowerCase().includes("archived");

	let colorClass = "text-primary bg-primary/10 border border-primary/20";
	let dotClass = "bg-primary animate-pulse";

	if (isCompleted) {
		colorClass = "text-foreground bg-muted border border-border";
		dotClass = "bg-green-400";
	} else if (isArchived) {
		colorClass = "text-muted-foreground bg-muted border border-border";
		dotClass = "bg-muted-foreground";
	}

	return (
		<span
			className={`inline-flex items-center gap-1.5 px-2 py-1 rounded font-mono text-[11px] font-semibold tracking-wider uppercase ${colorClass}`}
		>
			<span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
			{status}
		</span>
	);
}

function ProgressBar({
	// status,
	progress,
}: {
	status: string;
	progress: number;
}) {
	const isCompleted = progress >= 100;

	return (
		<div className="space-y-2">
			<div className="flex justify-between items-center">
				<span className="font-mono text-[11px] text-muted-foreground tracking-wider uppercase">
					Completion
				</span>
				<span
					className={`font-mono text-[11px] font-semibold ${isCompleted ? "text-foreground" : "text-primary"}`}
				>
					{progress}%
				</span>
			</div>
			<div className="h-1.5 w-full bg-muted rounded-full overflow-hidden border border-border/50">
				<div
					className={`h-full transition-all duration-700 ease-out rounded-full ${isCompleted ? "bg-foreground" : "bg-primary"}`}
					style={{ width: `${progress}%` }}
				/>
			</div>
		</div>
	);
}

function CategoryBadge({ category }: { category: string | null }) {
	if (!category) return null;
	return (
		<div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm border-2 border-border px-2.5 py-1 rounded font-mono text-[10px] text-foreground font-bold tracking-wider uppercase shadow-brutal-sm dark:shadow-none">
			{category}
		</div>
	);
}

function ProjectCard({ project }: { project: ProjectListItem }) {
	return (
		<article className="group flex flex-col bg-card border-2 border-border rounded-lg overflow-hidden transition-all duration-300 hover:border-foreground hover:-translate-y-1 hover:shadow-brutal dark:hover:shadow-none">
			{/* Thumbnail Image */}
			<Link
				to={`/projects/${project.slug}` as string}
				className="h-48 w-full relative bg-muted overflow-hidden border-b-2 border-border block outline-none focus-visible:border-primary"
			>
				{project.image ? (
					<img
						src={project.image}
						alt={project.title}
						className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
					/>
				) : (
					<div className="absolute inset-0 bg-linear-to-br from-card via-muted to-card flex items-center justify-center">
						<ImageIcon
							size={48}
							className="text-border group-hover:text-primary/40 transition-colors duration-300"
						/>
					</div>
				)}
				<CategoryBadge category={project.category_name} />
			</Link>

			{/* Content */}
			<div className="p-5 flex flex-col grow gap-4">
				{/* Header (Status & External Links) */}
				<div className="flex items-start justify-between gap-2">
					<StatusBadge status={project.development_status} />
					<div className="flex items-center gap-1.5 shrink-0">
						{project.embed_url && (
							<a
								href={project.embed_url}
								target="_blank"
								rel="noopener noreferrer"
								aria-label="External Link"
								className="text-muted-foreground hover:text-primary transition-colors bg-background p-1.5 rounded-md border-2 border-border shadow-brutal-sm hover:translate-x-0.5 hover:-translate-y-0.5"
							>
								{project.embed_type === "github" ? (
									<GithubLogo size={16} weight="bold" />
								) : (
									<ArrowUpRight size={16} weight="bold" />
								)}
							</a>
						)}
					</div>
				</div>

				{/* Title & Description */}
				<div>
					<Link to={`/projects/${project.slug}` as string} className="outline-none">
						<h2 className="font-heading text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-200">
							{project.title}
						</h2>
					</Link>
					<p className="font-sans text-sm text-muted-foreground leading-relaxed line-clamp-2">
						{project.description || "No description provided."}
					</p>
				</div>

				{/* Progress */}
				<div className="mt-auto pt-4">
					<ProgressBar
						status={project.development_status}
						progress={project.progress}
					/>
				</div>

				{/* Tech Stack */}
				<div className="flex flex-wrap gap-2 pt-4 border-t-2 border-border">
					{project.tags && project.tags.length > 0 ? (
						project.tags.slice(0, 4).map((tag) => (
							<span
								key={tag.id}
								className="px-2 py-0.5 bg-muted text-foreground border border-border/50 font-mono text-[10px] font-bold tracking-wider uppercase rounded shadow-sm"
							>
								{tag.name}
							</span>
						))
					) : (
						<span className="font-mono text-[10px] text-muted-foreground font-bold tracking-wider uppercase">
							No tags
						</span>
					)}
				</div>
			</div>
		</article>
	);
}

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
			className={`px-5 py-2 rounded-md font-mono text-[11px] font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer border-2 ${
				active
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
	// Panggil data asli dari Backend
	const { data: response, isLoading } = publicActions.useGetProjects();
	const projects = response?.data || [];

	const [activeFilter, setActiveFilter] = useState<string>("All");

	// Ekstrak status unik untuk membuat filter bar dinamis
	const availableStatuses = useMemo(() => {
		const statuses = projects.map((p) => p.development_status);
		const unique = Array.from(new Set(statuses));
		return ["All", ...unique];
	}, [projects]);

	// Lakukan filtering data
	const filteredProjects = useMemo(() => {
		if (activeFilter === "All") return projects;
		return projects.filter((p) => p.development_status === activeFilter);
	}, [projects, activeFilter]);

	// Hitung jumlah untuk tiap filter
	const getCount = (status: string) => {
		if (status === "All") return projects.length;
		return projects.filter((p) => p.development_status === status).length;
	};

	if (isLoading) {
		return (
			<div className="flex h-[70vh] w-full items-center justify-center flex-col gap-4">
				<Spinner
					size={40}
					className="animate-spin text-primary"
					weight="bold"
				/>
				<p className="font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground animate-pulse">
					Fetching Projects...
				</p>
			</div>
		);
	}

	return (
		<main className="grow w-full max-w-300 mx-auto px-6 py-20 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
			{/* Page Header */}
			<header className="mb-8">
				<p className="font-mono text-[11px] font-bold text-muted-foreground tracking-[0.15em] uppercase mb-4">
					— Portfolio
				</p>
				<h1 className="font-heading text-5xl md:text-6xl font-bold text-foreground tracking-tight mb-6">
					Projects
				</h1>
				<p className="font-sans text-lg text-muted-foreground max-w-2xl leading-relaxed">
					A curated collection of engineered solutions — from data pipelines and
					web scrapers to full-stack applications. Built with discipline and
					technical precision.
				</p>
			</header>

			{/* Filter Bar (Dinamis dari Database) */}
			<div className="flex flex-wrap items-center gap-3 pb-6 border-b-2 border-border mb-6">
				{availableStatuses.map((status) => (
					<FilterButton
						key={status}
						active={activeFilter === status}
						onClick={() => setActiveFilter(status)}
					>
						{status}{" "}
						<span className="ml-1.5 opacity-60">({getCount(status)})</span>
					</FilterButton>
				))}
			</div>

			{/* Grid */}
			{filteredProjects.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
					{filteredProjects.map((project) => (
						<ProjectCard key={project.id} project={project} />
					))}
				</div>
			) : (
				<div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-border rounded-lg bg-muted/50">
					<Globe size={48} className="text-muted-foreground mb-4 opacity-50" />
					<p className="font-heading text-xl font-bold text-foreground mb-2">
						No projects found.
					</p>
					<p className="font-mono text-sm text-muted-foreground uppercase tracking-widest">
						Try adjusting your filters.
					</p>
				</div>
			)}
		</main>
	);
}
