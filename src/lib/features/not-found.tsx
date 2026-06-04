import { Link } from "@tanstack/react-router";
import { Ghost, Home, Terminal } from "lucide-react";
import { memo } from "react";

export const NotFoundComponent = memo(function NotFoundComponent() {
	return (
		<main className="flex min-h-[80vh] w-full flex-col items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-500">
			{/* Main Neo-Brutalist Card */}
			<div className="relative flex w-full max-w-lg flex-col items-center gap-6 border-2 border-border bg-card p-10 shadow-brutal transition-all hover:shadow-brutal-lg dark:hover:shadow-none">
				{/* Decorative Badge */}
				<div className="absolute -top-4 left-6 flex items-center gap-2 border-2 border-border bg-accent px-3 py-1 text-accent-foreground shadow-brutal-sm">
					<Terminal size={14} strokeWidth={2.5} />
					<span className="font-mono text-[10px] font-bold uppercase tracking-widest">
						System_Error
					</span>
				</div>

				{/* Visual / Icon */}
				<div className="mt-4 flex h-24 w-24 items-center justify-center rounded-full border-2 border-border bg-muted/50 text-muted-foreground">
					<Ghost size={48} strokeWidth={1.5} className="animate-bounce" />
				</div>

				{/* Typography Heading */}
				<div className="text-center">
					<h1 className="font-heading text-8xl font-black tracking-tighter text-foreground md:text-9xl">
						404
					</h1>
					<h2 className="mt-2 font-mono text-lg font-bold uppercase tracking-widest text-foreground">
						Page Not Found
					</h2>
				</div>

				{/* Description */}
				<p className="text-center font-sans text-sm leading-relaxed text-muted-foreground">
					The resource you are looking for has been moved, renamed, or
					completely abducted by digital aliens.
				</p>

				{/* Action Button */}
				<Link
					to="/"
					className="mt-4 flex items-center gap-2 border-2 border-border bg-primary px-6 py-3 font-mono text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-brutal-sm transition-all duration-200 hover:-translate-y-1 hover:translate-x-1 hover:shadow-brutal dark:hover:border-foreground dark:hover:bg-muted dark:hover:text-foreground"
				>
					<Home size={16} strokeWidth={2.5} />
					Return to Base
				</Link>

				{/* Decorative Tech Footer */}
				<div className="mt-4 w-full border-t-2 border-dashed border-border pt-4 text-center">
					<span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground/60">
						{`// STATUS_CODE: 404_NOT_FOUND //`}
					</span>
				</div>
			</div>
		</main>
	);
});
