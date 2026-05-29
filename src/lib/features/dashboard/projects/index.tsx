import {
	ArrowUpRight,
	Code,
	FolderOpen,
	GithubLogo,
	LockKey,
	PencilSimple,
	PlusCircle,
	Spinner,
	Trash,
	Users,
} from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { memo, useState } from "react";
import { projectActions } from "@/lib/actions/project.action";
import { useProjectDeletions } from "@/lib/hooks/use-project";
import type { ProjectListItem } from "@/lib/schemas/project.schema";

// ─── Filter Button Sub-component ────────────────────────────────────────────────────────────

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

// ─── Main Component ───────────────────────────────────────────────────────────

export const RouteComponent = memo(function RouteComponent() {
	const { data: res, isLoading } = projectActions.useGetProjects();
	const projects = (res?.data as ProjectListItem[]) || [];

	const { deleteProject, isDeletingProject } = useProjectDeletions();
	const [filter, setFilter] = useState<
		"all" | "draft" | "published" | "archived" | "scheduled"
	>("all");

	const filteredProjects = projects.filter((p) =>
		filter === "all" ? true : p.publish_status === filter
	);

	const counts = {
		all: projects.length,
		published: projects.filter((p) => p.publish_status === "published").length,
		draft: projects.filter((p) => p.publish_status === "draft").length,
		archived: projects.filter((p) => p.publish_status === "archived").length,
		scheduled: projects.filter((p) => p.publish_status === "scheduled").length,
	};

	return (
		<div className="flex flex-col h-full overflow-hidden bg-background">
			{/* Topbar / Header */}
			<header className="border-b-2 dark:border-b border-border py-6 px-8 shrink-0 bg-card dark:bg-background flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div>
					<h2 className="text-3xl font-heading font-bold text-foreground mb-2">
						Projects
					</h2>
					<p className="text-muted-foreground font-mono text-xs uppercase tracking-widest">
						Manage your engineering portfolio and works.
					</p>
				</div>
				<Link
					to="/dashboard/projects/create"
					className="h-10 px-6 shrink-0 font-mono text-[11px] font-bold uppercase tracking-widest bg-primary text-primary-foreground border-2 dark:border border-border rounded-md shadow-brutal-sm dark:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all flex items-center justify-center gap-2"
				>
					<PlusCircle size={16} weight="bold" />
					Create New
				</Link>
			</header>

			{/* Content Scrollable Area */}
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

					{/* Grid Area */}
					{isLoading ? (
						<div className="flex items-center justify-center h-64 text-muted-foreground gap-3 font-mono text-sm uppercase tracking-widest">
							<Spinner size={24} className="animate-spin" />
							Loading Projects...
						</div>
					) : filteredProjects.length > 0 ? (
						<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
							{filteredProjects.map((project) => (
								<article
									key={project.id}
									className="group flex flex-col bg-card dark:bg-[#191c1e] border-2 dark:border border-border rounded-lg overflow-hidden shadow-brutal dark:shadow-none transition-all duration-300 hover:-translate-y-1 hover:border-primary relative"
								>
									{/* Lock Indicator Overlay */}
									{project.is_locked && (
										<div className="absolute top-3 left-3 z-10 bg-destructive text-destructive-foreground backdrop-blur-sm border-2 border-border px-2 py-1 rounded font-mono text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-brutal-sm">
											<LockKey size={12} weight="bold" />
											Locked
										</div>
									)}

									{/* Category Badge */}
									<div className="absolute top-3 right-3 z-10 bg-background/90 text-foreground backdrop-blur-sm border-2 dark:border border-border px-2 py-1 rounded font-mono text-[10px] font-bold tracking-wider uppercase shadow-brutal-sm dark:shadow-none">
										{project.category_name || "Uncategorized"}
									</div>

									{/* Thumbnail Area */}
									<div className="h-44 w-full relative bg-muted overflow-hidden flex items-center justify-center border-b-2 dark:border-b border-border">
										{project.image ? (
											<img
												src={project.image}
												alt={project.title}
												className="w-full h-full object-cover"
											/>
										) : (
											<div className="absolute inset-0 bg-linear-to-br from-card via-muted to-card flex items-center justify-center">
												<Code
													size={48}
													className="text-border group-hover:text-primary/20 transition-colors duration-300"
												/>
											</div>
										)}
									</div>

									{/* Body Area */}
									<div className="p-6 flex flex-col grow gap-4">
										{/* Status & Links Header */}
										<div className="flex items-start justify-between gap-2">
											<span className="inline-flex items-center gap-1.5 px-2 py-1 rounded font-mono text-[11px] font-bold tracking-wider uppercase text-foreground bg-muted border border-border">
												<span
													className={`w-1.5 h-1.5 rounded-full ${project.publish_status === "published" ? "bg-green-500" : "bg-muted-foreground"}`}
												/>
												{project.publish_status}
											</span>

											<div className="flex items-center gap-1.5 shrink-0">
												{project.embed_url && (
													<a
														href={project.embed_url}
														target="_blank"
														rel="noopener noreferrer"
														className="text-muted-foreground hover:text-primary transition-colors p-1"
													>
														{project.embed_type === "github" ? (
															<GithubLogo size={16} />
														) : (
															<ArrowUpRight size={16} />
														)}
													</a>
												)}
											</div>
										</div>

										{/* Title & Description */}
										<div>
											<h3 className="font-heading text-xl font-bold text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
												{project.title}
											</h3>
											<p className="font-sans text-sm text-muted-foreground line-clamp-2 min-h-10">
												{project.description || "No description provided."}
											</p>
										</div>

										{/* Progress Bar */}
										<div className="space-y-2 mt-auto">
											<div className="flex justify-between items-center font-mono text-[10px] font-bold uppercase tracking-widest">
												<span className="text-muted-foreground">
													{project.development_status}
												</span>
												<span className="text-primary">
													{project.progress}%
												</span>
											</div>
											<div className="h-2 w-full bg-muted border-2 dark:border border-border rounded-full overflow-hidden">
												<div
													className="h-full bg-primary transition-all duration-500"
													style={{ width: `${project.progress}%` }}
												/>
											</div>
										</div>

										{/* Tags & Collaborators */}
										<div className="flex flex-wrap gap-1.5 mt-2">
											{project.tags.map((tag) => (
												<span
													key={tag.id}
													className="px-2 py-0.5 bg-background text-muted-foreground border-2 dark:border border-border font-mono text-[10px] font-bold uppercase tracking-wider rounded"
												>
													{tag.name}
												</span>
											))}
											{project.collaborators.length > 0 && (
												<span className="px-2 py-0.5 bg-accent/20 text-accent-foreground border-2 dark:border border-accent font-mono text-[10px] font-bold uppercase tracking-wider rounded flex items-center gap-1">
													<Users size={12} />
													{project.collaborators.length}
												</span>
											)}
										</div>
									</div>

									{/* Footer Actions */}
									<div className="border-t-2 dark:border-t border-border grid grid-cols-2 divide-x-2 dark:divide-x divide-border">
										<Link
											to="/dashboard/projects/edit/$projectId"
											params={{ projectId: project.id }}
											className="flex items-center justify-center gap-2 py-3 bg-card hover:bg-secondary text-foreground hover:text-primary transition-colors font-mono text-[11px] font-bold uppercase tracking-widest"
										>
											<PencilSimple size={14} weight="bold" />
											Edit
										</Link>
										<button
											type="button"
											onClick={() => {
												if (
													confirm(
														`Are you sure you want to delete "${project.title}"?`
													)
												) {
													deleteProject(project.id);
												}
											}}
											disabled={isDeletingProject || project.is_locked}
											className="flex items-center justify-center gap-2 py-3 bg-card hover:bg-destructive text-foreground hover:text-destructive-foreground transition-colors font-mono text-[11px] font-bold uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
										>
											<Trash size={14} weight="bold" />
											Delete
										</button>
									</div>
								</article>
							))}
						</div>
					) : (
						<div className="border-2 border-dashed border-border rounded-xl p-16 flex flex-col items-center justify-center text-center bg-card/50">
							<FolderOpen
								size={48}
								className="text-muted-foreground mb-4 opacity-50"
							/>
							<h3 className="font-heading text-xl font-bold text-foreground mb-2">
								No Projects Found
							</h3>
							<p className="font-sans text-sm text-muted-foreground mb-6 max-w-md">
								{filter === "all"
									? "You haven't created any projects yet. Start building your portfolio."
									: `No projects found with status "${filter}".`}
							</p>
							{filter === "all" && (
								<Link
									to="/dashboard/projects/create"
									className="h-10 px-6 font-mono text-[11px] font-bold uppercase tracking-widest bg-primary text-primary-foreground border-2 dark:border border-border rounded-md shadow-brutal-sm dark:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all flex items-center gap-2"
								>
									<PlusCircle size={16} weight="bold" />
									Create First Project
								</Link>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
});
