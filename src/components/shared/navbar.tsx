// src/components/shared/navbar.tsx

import { Moon, Sun, List, X } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { useTheme } from "next-themes";
import { useState } from "react";
import { ThemeToggler } from "../animate-ui/primitives/effects/theme-toggler";
import { Button } from "../ui/button";

export function Navbar() {
	const { theme, resolvedTheme, setTheme } = useTheme();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const navLinks = [
		{ to: "/", label: "Home" },
		{ to: "/projects", label: "Projects" },
		{ to: "/notes", label: "Notes" },
		{ to: "/contact", label: "Contact" },
	];

	return (
		<header className="sticky top-0 z-50 w-full border-b border-border bg-background transition-colors duration-200">
			<div className="mx-auto flex h-16 max-w-300 items-center justify-between px-6">
				<Link
					to="/"
					className="font-heading text-xl font-bold tracking-tight text-foreground hover:opacity-80"
				>
					Ghifari Ezra
				</Link>

				{/* Desktop Navigation */}
				<nav className="hidden md:flex gap-8">
					{navLinks.map((item) => (
						<Link
							key={item.to}
							to={item.to}
							className="font-sans text-sm font-semibold uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
							activeProps={{
								className: "text-primary border-b-2 border-primary",
							}}
						>
							{item.label}
						</Link>
					))}
				</nav>

				{/* Actions: Theme & Mobile Toggle */}
				<div className="flex items-center gap-2">
					<ThemeToggler
						theme={(theme as "light" | "dark" | "system") ?? "system"}
						resolvedTheme={(resolvedTheme as "light" | "dark") ?? "light"}
						setTheme={setTheme}
						direction="ltr"
					>
						{({ resolved, toggleTheme }) => (
							<Button
								variant="ghost"
								size="icon"
								aria-label="Toggle Dark Mode"
								className="rounded-md border border-transparent hover:border-border hover:bg-accent cursor-pointer"
								onClick={() =>
									toggleTheme(resolved === "dark" ? "light" : "dark")
								}
							>
								{resolved === "dark" ? <Sun size={20} /> : <Moon size={20} />}
							</Button>
						)}
					</ThemeToggler>

					{/* Mobile Menu Toggle Button */}
					<Button
						variant="ghost"
						size="icon"
						aria-label="Toggle Mobile Menu"
						className="md:hidden rounded-md border border-transparent hover:border-border hover:bg-accent cursor-pointer"
						onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
					>
						{isMobileMenuOpen ? <X size={20} /> : <List size={20} />}
					</Button>
				</div>
			</div>

			{/* Mobile Navigation Menu */}
			{isMobileMenuOpen && (
				<div className="md:hidden border-t border-border bg-background px-6 py-4 shadow-lg animate-in slide-in-from-top-2">
					<nav className="flex flex-col gap-4">
						{navLinks.map((item) => (
							<Link
								key={item.to}
								to={item.to}
								className="font-sans text-sm font-semibold uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
								activeProps={{
									className: "text-primary border-l-2 border-primary pl-2",
								}}
								onClick={() => setIsMobileMenuOpen(false)} // Menutup menu setelah klik
							>
								{item.label}
							</Link>
						))}
					</nav>
				</div>
			)}
		</header>
	);
}