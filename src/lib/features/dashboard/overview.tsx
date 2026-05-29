import {
	ArrowsCounterClockwise,
	CalendarCheck,
	CheckCircle,
	EnvelopeSimple,
	FolderOpen,
	NotePencil,
	PlusCircle,
	Timer,
	WarningCircle,
	XCircle,
	Spinner,
	DownloadSimple
} from "@phosphor-icons/react";
import { analyticsActions, analyticsKeys } from "@/lib/actions/analytics.action";
import { useQueryClient } from "@tanstack/react-query";

export function RouteComponent() {
	const queryClient = useQueryClient();

	// 1. Panggil Hook Analytics
	const { data: response, isLoading, isRefetching } = analyticsActions.useGetOverview();
	const data = response?.data;

	// 2. Handler untuk tombol Refresh Manual
	const handleRefresh = () => {
		queryClient.invalidateQueries({ queryKey: analyticsKeys.overview() });
	};

	if (isLoading || !data) {
		return (
			<div className="flex h-[60vh] items-center justify-center flex-col gap-4">
				<Spinner size={40} className="animate-spin text-primary" weight="bold" />
				<p className="font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground animate-pulse">
					Loading System Data...
				</p>
			</div>
		);
	}

	const { metrics, recentActivities } = data;

	return (
		<div className="p-4 md:p-8 max-w-7xl mx-auto w-full pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
			{/* ================= PAGE HEADER ================= */}
			<div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b-2 dark:border-b border-border pb-6">
				<div>
					<h2 className="text-4xl md:text-5xl font-bold font-heading tracking-tight text-foreground">
						System Overview
					</h2>
					<p className="font-mono text-xs md:text-sm text-muted-foreground mt-2 uppercase tracking-widest">
						Real-time metrics & operational status.
					</p>
				</div>
				<div className="flex flex-wrap gap-3">
					<button
						type="button"
						onClick={handleRefresh}
						disabled={isRefetching}
						className="h-10 px-4 rounded-md bg-secondary text-secondary-foreground border-2 dark:border border-border shadow-brutal-sm dark:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all font-mono text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 cursor-pointer disabled:opacity-50"
					>
						<ArrowsCounterClockwise size={16} weight="bold" className={isRefetching ? "animate-spin" : ""} />
						Refresh
					</button>
					<button
						type="button"
						className="h-10 px-4 rounded-md bg-primary text-primary-foreground border-2 dark:border border-border shadow-brutal-sm dark:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all font-mono text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 cursor-pointer"
					>
						<DownloadSimple size={16} weight="bold" />
						Generate Report
					</button>
				</div>
			</div>

			{/* ================= METRICS GRID ================= */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
				{/* Metric 1 — Total Projects */}
				<div className="bg-card border-2 dark:border border-border rounded-md p-6 relative overflow-hidden shadow-brutal dark:shadow-none group hover:-translate-y-1 hover:shadow-brutal-lg dark:hover:border-primary transition-all">
					<div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-300">
						<FolderOpen size={120} weight="thin" />
					</div>
					<div className="flex items-center gap-3 mb-4 relative z-10">
						<div className="w-8 h-8 rounded bg-secondary text-secondary-foreground border-2 dark:border border-border flex items-center justify-center shadow-brutal-sm dark:shadow-none">
							<FolderOpen size={16} weight="bold" />
						</div>
						<h3 className="text-[11px] text-muted-foreground uppercase tracking-widest font-mono font-bold">
							Total Projects
						</h3>
					</div>
					<div className="flex items-baseline gap-2 relative z-10">
						<span className="text-5xl font-heading font-bold text-foreground">
							{metrics.total_projects}
						</span>
						{metrics.new_projects_this_week > 0 && (
							<span className="font-mono text-[10px] text-accent-foreground bg-accent px-1.5 py-0.5 border-2 dark:border border-border rounded shadow-brutal-sm dark:shadow-none font-bold tracking-widest uppercase">
								+{metrics.new_projects_this_week} New
							</span>
						)}
					</div>
				</div>

				{/* Metric 2 — Published Blogs */}
				<div className="bg-card border-2 dark:border border-border rounded-md p-6 relative overflow-hidden shadow-brutal dark:shadow-none group hover:-translate-y-1 hover:shadow-brutal-lg dark:hover:border-primary transition-all">
					<div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-300">
						<NotePencil size={120} weight="thin" />
					</div>
					<div className="flex items-center gap-3 mb-4 relative z-10">
						<div className="w-8 h-8 rounded bg-primary text-primary-foreground border-2 dark:border border-border flex items-center justify-center shadow-brutal-sm dark:shadow-none">
							<NotePencil size={16} weight="bold" />
						</div>
						<h3 className="text-[11px] text-muted-foreground uppercase tracking-widest font-mono font-bold">
							Published Blogs
						</h3>
					</div>
					<div className="flex items-baseline gap-2 relative z-10">
						<span className="text-5xl font-heading font-bold text-foreground">
							{metrics.published_blogs}
						</span>
						<span className="font-mono text-xs text-muted-foreground tracking-widest">
							articles
						</span>
					</div>
				</div>

				{/* Metric 3 — Unread Messages */}
				<div className="bg-card border-2 dark:border border-border rounded-md p-6 relative overflow-hidden shadow-brutal dark:shadow-none group hover:-translate-y-1 hover:shadow-brutal-lg dark:hover:border-destructive transition-all">
					<div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-300">
						<EnvelopeSimple size={120} weight="thin" />
					</div>
					<div className="flex items-center gap-3 mb-4 relative z-10">
						<div className="w-8 h-8 rounded bg-destructive text-destructive-foreground border-2 dark:border border-border flex items-center justify-center shadow-brutal-sm dark:shadow-none">
							<EnvelopeSimple size={16} weight="bold" />
						</div>
						<h3 className="text-[11px] text-muted-foreground uppercase tracking-widest font-mono font-bold">
							Unread Messages
						</h3>
					</div>
					<div className="flex items-baseline gap-2 relative z-10">
						<span className="text-5xl font-heading font-bold text-destructive">
							{metrics.unread_messages}
						</span>
						{metrics.unread_messages > 0 && (
							<span className="font-mono text-[10px] text-destructive-foreground bg-destructive px-1.5 py-0.5 border-2 dark:border border-border rounded shadow-brutal-sm dark:shadow-none tracking-widest uppercase font-bold">
								Attention
							</span>
						)}
					</div>
				</div>

				{/* Metric 4 — Pending Batch Jobs */}
				<div className="bg-card border-2 dark:border border-border rounded-md p-6 relative overflow-hidden shadow-brutal dark:shadow-none group hover:-translate-y-1 hover:shadow-brutal-lg dark:hover:border-accent transition-all">
					<div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-300">
						<Timer size={120} weight="thin" />
					</div>
					<div className="flex items-center gap-3 mb-4 relative z-10">
						<div className="w-8 h-8 rounded bg-accent text-accent-foreground border-2 dark:border border-border flex items-center justify-center shadow-brutal-sm dark:shadow-none">
							<Timer size={16} weight="bold" />
						</div>
						<h3 className="text-[11px] text-muted-foreground uppercase tracking-widest font-mono font-bold">
							Pending Jobs
						</h3>
					</div>
					<div className="flex items-baseline gap-2 relative z-10">
						<span className="text-5xl font-heading font-bold text-foreground">
							{metrics.pending_jobs}
						</span>
						<span className="font-mono text-xs text-muted-foreground tracking-widest uppercase">
							Queued
						</span>
					</div>
				</div>
			</div>

			{/* ================= LAYOUT GRID: CONTENT ================= */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

				{/* --- Recent Activity (Col-Span 2) --- */}
				<div className="lg:col-span-2 flex flex-col">
					<div className="flex items-center justify-between mb-4">
						<h3 className="font-heading text-2xl font-bold text-foreground tracking-tight">
							Recent Activity
						</h3>
					</div>

					<div className="bg-card border-2 dark:border border-border rounded-md overflow-hidden shadow-brutal dark:shadow-none flex-1">
						{recentActivities.length === 0 ? (
							<div className="p-12 text-center flex flex-col items-center justify-center gap-3">
								<CheckCircle size={32} className="text-muted-foreground opacity-50" />
								<span className="font-mono text-sm uppercase tracking-widest text-muted-foreground">No recent activities.</span>
							</div>
						) : (
							<div className="divide-y-2 dark:divide-y divide-border">
								{recentActivities.map((activity) => {
									// Tentukan Ikon & Warna Berdasarkan Tipe/Status
									let Icon = CheckCircle;
									let iconColor = "text-muted-foreground";

									if (activity.type === 'batch_job') {
										if (activity.status === 'success') { Icon = CheckCircle; iconColor = "text-green-500"; }
										if (activity.status === 'failed') { Icon = XCircle; iconColor = "text-destructive"; }
										if (activity.status === 'pending') { Icon = Timer; iconColor = "text-accent"; }
									} else if (activity.type === 'schedule') {
										Icon = CalendarCheck; iconColor = "text-muted-foreground";
									} else if (activity.type === 'message') {
										Icon = WarningCircle; iconColor = "text-accent";
									} else if (activity.type === 'draft') {
										Icon = PlusCircle; iconColor = "text-primary";
									}

									return (
										<div key={activity.activity_id} className="flex items-start gap-4 p-5 hover:bg-muted/30 transition-colors group">
											<div className="mt-0.5 p-1.5 rounded-md border-2 dark:border border-border bg-background shadow-brutal-sm dark:shadow-none group-hover:-translate-y-px transition-transform">
												<Icon size={18} className={iconColor} weight="bold" />
											</div>
											<div className="flex-1 min-w-0">
												<p className="font-sans text-sm text-foreground leading-relaxed">
													<strong className="font-bold">{activity.title}</strong> — {activity.description}
												</p>
												<p className="font-mono text-[10px] text-muted-foreground mt-2 uppercase tracking-widest font-bold">
													{new Date(activity.created_at).toLocaleString('en-GB', {
														month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
													})}
													<span className="mx-2">•</span>
													{activity.type.replace('_', ' ')}
												</p>
											</div>
										</div>
									);
								})}
							</div>
						)}
					</div>
				</div>

				{/* --- Sidebar --- */}
				<div className="flex flex-col gap-8">
					{/* Publish Status Summary */}
					<div className="flex flex-col">
						<h3 className="font-heading text-2xl font-bold text-foreground mb-4 tracking-tight">
							Publish Status
						</h3>
						<div className="bg-card border-2 dark:border border-border rounded-md p-6 shadow-brutal dark:shadow-none flex-1">
							<p className="font-mono text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-4 pb-2 border-b-2 dark:border-b border-border">
								Content Lifecycle
							</p>
							<div className="space-y-4">
								{[
									{ label: "Draft", count: metrics.publish_status_summary.draft, color: "text-muted-foreground" },
									{ label: "Scheduled", count: metrics.publish_status_summary.scheduled, color: "text-accent" },
									{ label: "Published", count: metrics.publish_status_summary.published, color: "text-green-500" },
									{ label: "Archived", count: metrics.publish_status_summary.archived, color: "text-destructive" },
								].map(({ label, count, color }) => (
									<div key={label} className="flex items-center justify-between group">
										<span className="font-mono text-[11px] font-bold text-foreground uppercase tracking-widest flex items-center gap-2">
											<div className={`w-2 h-2 rounded-full border border-border ${color.replace('text-', 'bg-')}`} />
											{label}
										</span>
										<span className={`font-heading text-xl font-bold ${color}`}>
											{count}
										</span>
									</div>
								))}
							</div>
						</div>
					</div>

					{/* Batch Jobs Summary */}
					<div className="flex flex-col">
						<h3 className="font-heading text-2xl font-bold text-foreground mb-4 tracking-tight">
							Batch Jobs
						</h3>
						<div className="bg-card border-2 dark:border border-border rounded-md p-6 shadow-brutal dark:shadow-none flex-1">
							<div className="space-y-6">
								{[
									{ label: "Success", val: metrics.batch_jobs_summary.success, color: "bg-green-500" },
									{ label: "Pending", val: metrics.batch_jobs_summary.pending, color: "bg-accent" },
									{ label: "Failed", val: metrics.batch_jobs_summary.failed, color: "bg-destructive" },
								].map(({ label, val, color }) => {
									const total = metrics.batch_jobs_summary.total || 1;
									const pct = Math.round((val / total) * 100);

									return (
										<div key={label}>
											<div className="flex justify-between font-mono text-[11px] font-bold text-foreground mb-2 uppercase tracking-widest">
												<span>{label}</span>
												<span>{pct}%</span>
											</div>
											<div className="w-full bg-muted h-3 rounded-md overflow-hidden border-2 dark:border border-border shadow-inner">
												<div
													className={`${color} h-full transition-all duration-1000 ease-out`}
													style={{ width: `${pct}%` }}
												/>
											</div>
										</div>
									);
								})}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}