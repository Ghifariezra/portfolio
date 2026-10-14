import {
	ChatCircle,
	Circle,
	Eye,
	GitBranch,
	GitCommit,
	GitPullRequest,
	Trash,
	WarningCircle,
} from "@phosphor-icons/react";
import { useEffect, useRef } from "react";
import type {
	GithubActivityItem,
	GithubContributionDay,
} from "@/lib/services/public.service";

const MONTHS = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
];

const LEVELS = [
	"bg-muted",
	"bg-primary/25",
	"bg-primary/50",
	"bg-primary/75",
	"bg-primary",
];

function level(n: number) {
	if (n === 0) return 0;
	if (n <= 3) return 1;
	if (n <= 7) return 2;
	if (n <= 14) return 3;
	return 4;
}

export function describeEvent(e: GithubActivityItem) {
	switch (e.type) {
		case "PushEvent":
			return "Pushed to";
		case "PullRequestEvent":
			return `${e.action ?? "Updated"} a pull request in`;
		case "PullRequestReviewEvent":
			return "Reviewed a pull request in";
		case "IssuesEvent":
			return `${e.action ?? "Updated"} an issue in`;
		case "IssueCommentEvent":
			return "Commented in";
		case "CreateEvent":
			return e.ref ? `Created ${e.ref} in` : "Created";
		case "DeleteEvent":
			return `Deleted ${e.ref ?? "a ref"} in`;
		default:
			return `${e.type.replace("Event", "")} in`;
	}
}

function EventIcon({ type }: { type: string }) {
	const cls = "size-4";
	switch (type) {
		case "PushEvent":
			return <GitCommit weight="bold" className={cls} />;
		case "PullRequestEvent":
			return <GitPullRequest weight="bold" className={cls} />;
		case "PullRequestReviewEvent":
			return <Eye weight="bold" className={cls} />;
		case "IssuesEvent":
			return <WarningCircle weight="bold" className={cls} />;
		case "IssueCommentEvent":
			return <ChatCircle weight="bold" className={cls} />;
		case "CreateEvent":
			return <GitBranch weight="bold" className={cls} />;
		case "DeleteEvent":
			return <Trash weight="bold" className={cls} />;
		default:
			return <Circle weight="bold" className={cls} />;
	}
}

export function ContributionGraph({
	weeks,
	showMonths = false,
	showLegend = false,
}: {
	weeks: GithubContributionDay[][];
	showMonths?: boolean;
	showLegend?: boolean;
}) {
	const scrollRef = useRef<HTMLDivElement>(null);

	// Mulai dari kanan supaya data terbaru langsung kelihatan di layar kecil
	useEffect(() => {
		const el = scrollRef.current;
		if (el) el.scrollLeft = el.scrollWidth;
	}, []);

	return (
		<div>
			<div ref={scrollRef} className="overflow-x-auto pb-1">
				<div className="w-max">
					{showMonths && (
						<div className="flex gap-1 mb-1 h-4">
							{weeks.map((w, i) => {
								const month = new Date(w[0].date).getUTCMonth();
								const prev =
									i > 0 ? new Date(weeks[i - 1][0].date).getUTCMonth() : -1;
								return (
									<div key={w[0].date} className="relative size-3">
										{month !== prev && (
											<span className="absolute left-0 font-mono text-[10px] text-muted-foreground">
												{MONTHS[month]}
											</span>
										)}
									</div>
								);
							})}
						</div>
					)}
					<div className="flex gap-1">
						{weeks.map((w, i) => (
							<div key={w[0].date} className="flex flex-col gap-1">
								{/* Minggu pertama tidak penuh: geser ke bawah sesuai weekday */}
								{i === 0 &&
									[0, 1, 2, 3, 4, 5, 6]
										.slice(0, w[0].weekday)
										.map((n) => <div key={`pad-${n}`} className="size-3" />)}
								{w.map((d) => (
									<div
										key={d.date}
										title={`${d.contributionCount} contributions on ${d.date}`}
										className={`size-3 rounded-sm border border-border/30 hover:border-foreground transition-colors ${LEVELS[level(d.contributionCount)]}`}
									/>
								))}
							</div>
						))}
					</div>
				</div>
			</div>

			{showLegend && (
				<div className="mt-3 flex items-center justify-end gap-1.5 font-mono text-[10px] text-muted-foreground">
					<span>Less</span>
					{LEVELS.map((cls) => (
						<span
							key={cls}
							className={`size-3 rounded-sm border border-border/30 ${cls}`}
						/>
					))}
					<span>More</span>
				</div>
			)}
		</div>
	);
}

export function ActivityRow({ e }: { e: GithubActivityItem }) {
	return (
		<li className="flex items-start gap-3 py-3 border-b border-border/50 last:border-b-0 first:pt-0 last:pb-0">
			<span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded border-2 border-border bg-muted text-foreground">
				<EventIcon type={e.type} />
			</span>

			<div className="min-w-0 grow text-sm">
				<p className="text-muted-foreground">
					{describeEvent(e)}{" "}
					<a
						href={`https://github.com/${e.repo}`}
						target="_blank"
						rel="noreferrer"
						className="font-mono font-semibold text-foreground hover:text-primary hover:underline"
					>
						{e.repo}
					</a>
				</p>
				{e.title && (
					<a
						href={e.url ?? `https://github.com/${e.repo}`}
						target="_blank"
						rel="noreferrer"
						className="mt-0.5 block truncate text-foreground hover:text-primary hover:underline"
					>
						{e.title}
					</a>
				)}
			</div>

			<time
				dateTime={e.createdAt}
				className="shrink-0 font-mono text-xs text-muted-foreground pt-1"
			>
				{new Date(e.createdAt).toLocaleDateString("en-US", {
					day: "numeric",
					month: "short",
				})}
			</time>
		</li>
	);
}
