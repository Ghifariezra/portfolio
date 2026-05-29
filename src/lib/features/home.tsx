import {
	ArrowRight,
	ArrowUpRight,
	CheckCircle,
	Code,
	Stack,
	Wrench,
	Spinner,
	GithubLogo,
	LinkedinLogo,
} from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { publicActions } from "@/lib/actions/public.action";

export function RouteComponent() {
	// 1. Panggil Hook untuk mengambil data Home Content
	const { data: response, isLoading } = publicActions.useGetHomeContent();
	const data = response?.data;

	// 2. Loading State
	if (isLoading || !data) {
		return (
			<div className="flex h-[70vh] w-full items-center justify-center flex-col gap-4">
				<Spinner size={40} className="animate-spin text-primary" weight="bold" />
				<p className="font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground animate-pulse">
					Loading Workspace...
				</p>
			</div>
		);
	}

	// Ekstrak data dari response
	const { hero, skills, featured_projects, recent_blogs } = data;

	return (
		<div className="grow w-full max-w-300 mx-auto px-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
			{/* ─── HERO SECTION ─── */}
			<section className="mt-24 md:mt-32 mb-20">
				<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-muted border-2 dark:border border-border mb-8 shadow-brutal-sm dark:shadow-none">
					<span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
					<span className="font-sans text-xs font-bold uppercase tracking-widest text-foreground">
						Available for new opportunities
					</span>
				</div>

				<div className="flex flex-col-reverse lg:flex-row gap-12 lg:items-center">
					{/* Teks Hero */}
					<div className="flex-1 flex flex-col items-start">
						{/* 1. Sapaan & Nama sebagai H1 yang besar dan tegas */}
						<h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-4 tracking-tight leading-tight">
							Hi, I'm {hero?.fullname || "Ghifari Ezra"}.
						</h1>

						{/* 2. Role diposisikan sebagai H2 dengan aksen Neo-Brutalist */}
						<h2 className="font-mono text-lg md:text-xl font-bold text-foreground mb-6 bg-primary/10 px-3 py-1.5 border-l-4 border-primary inline-block shadow-sm">
							{hero?.role || "Software Developer"}
						</h2>

						{/* 3. Deskripsi Singkat */}
						<p className="font-sans text-lg text-muted-foreground max-w-2xl mb-10 leading-relaxed whitespace-pre-wrap">
							{hero?.about_me || "Software Developer specializing in high-performance web applications, scalable backend architectures, and elegant user interfaces."}
						</p>

						{/* 4. Tombol Aksi & Sosial Media */}
						<div className="flex flex-wrap items-center gap-4">
							<Link
								to="/projects"
								className="inline-flex items-center justify-center px-6 h-12 bg-primary text-primary-foreground font-sans font-bold rounded hover:-translate-y-1 hover:shadow-brutal-lg transition-all duration-200 border-2 dark:border border-border shadow-brutal dark:shadow-none"
							>
								View Projects
							</Link>

							{hero?.cv_url && (
								<a
									href={hero.cv_url}
									target="_blank"
									rel="noreferrer"
									className="inline-flex items-center justify-center px-6 h-12 bg-secondary text-secondary-foreground font-sans font-bold rounded hover:-translate-y-1 hover:shadow-brutal-lg transition-all duration-200 border-2 dark:border border-border shadow-brutal dark:shadow-none"
								>
									Download CV <ArrowRight className="ml-2 w-5 h-5" />
								</a>
							)}

							{/* Social Links Dinamis */}
							<div className="flex gap-3 ml-2">
								{hero?.github && (
									<a href={hero.github} target="_blank" rel="noreferrer" className="w-12 h-12 flex items-center justify-center border-2 border-border rounded-md hover:bg-foreground hover:text-background transition-colors shadow-brutal-sm dark:shadow-none">
										<GithubLogo weight="fill" className="w-6 h-6" />
									</a>
								)}
								{hero?.linkedin && (
									<a href={hero.linkedin} target="_blank" rel="noreferrer" className="w-12 h-12 flex items-center justify-center border-2 border-border rounded-md hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2] transition-colors shadow-brutal-sm dark:shadow-none">
										<LinkedinLogo weight="fill" className="w-6 h-6" />
									</a>
								)}
							</div>
						</div>
					</div>

					{/* Foto Profil Hero */}
					{hero?.image && (
						<div className="shrink-0 lg:w-72 lg:h-72 w-48 h-48 relative group">
							{/* Efek kotak brutalist di belakang foto */}
							<div className="absolute inset-0 bg-primary translate-x-4 translate-y-4 rounded-xl border-2 border-foreground hidden lg:block"></div>
							<img
								src={hero.image}
								alt={hero.fullname || "Profile Picture"}
								className="w-full h-full object-cover rounded-xl border-4 border-foreground shadow-brutal relative z-10 group-hover:-translate-y-2 group-hover:-translate-x-2 transition-transform duration-300"
							/>
						</div>
					)}
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
							{skills?.languages?.length > 0 ? (
								skills.languages.map((tech) => (
									<span key={tech} className="px-3 py-1.5 bg-muted text-foreground font-mono text-xs font-semibold rounded border border-border/50">
										{tech}
									</span>
								))
							) : (
								<span className="text-muted-foreground font-mono text-xs">No data yet.</span>
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
							{skills?.frameworks?.length > 0 ? (
								skills.frameworks.map((tech) => (
									<span key={tech} className="px-3 py-1.5 bg-muted text-foreground font-mono text-xs font-semibold rounded border border-border/50">
										{tech}
									</span>
								))
							) : (
								<span className="text-muted-foreground font-mono text-xs">No data yet.</span>
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
							{skills?.tools?.length > 0 ? (
								skills.tools.map((tech) => (
									<span key={tech} className="px-3 py-1.5 bg-muted text-foreground font-mono text-xs font-semibold rounded border border-border/50">
										{tech}
									</span>
								))
							) : (
								<span className="text-muted-foreground font-mono text-xs">No data yet.</span>
							)}
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
					{featured_projects?.length > 0 ? (
						featured_projects.map((project) => (
							<div key={project.id} className="bg-card border-2 border-border rounded-lg p-6 flex flex-col hover:border-foreground transition-all group hover:shadow-brutal dark:hover:shadow-none dark:hover:border-primary/50">
								<div className="flex justify-between items-start mb-4">
									<span className={`font-sans text-xs font-semibold px-2 py-1 rounded inline-flex items-center gap-1.5 ${project.development_status === "Completed"
											? "bg-muted text-foreground"
											: "bg-secondary text-secondary-foreground"
										}`}>
										{project.development_status !== "Completed" ? (
											<span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
										) : (
											<CheckCircle weight="fill" className="w-4 h-4" />
										)}
										{project.development_status}
									</span>

									<a
										href={project.embed_url || `/projects/${project.slug}`}
										target={project.embed_url ? "_blank" : "_self"}
										rel="noreferrer"
										className="text-muted-foreground hover:text-primary transition-colors bg-background p-1.5 rounded-md border-2 border-border shadow-brutal-sm group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
									>
										{project.embed_type === "github" ? (
											<Code weight="bold" className="w-5 h-5" />
										) : (
											<ArrowUpRight weight="bold" className="w-5 h-5" />
										)}
									</a>
								</div>
								<h3 className="font-heading text-2xl font-medium text-foreground mb-2 group-hover:text-primary transition-colors">
									{project.title}
								</h3>
								<p className="font-sans text-base text-muted-foreground mb-6 grow">
									{project.description || "No description provided."}
								</p>

								<div className="mb-6 w-full">
									<div className="flex justify-between font-mono text-xs text-muted-foreground mb-2">
										<span>Completion</span>
										<span>{project.progress}%</span>
									</div>
									<div className="h-1.5 w-full bg-muted rounded-full overflow-hidden border border-border/50">
										<div
											className={`h-full rounded-full ${project.progress >= 100 ? 'bg-foreground' : 'bg-primary'}`}
											style={{ width: `${project.progress}%` }}
										></div>
									</div>
								</div>

								<div className="flex flex-wrap gap-2 border-t-2 border-border pt-4 mt-auto">
									{project.tags && project.tags.length > 0 ? (
										project.tags.slice(0, 3).map((tag, i, arr) => (
											<div key={tag.id} className="flex items-center gap-2">
												<span className="font-mono text-xs text-muted-foreground font-semibold">
													{tag.name}
												</span>
												{i < arr.length - 1 && (
													<span className="text-muted-foreground">•</span>
												)}
											</div>
										))
									) : (
										<span className="font-mono text-xs text-muted-foreground font-semibold">No tags attached</span>
									)}
								</div>
							</div>
						))
					) : (
						<div className="col-span-1 md:col-span-2 p-8 border-2 border-dashed border-border rounded-lg text-center bg-muted/50">
							<p className="font-mono text-sm text-muted-foreground uppercase tracking-widest">No featured projects yet.</p>
						</div>
					)}
				</div>
			</section>

			{/* ─── RECENT NOTES (BLOG) ─── */}
			<section className="mb-20" id="notes">
				<h2 className="font-heading text-3xl font-semibold text-foreground mb-8 flex items-center gap-4">
					<span className="w-8 h-0.5 bg-border block"></span>
					Recent Notes
				</h2>

				<div className="flex flex-col gap-6">
					{recent_blogs?.length > 0 ? (
						recent_blogs.map((blog) => {
							const date = new Date(blog.published_at || blog.created_at).toLocaleDateString("en-US", {
								month: "short",
								day: "numeric",
								year: "numeric",
							});

							return (
								<Link
									key={blog.id}
									to={`/notes`} // Ubah sesuai struktur route kamu (misal: /notes/$slug)
									className="group border-l-4 border-border pl-6 py-2 hover:border-primary transition-colors cursor-pointer flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8 relative outline-none focus-visible:border-primary"
								>
									<div className="font-mono text-sm font-semibold text-muted-foreground min-w-30 group-hover:text-foreground transition-colors">
										{date}
									</div>
									<div>
										<h3 className="font-heading text-2xl font-medium text-foreground group-hover:text-primary transition-colors mb-2">
											{blog.title}
										</h3>
										<p className="font-sans text-base text-muted-foreground line-clamp-2">
											{blog.description || "Click to read more about this topic..."}
										</p>

										{/* Tampilkan Tag Bahasa jika ada */}
										{blog.tags && blog.tags.length > 0 && (
											<div className="mt-3 flex gap-2">
												{blog.tags.map(t => (
													<span key={t.id} className="font-mono text-[10px] uppercase font-bold px-2 py-0.5 bg-muted text-muted-foreground rounded">
														{t.name}
													</span>
												))}
											</div>
										)}
									</div>
								</Link>
							);
						})
					) : (
						<div className="p-8 border-2 border-dashed border-border rounded-lg text-center bg-muted/50">
							<p className="font-mono text-sm text-muted-foreground uppercase tracking-widest">No recent notes published.</p>
						</div>
					)}
				</div>
			</section>
		</div>
	);
}