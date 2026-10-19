import { Link } from "@tanstack/react-router";
import { SITE } from "@/config/site";
import { NAV_ITEMS } from "./nav-items";
import { ThemeToggle } from "./theme-toggle";

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b-2 border-border bg-background">
            <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
                <Link to="/" className="font-heading text-xl font-bold tracking-tight hover:opacity-80">
                    {SITE.name}
                </Link>

                <nav className="flex items-center gap-6">
                    {NAV_ITEMS.map((item) => (
                        <Link
                            key={item.to}
                            to={item.to}
                            className="font-sans text-sm font-semibold text-muted-foreground hover:text-primary"
                            activeProps={{ className: "text-foreground underline decoration-2 underline-offset-8" }}
                        >
                            {item.label}
                        </Link>
                    ))}
                    <ThemeToggle />
                </nav>
            </div>
        </header>
    );
}
