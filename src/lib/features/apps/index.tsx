/** biome-ignore-all lint/suspicious/noExplicitAny: ... */

import { Spinner, WindowsLogo } from "@phosphor-icons/react";
import { Download, Globe, MapPin, Rocket } from "lucide-react";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { publicActions } from "@/lib/actions/public.action";
import type {
	AnalyticsDataResponse,
	AppItem,
} from "@/lib/services/public.service";

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
	const isPublished = status.toLowerCase() === "published";

	const colorClass = isPublished
		? "text-foreground bg-muted border border-border"
		: "text-muted-foreground bg-muted border border-border border-dashed";
	const dotClass = isPublished
		? "bg-green-400 animate-pulse"
		: "bg-muted-foreground";
	const label = isPublished ? "Live" : "In Dev";

	return (
		<span
			className={`inline-flex items-center gap-1.5 px-2 py-1 rounded font-mono text-[10px] font-bold tracking-wider uppercase ${colorClass}`}
		>
			{!isPublished && <Rocket className="w-3 h-3" />}
			{isPublished && (
				<span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
			)}
			{label}
		</span>
	);
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
			className={`px-4 py-1.5 rounded-md font-mono text-[11px] font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer border-2 ${
				active
					? "bg-primary text-primary-foreground border-primary shadow-brutal-sm translate-x-0.5 translate-y-0.5"
					: "border-border bg-card text-muted-foreground hover:border-foreground hover:text-foreground shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5"
			}`}
		>
			{children}
		</button>
	);
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function RouteComponent() {
	const { data, isLoading, isError } = publicActions.useGetApps();
	const appsList: AppItem[] = data?.data || [];
	console.log("Fetched apps data:", appsList);

	const [activeFilter, setActiveFilter] = useState<string>("All");

	const availableStatuses = useMemo(() => {
		const statuses = appsList.map((p) => p.status);
		return ["All", ...Array.from(new Set(statuses))];
	}, [appsList]);

	const filteredApps = useMemo(() => {
		if (activeFilter === "All") return appsList;
		return appsList.filter((p) => p.status === activeFilter);
	}, [activeFilter, appsList]);

	const getCount = (status: string) => {
		if (status === "All") return appsList.length;
		return appsList.filter((p) => p.status === status).length;
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
					Loading apps data...
				</p>
			</div>
		);
	}

	if (isError) {
		return (
			<main className="grow w-full max-w-7xl mx-auto px-6 py-20 flex flex-col gap-4 items-center justify-center min-h-[50vh]">
				<p className="font-mono text-sm text-destructive">
					Failed to load apps data.
				</p>
			</main>
		);
	}

	return (
		<main className="grow w-full max-w-7xl mx-auto px-6 py-20 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
			{/* Page Header */}
			<header className="mb-6">
				<p className="font-mono text-[11px] font-bold text-muted-foreground tracking-[0.15em] uppercase mb-4">
					— Open Metrics
				</p>
				<h1 className="font-heading text-5xl md:text-6xl font-bold text-foreground tracking-tight mb-4 uppercase">
					Apps
				</h1>
				<p className="font-sans text-base text-muted-foreground max-w-2xl leading-relaxed">
					A global software collection. Built with full transparency to track
					real-time performance and acquisition metrics straight from the
					Microsoft Store.
				</p>
			</header>

			{/* Filter Bar */}
			<div className="flex flex-wrap items-center gap-3 pb-6 border-b-2 border-border mb-6">
				{availableStatuses.map((status) => {
					const label =
						status === "All" ? "All Apps" : status.replace("_", " ");
					return (
						<FilterButton
							key={status}
							active={activeFilter === status}
							onClick={() => setActiveFilter(status)}
						>
							{label}{" "}
							<span className="ml-1.5 opacity-60">({getCount(status)})</span>
						</FilterButton>
					);
				})}
			</div>

			{/* Apps Grid */}
			{filteredApps.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredApps.map((app) => {
						// Antisipasi jika tag diserialisasi sebagai string JSON dari backend (PostgreSQL json_agg)
						let parsedTags: string[] = [];
						try {
							if (app.tags && Array.isArray(app.tags)) {
								parsedTags = app.tags.map((t: any) =>
									typeof t === "string" ? t : t.name
								);
							} else if (typeof app.tags === "string") {
								const parsed = JSON.parse(app.tags);
								parsedTags = parsed.map((t: any) => t.name || t);
							}
						} catch (e) {
							console.error("Failed to parse tags", e);
						}

						return (
							<Card
								key={app.id}
								className="flex flex-col border-2 border-border shadow-brutal bg-card overflow-hidden transition-all hover:border-foreground hover:-translate-y-1 hover:shadow-brutal-lg duration-300"
							>
								{/* Header & Info */}
								<div className="p-5 flex flex-col gap-3 bg-secondary/10">
									<div className="flex justify-between items-start">
										<StatusBadge status={app.status} />
										{app.url_store && (
											<a
												href={app.url_store}
												target="_blank"
												rel="noreferrer"
												className="text-muted-foreground hover:text-primary transition-colors bg-background p-1.5 rounded-md border-2 border-border shadow-brutal-sm hover:translate-x-0.5 hover:-translate-y-0.5"
											>
												<WindowsLogo size={16} weight="fill" />
											</a>
										)}
									</div>

									{/* Thumbnail & Title/Desc */}
									<div className="flex flex-row items-start gap-4">
										{/* Render Image jika tersedia */}
										{app.image && (
											<div className="shrink-0">
												<img
													src={app.image}
													alt={`${app.name} icon`}
													className="w-14 h-14 rounded-xl object-cover border-2 border-border bg-background shadow-brutal-sm p-1.5"
													loading="lazy"
												/>
											</div>
										)}

										{/* Teks Kontainer */}
										<div className="flex-1 min-w-0">
											<h2 className="text-xl font-heading font-bold text-foreground tracking-tight line-clamp-1">
												{app.name}
											</h2>
											<p className="font-sans text-sm text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
												{app.description}
											</p>
										</div>
									</div>

									<div className="flex flex-wrap gap-1.5 pt-2">
										{parsedTags.map((tag, idx) => (
											<span
												key={`${app.id}-${tag}-${idx}` as string}
												className="px-2 py-0.5 bg-muted text-foreground border border-border/50 font-mono text-[9px] font-bold tracking-wider uppercase rounded shadow-sm"
											>
												{tag}
											</span>
										))}
									</div>
								</div>

								{/* Analytics Data / Placeholder */}
								<div className="mt-auto border-t-2 border-border bg-card">
									{app.status === "published" && app.analytics ? (
										<PublishedAppStats analytics={app.analytics} />
									) : (
										<div className="bg-[repeating-linear-gradient(45deg,var(--color-muted),var(--color-muted)_8px,var(--color-secondary)_8px,var(--color-secondary)_16px)] h-45 flex items-center justify-center p-4">
											<div className="bg-card border-2 border-border shadow-brutal-sm p-3 text-center">
												<h3 className="font-heading text-sm font-bold uppercase">
													Coming Soon
												</h3>
												<p className="text-[10px] font-mono text-muted-foreground mt-1">
													Metrics unavailable
												</p>
											</div>
										</div>
									)}
								</div>
							</Card>
						);
					})}
				</div>
			) : (
				<div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-border rounded-lg bg-muted/50">
					<Globe size={48} className="text-muted-foreground mb-4 opacity-50" />
					<p className="font-heading text-xl font-bold text-foreground mb-2">
						No apps found.
					</p>
					<p className="font-mono text-sm text-muted-foreground uppercase tracking-widest">
						Try adjusting filters.
					</p>
				</div>
			)}
		</main>
	);
}

// ─── Analytics Component (Compact for Grid) ───────────────────────────────────

function PublishedAppStats({
	analytics,
}: {
	analytics: AnalyticsDataResponse;
}) {
	const topRegions = analytics?.TopRegions || [];

	return (
		<div className="animate-in fade-in flex flex-col h-full">
			{/* Top Stats */}
			<div className="grid grid-cols-2 divide-x-2 divide-border border-b-2 border-border">
				<div className="p-4 flex flex-col items-center justify-center text-center">
					<p className="font-heading text-3xl font-black text-foreground">
						{analytics?.TotalInstalls?.toLocaleString("en-US") || 0}
					</p>
					<p className="font-mono text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1 flex items-center gap-1">
						<Download size={12} /> Installs
					</p>
				</div>
				<div className="p-4 flex flex-col items-center justify-center text-center bg-secondary/10">
					<p className="font-heading text-3xl font-black text-foreground">
						{topRegions.length}
					</p>
					<p className="font-mono text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1 flex items-center gap-1">
						<Globe size={12} /> Markets
					</p>
				</div>
			</div>

			{/* Top 3 Regions Compact List */}
			{topRegions.length > 0 ? (
				<div className="p-3 bg-muted/30">
					<p className="font-mono text-[9px] font-bold uppercase text-muted-foreground tracking-widest mb-2 flex items-center gap-1.5">
						<MapPin size={10} /> Top Regions (Lifetime)
					</p>
					<div className="space-y-1.5">
						{topRegions.slice(0, 3).map((item) => (
							<div
								key={item.market}
								className="flex items-center justify-between text-xs"
							>
								<span className="font-sans font-semibold text-foreground line-clamp-1 w-2/3">
									{item.market}
								</span>
								<span className="font-mono text-muted-foreground w-1/3 text-right">
									{item.installCount}{" "}
									<span className="text-[9px] opacity-60">
										({item.percentage}%)
									</span>
								</span>
							</div>
						))}
					</div>
				</div>
			) : (
				<div className="p-4 grow flex items-center justify-center">
					<p className="font-mono text-[10px] text-muted-foreground">
						No region data.
					</p>
				</div>
			)}
		</div>
	);
}
