// src/components/shared/navbar.tsx
import { Link } from "@tanstack/react-router";
import { useTheme } from "next-themes";
import { Sun, Moon } from "@phosphor-icons/react";
import { ThemeToggler } from "../animate-ui/primitives/effects/theme-toggler";
import { Button } from "../ui/button";

export function Navbar() {
    const { theme, resolvedTheme, setTheme } = useTheme();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background transition-colors duration-200">
            <div className="mx-auto flex h-16 max-w-300 items-center justify-between px-6">
                <Link
                    to="/"
                    className="font-heading text-xl font-bold tracking-tight text-foreground hover:opacity-80"
                >
                    Ghifari Ezra
                </Link>

                <nav className="hidden md:flex gap-8">
                    {[
                        { to: "/", label: "Home" },
                        { to: "/projects", label: "Projects" },
                        { to: "/notes", label: "Notes" },
                        { to: "/contact", label: "Contact" },
                    ].map((item) => (
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
                            onClick={() => toggleTheme(resolved === "dark" ? "light" : "dark")}
                        >
                            {resolved === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                        </Button>
                    )}
                </ThemeToggler>
            </div>
        </header>
    );
}