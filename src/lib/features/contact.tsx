import { ContactForm } from "@/components/contact/contact-form";
import { ContactLinks } from "@/components/contact/contact-links";

// ─── Main Component ───────────────────────────────────────────────────────────

export function RouteComponent() {
	return (
		<main className="grow relative w-full">
			{/* Subtle grid background */}
			<div
				className="absolute inset-0 pointer-events-none"
				style={{
					backgroundSize: "40px 40px",
					// Fix: Wrap the CSS value in backticks (a string)
					backgroundImage: `
                        linear-gradient(to right, color-mix(in srgb, var(--color-border) 30%, transparent) 1px, transparent 1px),
                        linear-gradient(to bottom, color-mix(in srgb, var(--color-border) 30%, transparent) 1px, transparent 1px)
                    `,
				}}
			/>

			<div className="relative z-10 flex flex-col items-center justify-center px-6 py-20 min-h-[calc(100vh-4rem)]">
				{/* Header */}
				<header className="text-center max-w-xl mx-auto mb-14">
					<p className="font-mono text-[11px] text-muted-foreground tracking-[0.15em] uppercase mb-4">
						— Let's Connect
					</p>
					<h1 className="font-heading text-5xl md:text-6xl font-bold text-foreground tracking-tight mb-4">
						Get in Touch
					</h1>
					<p className="font-sans text-lg text-muted-foreground leading-relaxed">
						Open to new opportunities, project collaborations, and technical
						discussions. Fill out the form or reach out directly.
					</p>

					{/* Direct links */}
					<ContactLinks />
				</header>

				{/* Form Card */}
				<section className="w-full max-w-lg">
					<div className="bg-card border border-border rounded-lg p-8 md:p-10">
						<ContactForm />
					</div>
				</section>
			</div>
		</main>
	);
}
