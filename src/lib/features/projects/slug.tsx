import {
	ArrowLeft,
	ArrowUpRight,
	CheckCircle,
	GithubLogo,
	Globe,
	Spinner,
	Tag,
	Users,
} from "@phosphor-icons/react";
import { getRouteApi, Link } from "@tanstack/react-router";
import { memo } from "react";
import { Reader } from "@/components/shared/reader";
import { publicActions } from "@/lib/actions/public.action";

// Pastikan path ini sesuai dengan tempat kamu menyimpan komponen Reader tadi

// Mengambil API dari route untuk mengekstrak parameter URL slug
const routeApi = getRouteApi("/projects/$slug");

export const RouteComponent = memo(function RouteComponent() {
	// 1. Ambil slug & Fetch Data
	const { slug } = routeApi.useParams();
	const {
		data: response,
		isLoading,
		isError,
	} = publicActions.useGetProjectBySlug(slug);
	const project = response?.data;

	// --- LOADING STATE ---
	if (isLoading) {
		return (
			<div className="flex min-h-[70vh] w-full items-center justify-center flex-col gap-4">
				<Spinner
					size={40}
					className="animate-spin text-primary"
					weight="bold"
				/>
				<p className="font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground animate-pulse">
					Loading Project Workspace...
				</p>
			</div>
		);
	}

	// --- ERROR / NOT FOUND STATE ---
	if (isError || !project) {
		return (
			<div className="flex min-h-[70vh] w-full items-center justify-center flex-col gap-6">
				<div className="border-4 border-foreground p-8 rounded-xl bg-card shadow-brutal text-center max-w-md">
					<p className="font-heading text-3xl font-bold text-foreground mb-2">
						Project Not Found
					</p>
					<p className="font-sans text-muted-foreground mb-6">
						The project you are looking for does not exist or is currently
						private.
					</p>
					<Link
						to="/projects"
						className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md font-mono text-xs font-bold tracking-widest uppercase hover:-translate-y-1 transition-transform border-2 border-foreground shadow-brutal-sm dark:shadow-none w-full"
					>
						<ArrowLeft size={16} weight="bold" />
						Return to projects
					</Link>
				</div>
			</div>
		);
	}

	// --- FORMAT DATA UTILITY ---
	const isCompleted = project.progress >= 100;

	return (
		<article className="grow w-full max-w-4xl mx-auto px-6 py-20 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
			{/* Navigasi Kembali */}
			<Link
				to="/projects"
				className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground font-mono text-[11px] font-bold uppercase tracking-widest mb-10 transition-colors w-fit px-3 py-1.5 border-2 border-transparent hover:border-foreground rounded-md hover:bg-card hover:shadow-brutal-sm dark:hover:shadow-none"
			>
				<ArrowLeft size={16} weight="bold" />
				Back to Projects
			</Link>

			{/* Header Proyek */}
			<header className="mb-12">
				<div className="flex flex-wrap items-center justify-between gap-6 mb-6">
					{/* Badges Status & Kategori */}
					<div className="flex flex-wrap items-center gap-3">
						{project.category_name && (
							<span className="inline-block bg-primary text-primary-foreground font-mono text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded shadow-brutal-sm dark:shadow-none border-2 border-primary">
								{project.category_name}
							</span>
						)}
						<span
							className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded font-mono text-[10px] font-bold tracking-wider uppercase border-2 shadow-sm ${
								isCompleted
									? "bg-muted text-foreground border-border"
									: "bg-secondary text-secondary-foreground border-secondary"
							}`}
						>
							{isCompleted ? (
								<CheckCircle
									weight="fill"
									size={14}
									className="text-green-500"
								/>
							) : (
								<span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
							)}
							{project.development_status}
						</span>
					</div>

					{/* Tombol External Link */}
					{project.embed_url && (
						<a
							href={project.embed_url}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-2 bg-foreground text-background px-4 py-2 rounded-md font-mono text-[11px] font-bold tracking-widest uppercase hover:-translate-y-1 transition-transform border-2 border-foreground shadow-brutal-sm dark:shadow-none"
						>
							{project.embed_type === "github" ? (
								<GithubLogo size={16} weight="fill" />
							) : (
								<Globe size={16} weight="bold" />
							)}
							{project.embed_type === "github" ? "View Source" : "Live Preview"}
							<ArrowUpRight size={14} weight="bold" className="ml-1" />
						</a>
					)}
				</div>

				<h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight tracking-tight mb-6">
					{project.title}
				</h1>

				{project.description && (
					<p className="font-sans text-lg md:text-xl text-muted-foreground leading-relaxed border-l-4 border-primary pl-4 bg-muted/30 py-4 rounded-r-md">
						{project.description}
					</p>
				)}
			</header>

			{/* Gambar Utama (Hero Image) */}
			{project.image && (
				<figure className="w-full mb-12 rounded-xl border-4 border-foreground overflow-hidden shadow-brutal dark:shadow-none bg-muted">
					<img
						src={project.image}
						alt={project.title}
						className="w-full h-auto object-cover max-h-150"
					/>
				</figure>
			)}

			{/* Kotak Info Proyek (Grid) */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 p-8 border-2 border-border rounded-xl bg-card shadow-brutal dark:shadow-none">
				{/* Progress Bar */}
				<div className="col-span-1 md:col-span-2">
					<div className="flex justify-between items-center mb-3">
						<span className="font-mono text-xs font-bold text-muted-foreground tracking-wider uppercase">
							Completion Progress
						</span>
						<span className="font-mono text-sm font-bold text-foreground">
							{project.progress}%
						</span>
					</div>
					<div className="h-3 w-full bg-background rounded-full overflow-hidden border-2 border-border shadow-inner">
						<div
							className={`h-full transition-all duration-700 ease-out border-r-2 border-foreground ${isCompleted ? "bg-green-400" : "bg-primary"}`}
							style={{ width: `${project.progress}%` }}
						/>
					</div>
				</div>

				{/* Kolaborator */}
				{project.collaborators && project.collaborators.length > 0 && (
					<div className="col-span-1">
						<span className="flex items-center gap-2 font-mono text-[10px] font-bold text-muted-foreground tracking-widest uppercase mb-4">
							<Users size={16} weight="bold" /> Team / Collaborators
						</span>
						<div className="flex flex-wrap gap-2">
							{project.collaborators.map((collab) => (
								<span
									key={collab.id}
									className="font-sans text-sm font-semibold text-foreground bg-background px-3 py-1.5 border-2 border-border rounded-md shadow-sm"
								>
									{collab.name}
								</span>
							))}
						</div>
					</div>
				)}

				{/* Tags Teknologi */}
				<div className="col-span-1">
					<span className="flex items-center gap-2 font-mono text-[10px] font-bold text-muted-foreground tracking-widest uppercase mb-4">
						<Tag size={16} weight="bold" /> Technologies
					</span>
					<div className="flex flex-wrap gap-2">
						{project.tags && project.tags.length > 0 ? (
							project.tags.map((tag) => (
								<span
									key={tag.id}
									className="font-mono text-[10px] font-bold uppercase tracking-wider text-foreground bg-muted px-3 py-1.5 rounded border-2 border-border shadow-sm hover:-translate-y-0.5 transition-transform cursor-default"
								>
									{tag.name}
								</span>
							))
						) : (
							<span className="font-mono text-xs text-muted-foreground">
								No tags recorded
							</span>
						)}
					</div>
				</div>
			</div>

			{/* Konten Utama (BlockNote Reader) */}
			<section className="mt-4">
				<h2 className="font-heading text-3xl font-bold text-foreground mb-8 flex items-center gap-4">
					<span className="w-8 h-1.5 bg-primary block"></span>
					Project Details
				</h2>

				{project.content ? (
					// Komponen Reader akan menangani parsing JSON dan syntax highlight
					<Reader content={project.content} />
				) : (
					<div className="italic text-muted-foreground font-mono bg-muted p-8 rounded-lg border-2 border-dashed border-border text-center">
						No detailed content provided for this project.
					</div>
				)}
			</section>
		</article>
	);
});
