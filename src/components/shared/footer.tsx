export function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="w-full border-t-2 border-border bg-background py-10">
			<div className="mx-auto flex max-w-300 flex-col items-center justify-between gap-6 px-6 md:flex-row">
				<div className="font-sans text-xs font-semibold uppercase tracking-widest text-foreground">
					© {currentYear} Ghifari Ezra Ramadhan. Built with Technical Precision.
				</div>

				<nav className="flex gap-6">
					{[
						{ href: "https://github.com/Ghifariezra", label: "GitHub" },
						{
							href: "https://www.linkedin.com/in/ghifariezraramadhan/",
							label: "LinkedIn",
						},
						{ href: "mailto:ghifariezraramadhan@gmail.com", label: "Email" },
					].map((item) => (
						<a
							key={item.label}
							href={item.href}
							target={item.href.startsWith("mailto") ? undefined : "_blank"}
							rel="noopener noreferrer"
							className="font-sans text-xs font-semibold uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary hover:underline"
						>
							{item.label}
						</a>
					))}
				</nav>
			</div>
		</footer>
	);
}
