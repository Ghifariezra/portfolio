import { ArrowUpRight, Code, GithubLogo, Globe } from "@phosphor-icons/react";
import { useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

type ProjectStatus = "active" | "stable" | "beta" | "archived";
type ProjectType = "individual" | "collaboration";
type FilterType = "all" | ProjectType;

interface Project {
	id: string;
	title: string;
	description: string;
	status: ProjectStatus;
	type: ProjectType;
	progress: number;
	progressLabel: string;
	tags: string[];
	category: string;
	githubUrl?: string;
	liveUrl?: string;
	featured?: boolean;
	codePreview?: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
	ProjectStatus,
	{ label: string; color: string; dot: string }
> = {
	active: {
		label: "Active Development",
		color: "text-primary bg-primary/10 border border-primary/20",
		dot: "bg-primary animate-pulse",
	},
	stable: {
		label: "Stable Release",
		color: "text-foreground bg-muted border border-border",
		dot: "bg-green-400",
	},
	beta: {
		label: "Beta Testing",
		color: "text-foreground bg-muted border border-border",
		dot: "bg-yellow-400",
	},
	archived: {
		label: "Archived",
		color: "text-muted-foreground bg-muted border border-border",
		dot: "bg-muted-foreground",
	},
};

const PROGRESS_COLOR: Record<ProjectStatus, string> = {
	active: "bg-primary",
	stable: "bg-green-400",
	beta: "bg-yellow-400",
	archived: "bg-muted-foreground",
};

const projects: Project[] = [
	{
		id: "danaku",
		title: "DanaKu",
		description:
			"A comprehensive personal finance management dashboard. Features include transaction categorization, budget tracking algorithms, and real-time data visualization using D3.js.",
		status: "active",
		type: "individual",
		progress: 85,
		progressLabel: "Milestone: V1 Release",
		tags: ["React", "Node.js", "PostgreSQL", "D3.js"],
		category: "Web Application",
		githubUrl: "https://github.com/Ghifariezra",
		featured: true,
	},
	{
		id: "penyet-compressor",
		title: "Penyet Compressor",
		description:
			"A blazingly fast, browser-based image compression tool leveraging WebAssembly. Designed to reduce bandwidth usage without compromising perceptible visual quality. Local-first architecture ensures privacy.",
		status: "stable",
		type: "individual",
		progress: 100,
		progressLabel: "Optimization Pass",
		tags: ["Rust", "WASM", "TypeScript"],
		category: "Browser Tool",
		liveUrl: "https://ezdev.xyz",
		githubUrl: "https://github.com/Ghifariezra",
		featured: true,
	},
	{
		id: "data-pipeline",
		title: "ETL Data Pipeline",
		description:
			"End-to-end data extraction and transformation pipeline built during professional experience at Fastwork. Handles web scraping, cleaning, and structured CSV/database migration.",
		status: "stable",
		type: "individual",
		progress: 100,
		progressLabel: "Production",
		tags: ["Python", "PySpark", "PostgreSQL", "Airflow"],
		category: "Data Engineering",
		githubUrl: "https://github.com/Ghifariezra",
	},
	{
		id: "campus-oop",
		title: "JavaFX Desktop App",
		description:
			"Desktop application built as a final academic project. Applies OOP fundamentals — inheritance and polymorphism — implemented in Java with a JavaFX interface.",
		status: "archived",
		type: "individual",
		progress: 100,
		progressLabel: "Completed",
		tags: ["Java", "JavaFX", "OOP"],
		category: "Academic Project",
		githubUrl: "https://github.com/Ghifariezra",
		codePreview: `class Account extends BaseEntity {
  @Override
  public void validate() {
    super.validate();
    checkBalance();
  }
}`,
	},
	{
		id: "web-design-project",
		title: "Responsive Web Project",
		description:
			"A fully functional website built during Web Design coursework. Implements structured semantic HTML, responsive layout principles, and modern CSS techniques.",
		status: "archived",
		type: "individual",
		progress: 100,
		progressLabel: "Completed",
		tags: ["HTML", "CSS", "JavaScript", "Tailwind CSS"],
		category: "Academic Project",
		githubUrl: "https://github.com/Ghifariezra",
	},
	{
		id: "scraper-toolkit",
		title: "Web Scraper Toolkit",
		description:
			"Modular web scraping toolkit with configurable extractors, rate limiting, and structured output to CSV and relational databases. Built for repeatability and scale.",
		status: "beta",
		type: "individual",
		progress: 70,
		progressLabel: "Refinement",
		tags: ["Python", "PostgreSQL", "MySQL", "Docker"],
		category: "Data Engineering",
		githubUrl: "https://github.com/Ghifariezra",
	},
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: ProjectStatus }) {
	const cfg = STATUS_CONFIG[status];
	return (
		<span
			className={`inline-flex items-center gap-1.5 px-2 py-1 rounded font-mono text-[11px] font-semibold tracking-wider uppercase ${cfg.color}`}
		>
			<span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
			{cfg.label}
		</span>
	);
}

function ProgressBar({
	status,
	progress,
	label,
}: {
	status: ProjectStatus;
	progress: number;
	label: string;
}) {
	return (
		<div className="space-y-2">
			<div className="flex justify-between items-center">
				<span className="font-mono text-[11px] text-muted-foreground tracking-wider uppercase">
					{label}
				</span>
				<span
					className={`font-mono text-[11px] font-semibold ${
						status === "active"
							? "text-primary"
							: status === "stable"
								? "text-green-400"
								: status === "beta"
									? "text-yellow-400"
									: "text-muted-foreground"
					}`}
				>
					{progress}%
				</span>
			</div>
			<div className="h-px w-full bg-border overflow-hidden">
				<div
					className={`h-full transition-all duration-700 ease-out ${PROGRESS_COLOR[status]}`}
					style={{ width: `${progress}%` }}
				/>
			</div>
		</div>
	);
}

function CodePreview({ code }: { code: string }) {
	return (
		<div className="h-48 w-full bg-card border-b border-border flex items-center justify-center overflow-hidden relative">
			<div className="absolute inset-0 bg-linear-to-br from-card to-muted" />
			<pre className="relative font-mono text-[11px] text-primary/60 leading-relaxed px-6 whitespace-pre overflow-hidden">
				{code}
			</pre>
		</div>
	);
}

function CategoryBadge({ category }: { category: string }) {
	return (
		<div className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm border border-border px-2.5 py-1 rounded font-mono text-[10px] text-muted-foreground tracking-wider uppercase">
			{category}
		</div>
	);
}

function ProjectCard({ project }: { project: Project }) {
	return (
		<article className="group flex flex-col bg-card border border-border rounded-lg overflow-hidden transition-all duration-300 hover:border-primary/40 hover:-translate-y-0.5">
			{/* Thumbnail / Code Preview */}
			<div className="h-44 w-full relative bg-muted overflow-hidden">
				{project.codePreview ? (
					<CodePreview code={project.codePreview} />
				) : (
					<div className="absolute inset-0 bg-linear-to-br from-card via-muted to-card flex items-center justify-center">
						<Code
							size={48}
							className="text-border group-hover:text-primary/20 transition-colors duration-300"
						/>
					</div>
				)}
				<CategoryBadge category={project.category} />
			</div>

			{/* Content */}
			<div className="p-5 flex flex-col grow gap-4">
				{/* Header */}
				<div className="flex items-start justify-between gap-2">
					<StatusBadge status={project.status} />
					<div className="flex items-center gap-1.5 shrink-0">
						{project.githubUrl && (
							<a
								href={project.githubUrl}
								target="_blank"
								rel="noopener noreferrer"
								aria-label="GitHub Repository"
								className="text-muted-foreground hover:text-primary transition-colors p-1"
							>
								<GithubLogo size={16} />
							</a>
						)}
						{project.liveUrl && (
							<a
								href={project.liveUrl}
								target="_blank"
								rel="noopener noreferrer"
								aria-label="Live Site"
								className="text-muted-foreground hover:text-primary transition-colors p-1"
							>
								<ArrowUpRight size={16} />
							</a>
						)}
					</div>
				</div>

				{/* Title & Description */}
				<div>
					<h2 className="font-heading text-xl font-semibold text-foreground mb-1.5 group-hover:text-primary transition-colors duration-200">
						{project.title}
					</h2>
					<p className="font-sans text-sm text-muted-foreground leading-relaxed line-clamp-2">
						{project.description}
					</p>
				</div>

				{/* Progress */}
				<div className="mt-auto">
					<ProgressBar
						status={project.status}
						progress={project.progress}
						label={project.progressLabel}
					/>
				</div>

				{/* Tech Stack */}
				<div className="flex flex-wrap gap-1.5 pt-3 border-t border-border">
					{project.tags.map((tag) => (
						<span
							key={tag}
							className="px-2 py-0.5 bg-muted text-muted-foreground font-mono text-[11px] tracking-wider rounded"
						>
							{tag}
						</span>
					))}
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
			className={`px-5 py-2 rounded font-mono text-[11px] font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
				active
					? "bg-primary text-primary-foreground"
					: "border border-border text-muted-foreground hover:border-primary hover:text-primary bg-transparent"
			}`}
		>
			{children}
		</button>
	);
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function RouteComponent() {
	const [filter, setFilter] = useState<FilterType>("all");

	const filtered = projects.filter((p) =>
		filter === "all" ? true : p.type === filter
	);

	const counts = {
		all: projects.length,
		individual: projects.filter((p) => p.type === "individual").length,
		collaboration: projects.filter((p) => p.type === "collaboration").length,
	};

	return (
		<main className="grow w-full max-w-300 mx-auto px-6 py-20 flex flex-col gap-4">
			{/* Page Header */}
			<header className="mb-8">
				<p className="font-mono text-[11px] text-muted-foreground tracking-[0.15em] uppercase mb-4">
					— Portfolio
				</p>
				<h1 className="font-heading text-5xl md:text-6xl font-bold text-foreground tracking-tight mb-4">
					Projects
				</h1>
				<p className="font-sans text-lg text-muted-foreground max-w-2xl leading-relaxed">
					A curated collection of engineered solutions — from data pipelines and
					web scrapers to full-stack applications. Built with discipline and
					technical precision.
				</p>
			</header>

			{/* Filter Bar */}
			<div className="flex flex-wrap items-center gap-3 pb-6 border-b border-border mb-4">
				<FilterButton
					active={filter === "all"}
					onClick={() => setFilter("all")}
				>
					All <span className="ml-1.5 opacity-60">({counts.all})</span>
				</FilterButton>
				<FilterButton
					active={filter === "individual"}
					onClick={() => setFilter("individual")}
				>
					Individual{" "}
					<span className="ml-1.5 opacity-60">({counts.individual})</span>
				</FilterButton>
				<FilterButton
					active={filter === "collaboration"}
					onClick={() => setFilter("collaboration")}
				>
					Collaboration{" "}
					<span className="ml-1.5 opacity-60">({counts.collaboration})</span>
				</FilterButton>
			</div>

			{/* Grid */}
			{filtered.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
					{filtered.map((project) => (
						<ProjectCard key={project.id} project={project} />
					))}
				</div>
			) : (
				<div className="flex flex-col items-center justify-center py-24 text-center">
					<Globe size={40} className="text-border mb-4" />
					<p className="font-heading text-lg text-muted-foreground">
						No projects in this category yet.
					</p>
				</div>
			)}
		</main>
	);
}
