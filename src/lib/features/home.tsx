import {
	ArrowRight,
	ArrowUpRight,
	CheckCircle,
	Code,
	Stack, // Mengganti Layers menjadi Stack
	Wrench,
} from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";

export function RouteComponent() {
	return (
		<div className="grow w-full max-w-300 mx-auto px-6">
			{/* ─── HERO SECTION ─── */}
			<section className="mt-24 md:mt-32 mb-20 flex flex-col items-start">
				<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-muted border border-border mb-6">
					<span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
					<span className="font-sans text-xs font-semibold uppercase tracking-widest text-muted-foreground">
						Available for new opportunities
					</span>
				</div>

				<h1 className="font-heading text-4xl md:text-6xl font-bold text-foreground mb-6 max-w-4xl tracking-tight leading-tight">
					Architecting robust systems with technical precision.
				</h1>

				<p className="font-sans text-lg text-muted-foreground max-w-2xl mb-10 leading-relaxed">
					Software Developer specializing in high-performance web applications,
					scalable backend architectures, and elegant user interfaces. Building
					solutions that bridge logic and human experience.
				</p>

				<div className="flex flex-wrap gap-4">
					<Link
						to="/projects"
						className="inline-flex items-center justify-center px-6 h-12 bg-primary text-primary-foreground font-sans font-medium rounded hover:bg-primary/90 transition-colors duration-200 shadow-brutal dark:shadow-none"
					>
						View Projects
					</Link>
					<Link
						to="/contact"
						className="inline-flex items-center justify-center px-6 h-12 border-2 border-border text-foreground font-sans font-medium rounded hover:bg-muted transition-colors duration-200 group shadow-brutal dark:shadow-none"
					>
						<ArrowRight className="mr-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
						Contact Me
					</Link>
				</div>
			</section>

			{/* ─── TECHNICAL ARSENAL (BENTO GRID) ─── */}
			<section className="mb-20" id="expertise">
				<h2 className="font-heading text-3xl font-semibold text-foreground mb-8 flex items-center gap-4">
					<span className="w-8 h-0.5 bg-border block"></span>
					Technical Arsenal
				</h2>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					{/* Languages Card */}
					<div className="bg-card border-2 border-border p-6 rounded-lg hover:border-foreground transition-all relative overflow-hidden group hover:shadow-brutal dark:hover:shadow-none dark:hover:border-primary/50">
						<div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
							<Code weight="duotone" className="w-24 h-24 text-foreground" />
						</div>
						<h3 className="font-heading text-2xl font-medium text-foreground mb-4">
							Languages
						</h3>
						<div className="flex flex-wrap gap-2 relative z-10">
							{["JavaScript", "TypeScript", "Python", "Go", "SQL"].map(
								(tech) => (
									<span
										key={tech}
										className="px-3 py-1.5 bg-muted text-foreground font-mono text-xs font-semibold rounded"
									>
										{tech}
									</span>
								)
							)}
						</div>
					</div>

					{/* Frameworks Card */}
					<div className="bg-card border-2 border-border p-6 rounded-lg hover:border-foreground transition-all relative overflow-hidden group hover:shadow-brutal dark:hover:shadow-none dark:hover:border-primary/50">
						<div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
							<Stack weight="duotone" className="w-24 h-24 text-foreground" />
						</div>
						<h3 className="font-heading text-2xl font-medium text-foreground mb-4">
							Frameworks
						</h3>
						<div className="flex flex-wrap gap-2 relative z-10">
							{["React", "Next.js", "Node.js", "Django", "Tailwind CSS"].map(
								(tech) => (
									<span
										key={tech}
										className="px-3 py-1.5 bg-muted text-foreground font-mono text-xs font-semibold rounded"
									>
										{tech}
									</span>
								)
							)}
						</div>
					</div>

					{/* Tools Card */}
					<div className="bg-card border-2 border-border p-6 rounded-lg hover:border-foreground transition-all relative overflow-hidden group hover:shadow-brutal dark:hover:shadow-none dark:hover:border-primary/50">
						<div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
							<Wrench weight="duotone" className="w-24 h-24 text-foreground" />
						</div>
						<h3 className="font-heading text-2xl font-medium text-foreground mb-4">
							Tools & Infra
						</h3>
						<div className="flex flex-wrap gap-2 relative z-10">
							{["Git", "Docker", "AWS", "PostgreSQL", "Figma"].map((tech) => (
								<span
									key={tech}
									className="px-3 py-1.5 bg-muted text-foreground font-mono text-xs font-semibold rounded"
								>
									{tech}
								</span>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* ─── FEATURED PROJECTS ─── */}
			<section className="mb-20" id="projects">
				<div className="flex justify-between items-end mb-8">
					<h2 className="font-heading text-3xl font-semibold text-foreground flex items-center gap-4">
						<span className="w-8 h-0.5 bg-border block"></span>
						Featured Projects
					</h2>
					<Link
						to="/projects"
						className="font-sans text-xs font-bold uppercase tracking-widest text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
					>
						View All <ArrowUpRight weight="bold" className="w-4 h-4" />
					</Link>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{/* Project 1: DanaKu */}
					<div className="bg-card border-2 border-border rounded-lg p-6 flex flex-col hover:border-foreground transition-all group hover:shadow-brutal dark:hover:shadow-none dark:hover:border-primary/50">
						<div className="flex justify-between items-start mb-4">
							<span className="font-sans text-xs font-semibold px-2 py-1 bg-secondary text-secondary-foreground rounded inline-flex items-center gap-1.5">
								<span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
								Active Development
							</span>
							{/** biome-ignore lint/a11y/useValidAnchor: ... */}
							<a
								href="#"
								aria-label="View Github Repo"
								className="text-muted-foreground hover:text-primary transition-colors"
							>
								<Code weight="bold" className="w-6 h-6" />
							</a>
						</div>
						<h3 className="font-heading text-2xl font-medium text-foreground mb-2 group-hover:text-primary transition-colors">
							DanaKu
						</h3>
						<p className="font-sans text-base text-muted-foreground mb-6 grow">
							A comprehensive personal finance management dashboard. Features
							include transaction categorization, budget tracking algorithms,
							and real-time data visualization.
						</p>

						<div className="mb-6 w-full">
							<div className="flex justify-between font-mono text-xs text-muted-foreground mb-2">
								<span>Milestone: V1 Release</span>
								<span>85%</span>
							</div>
							<div className="h-1.5 w-full bg-muted rounded-full overflow-hidden border border-border/50">
								<div
									className="h-full bg-primary rounded-full"
									style={{ width: "85%" }}
								></div>
							</div>
						</div>

						<div className="flex gap-2 border-t-2 border-border pt-4 mt-auto">
							{["React", "Node.js", "PostgreSQL"].map((tech, i, arr) => (
								<div key={tech} className="flex items-center gap-2">
									<span className="font-mono text-xs text-muted-foreground font-semibold">
										{tech}
									</span>
									{i < arr.length - 1 && (
										<span className="text-muted-foreground">•</span>
									)}
								</div>
							))}
						</div>
					</div>

					{/* Project 2: Penyet Compressor */}
					<div className="bg-card border-2 border-border rounded-lg p-6 flex flex-col hover:border-foreground transition-all group hover:shadow-brutal dark:hover:shadow-none dark:hover:border-primary/50">
						<div className="flex justify-between items-start mb-4">
							<span className="font-sans text-xs font-semibold px-2 py-1 bg-muted text-foreground rounded inline-flex items-center gap-1.5">
								<CheckCircle weight="fill" className="w-4 h-4" />
								Stable Release
							</span>
							<a
								href="#"
								aria-label="View Live Site"
								className="text-muted-foreground hover:text-primary transition-colors"
							>
								<ArrowUpRight weight="bold" className="w-6 h-6" />
							</a>
						</div>
						<h3 className="font-heading text-2xl font-medium text-foreground mb-2 group-hover:text-primary transition-colors">
							Penyet Compressor
						</h3>
						<p className="font-sans text-base text-muted-foreground mb-6 grow">
							A blazingly fast, browser-based image compression tool leveraging
							WebAssembly. Designed to reduce bandwidth usage without
							compromising perceptible visual quality.
						</p>

						<div className="mb-6 w-full">
							<div className="flex justify-between font-mono text-xs text-muted-foreground mb-2">
								<span>Optimization Pass</span>
								<span>100%</span>
							</div>
							<div className="h-1.5 w-full bg-muted rounded-full overflow-hidden border border-border/50">
								<div
									className="h-full bg-foreground rounded-full"
									style={{ width: "100%" }}
								></div>
							</div>
						</div>

						<div className="flex gap-2 border-t-2 border-border pt-4 mt-auto">
							{["Rust (WASM)", "TypeScript"].map((tech, i, arr) => (
								<div key={tech} className="flex items-center gap-2">
									<span className="font-mono text-xs text-muted-foreground font-semibold">
										{tech}
									</span>
									{i < arr.length - 1 && (
										<span className="text-muted-foreground">•</span>
									)}
								</div>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* ─── RECENT NOTES (BLOG) ─── */}
			<section className="mb-20" id="notes">
				<h2 className="font-heading text-3xl font-semibold text-foreground mb-8 flex items-center gap-4">
					<span className="w-8 h-0.5 bg-border block"></span>
					Recent Notes
				</h2>

				<div className="flex flex-col gap-6">
					{/* Post 1 */}
					<article className="group border-l-4 border-border pl-6 py-2 hover:border-primary transition-colors cursor-pointer flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8 relative">
						<div className="font-mono text-sm font-semibold text-muted-foreground min-w-30">
							Oct 24, 2026
						</div>
						<div>
							<h3 className="font-heading text-2xl font-medium text-foreground group-hover:text-primary transition-colors mb-2">
								State Management Architectures in 2026
							</h3>
							<p className="font-sans text-base text-muted-foreground line-clamp-2">
								An analysis of shifting paradigms in frontend state management,
								moving from monolithic stores to atomic and derived state
								patterns.
							</p>
						</div>
					</article>

					{/* Post 2 */}
					<article className="group border-l-4 border-border pl-6 py-2 hover:border-primary transition-colors cursor-pointer flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8 relative">
						<div className="font-mono text-sm font-semibold text-muted-foreground min-w-30">
							Sep 12, 2026
						</div>
						<div>
							<h3 className="font-heading text-2xl font-medium text-foreground group-hover:text-primary transition-colors mb-2">
								Optimizing PostgreSQL for Read-Heavy Workloads
							</h3>
							<p className="font-sans text-base text-muted-foreground line-clamp-2">
								Practical techniques for index tuning, materialized views, and
								query restructuring to handle high-throughput analytical reads.
							</p>
						</div>
					</article>
				</div>
			</section>
		</div>
	);
}
