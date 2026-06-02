import { Spinner, WindowsLogo } from "@phosphor-icons/react";
import { AlertCircle, Download, Globe, MapPin, Rocket } from "lucide-react";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { publicActions } from "@/lib/actions/public.action";

// --- DATA STATIS SEMENTARA ---
const APPS_DIRECTORY = [
	{
		id: "9P0VXDK9ZVP0",
		name: "DanaKu",
		description:
			"DanaKu is a comprehensive financial management application designed for personal users and small business owners (MSMEs/UMKM). Whether you want to track daily expenses, monitor cash flow, or plan your budget, DanaKu offers a lightweight and secure desktop experience.",
		tags: ["Financial", "Windows App", "UWP"],
		status: "published",
		url_store: "https://apps.microsoft.com/detail/9P0VXDK9ZVP0",
	},
	{
		id: "penyet-compressor",
		name: "Penyet Compressor",
		description:
			"Smart image compression desktop application. Kompres gambar (JPG, PNG, WebP) tanpa kehilangan kualitas secara drastis dengan antarmuka yang simpel.",
		tags: ["Utility", "Electron", "Sharp"],
		status: "coming_soon",
		url_store: "https://apps.microsoft.com/detail/penyet-compressor",
	},
];

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
	const [activeFilter, setActiveFilter] = useState<string>("All");

	const availableStatuses = useMemo(() => {
		const statuses = APPS_DIRECTORY.map((p) => p.status);
		return ["All", ...Array.from(new Set(statuses))];
	}, []);

	const filteredApps = useMemo(() => {
		if (activeFilter === "All") return APPS_DIRECTORY;
		return APPS_DIRECTORY.filter((p) => p.status === activeFilter);
	}, [activeFilter]);

	const getCount = (status: string) => {
		if (status === "All") return APPS_DIRECTORY.length;
		return APPS_DIRECTORY.filter((p) => p.status === status).length;
	};

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
					{filteredApps.map((app) => (
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

								<div>
									<h2 className="text-xl font-heading font-bold text-foreground tracking-tight line-clamp-1">
										{app.name}
									</h2>
									<p className="font-sans text-sm text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
										{app.description}
									</p>
								</div>

								<div className="flex flex-wrap gap-1.5 pt-2">
									{app.tags.map((tag) => (
										<span
											key={tag}
											className="px-2 py-0.5 bg-muted text-foreground border border-border/50 font-mono text-[9px] font-bold tracking-wider uppercase rounded shadow-sm"
										>
											{tag}
										</span>
									))}
								</div>
							</div>

							{/* Analytics Data / Placeholder */}
							<div className="mt-auto border-t-2 border-border bg-card">
								{app.status === "published" ? (
									<PublishedAppStats appId={app.id} />
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
					))}
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

function PublishedAppStats({ appId }: { appId: string }) {
	// FE memanggil endpoint HANYA dengan parameter appId.
	// Karena startDate dan endDate kosong, BE otomatis mengisi dengan data dari 5 tahun yang lalu (Lifetime).
	const { data, isLoading, isError } = publicActions.useGetAnalytics(appId);

	const groupedGeo = useMemo(() => {
		if (!data?.data?.GeographicalSpread) return [];
		const geoMap = new Map<string, number>();
		data.data.GeographicalSpread.forEach((item) => {
			const currentTotal = geoMap.get(item.market) || 0;
			geoMap.set(item.market, currentTotal + item.installCount);
		});
		return Array.from(geoMap.entries())
			.map(([market, installCount]) => ({ market, installCount }))
			.sort((a, b) => b.installCount - a.installCount);
	}, [data?.data?.GeographicalSpread]);

	if (isLoading) {
		return (
			<div className="flex flex-col justify-center items-center h-45 gap-2 p-4">
				<Spinner
					size={24}
					className="animate-spin text-primary"
					weight="bold"
				/>
				<p className="font-mono text-[9px] font-bold uppercase text-muted-foreground">
					Syncing Metrics...
				</p>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="flex flex-col justify-center items-center h-45 text-destructive bg-destructive/5 p-4">
				<AlertCircle className="h-6 w-6 mb-2" />
				<p className="font-mono text-xs font-bold uppercase">Data Error</p>
			</div>
		);
	}

	return (
		<div className="animate-in fade-in flex flex-col h-full">
			{/* Top Stats */}
			<div className="grid grid-cols-2 divide-x-2 divide-border border-b-2 border-border">
				<div className="p-4 flex flex-col items-center justify-center text-center">
					<p className="font-heading text-3xl font-black text-foreground">
						{data?.data?.TotalInstalls?.toLocaleString("en-US") || 0}
					</p>
					<p className="font-mono text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1 flex items-center gap-1">
						<Download size={12} /> Installs
					</p>
				</div>
				<div className="p-4 flex flex-col items-center justify-center text-center bg-secondary/10">
					<p className="font-heading text-3xl font-black text-foreground">
						{groupedGeo.length || 0}
					</p>
					<p className="font-mono text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1 flex items-center gap-1">
						<Globe size={12} /> Markets
					</p>
				</div>
			</div>

			{/* Top 3 Regions Compact List */}
			{groupedGeo.length > 0 ? (
				<div className="p-3 bg-muted/30">
					<p className="font-mono text-[9px] font-bold uppercase text-muted-foreground tracking-widest mb-2 flex items-center gap-1.5">
						<MapPin size={10} /> Top Regions (Lifetime)
					</p>
					<div className="space-y-1.5">
						{groupedGeo.slice(0, 3).map((item) => (
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
										(
										{data?.data?.TotalInstalls
											? (
													(item.installCount / data.data.TotalInstalls) *
													100
												).toFixed(0)
											: 0}
										%)
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
