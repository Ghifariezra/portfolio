import {
	ArrowUpRight,
	// LockKey,
	// MicrosoftExcelLogo,
	PencilSimple,
	PlusCircle,
	Spinner,
	TerminalWindow,
	Trash,
} from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { memo, useState } from "react";
import { appActions } from "@/lib/actions/apps.action";
import { useAppDeletions } from "@/lib/hooks/use-apps";
import type { AppListItem } from "@/lib/schemas/apps.schema";

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
	const { data: res, isLoading } = appActions.useGetApps();
	const apps = (res?.data as AppListItem[]) || [];

	const { deleteApp, isDeletingApp } = useAppDeletions();
	const [filter, setFilter] = useState<"all" | "published" | "coming_soon">(
		"all"
	);

	const filteredApps = apps.filter((a) =>
		filter === "all" ? true : a.status === filter
	);

	const counts = {
		all: apps.length,
		published: apps.filter((a) => a.status === "published").length,
		coming_soon: apps.filter((a) => a.status === "coming_soon").length,
	};

	return (
		<div className="flex flex-col h-full overflow-hidden bg-background">
			{/* Topbar / Header */}
			<header className="border-b-2 dark:border-b border-border py-6 px-8 shrink-0 bg-card dark:bg-background flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div>
					<h2 className="text-3xl font-heading font-bold text-foreground mb-2">
						Applications
					</h2>
					<p className="text-muted-foreground font-mono text-xs uppercase tracking-widest">
						Manage your desktop apps and software tools.
					</p>
				</div>
				<Link
					to="/dashboard/apps/create"
					className="h-10 px-6 shrink-0 font-mono text-[11px] font-bold uppercase tracking-widest bg-primary text-primary-foreground border-2 dark:border border-border rounded-md shadow-brutal-sm dark:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all flex items-center justify-center gap-2"
				>
					<PlusCircle size={16} weight="bold" />
					Register App
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
							active={filter === "coming_soon"}
							onClick={() => setFilter("coming_soon")}
						>
							Coming Soon{" "}
							<span className="ml-1.5 opacity-60">({counts.coming_soon})</span>
						</FilterButton>
					</div>

					{/* Grid Area */}
					{isLoading ? (
						<div className="flex items-center justify-center h-64 text-muted-foreground gap-3 font-mono text-sm uppercase tracking-widest">
							<Spinner size={24} className="animate-spin" />
							Loading Apps...
						</div>
					) : filteredApps.length > 0 ? (
						<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
							{filteredApps.map((app) => (
								<article
									key={app.id}
									className="group flex flex-col bg-card dark:bg-[#191c1e] border-2 dark:border border-border rounded-lg overflow-hidden shadow-brutal dark:shadow-none transition-all duration-300 hover:-translate-y-1 hover:border-primary relative"
								>
									{/* Thumbnail Area */}
									<div className="h-44 w-full relative bg-muted overflow-hidden flex items-center justify-center border-b-2 dark:border-b border-border p-4">
										{app.image ? (
											<img
												src={app.image}
												alt={app.name}
												className="w-auto h-full object-cover"
											/>
										) : (
											<div className="absolute inset-0 bg-linear-to-br from-card via-muted to-card flex items-center justify-center">
												<TerminalWindow
													size={48}
													className="text-border group-hover:text-primary/20 transition-colors duration-300"
												/>
											</div>
										)}
									</div>

									{/* Body Area */}
									<div className="p-6 flex flex-col grow gap-4">
										{/* Status & Store Link Header */}
										<div className="flex items-start justify-between gap-2">
											<span className="inline-flex items-center gap-1.5 px-2 py-1 rounded font-mono text-[11px] font-bold tracking-wider uppercase text-foreground bg-muted border border-border">
												<span
													className={`w-1.5 h-1.5 rounded-full ${
														app.status === "published"
															? "bg-green-500"
															: "bg-yellow-500"
													}`}
												/>
												{app.status === "published"
													? "Published"
													: "Coming Soon"}
											</span>

											{app.url_store && (
												<a
													href={app.url_store}
													target="_blank"
													rel="noopener noreferrer"
													className="text-muted-foreground hover:text-primary transition-colors p-1"
													title="Open Store URL"
												>
													<ArrowUpRight size={16} />
												</a>
											)}
										</div>

										{/* Title & Description */}
										<div>
											<h3 className="font-heading text-xl font-bold text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
												{app.name}
											</h3>
											<p className="font-sans text-sm text-muted-foreground line-clamp-2 min-h-10">
												{app.description || "No description provided."}
											</p>
										</div>

										{/* Tags */}
										{app.tags && app.tags.length > 0 && (
											<div className="flex flex-wrap gap-1.5 mt-auto pt-2">
												{app.tags.map((tagName, idx) => (
													<span
														key={`${app.id}-tag-${idx}` as string}
														className="px-2 py-0.5 bg-background text-muted-foreground border-2 dark:border border-border font-mono text-[10px] font-bold uppercase tracking-wider rounded"
													>
														{tagName.name}
													</span>
												))}
											</div>
										)}

										{/* Store ID indicator */}
										{app.microsoft_store_id && (
											<div className="font-mono text-[10px] text-muted-foreground mt-2 border-t border-border/50 pt-2">
												Store ID:{" "}
												<span className="font-bold text-foreground">
													{app.microsoft_store_id}
												</span>
											</div>
										)}
									</div>

									{/* Footer Actions */}
									<div className="border-t-2 dark:border-t border-border grid grid-cols-2 divide-x-2 dark:divide-x divide-border mt-auto">
										<Link
											to="/dashboard/apps/edit/$appId"
											params={{ appId: app.id as string }}
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
														`Are you sure you want to delete "${app.name}"?`
													)
												) {
													deleteApp(app.id as string);
												}
											}}
											disabled={isDeletingApp}
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
							<TerminalWindow
								size={48}
								className="text-muted-foreground mb-4 opacity-50"
							/>
							<h3 className="font-heading text-xl font-bold text-foreground mb-2">
								No Apps Found
							</h3>
							<p className="font-sans text-sm text-muted-foreground mb-6 max-w-md">
								{filter === "all"
									? "You haven't registered any applications yet. Add your desktop apps or tools."
									: `No apps found with status "${filter}".`}
							</p>
							{filter === "all" && (
								<Link
									to="/dashboard/apps/create"
									className="h-10 px-6 font-mono text-[11px] font-bold uppercase tracking-widest bg-primary text-primary-foreground border-2 dark:border border-border rounded-md shadow-brutal-sm dark:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all flex items-center gap-2"
								>
									<PlusCircle size={16} weight="bold" />
									Register First App
								</Link>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
});
