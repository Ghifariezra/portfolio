import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { List, X } from "@/components/ui/icons";
import { SITE } from "@/config/site";
import { NAV_ITEMS } from "./nav-items";
import { ThemeToggle } from "./theme-toggle";

const MOBILE_MENU_ID = "mobile-nav";

export function Navbar() {
    const [open, setOpen] = useState(false);
    const closeMenu = () => setOpen(false);

    // Esc menutup menu mobile.
    useEffect(() => {
        if (!open) return;

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") setOpen(false);
        };
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [open]);

    return (
        <header className="sticky top-0 z-50 w-full border-b-2 border-border bg-background">
            <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
                <Link
                    to="/"
                    onClick={closeMenu}
                    className="font-heading text-xl font-bold tracking-tight hover:opacity-80"
                >
                    {SITE.name}
                </Link>

                <div className="flex items-center gap-3 md:gap-6">
                    <nav aria-label="Main" className="hidden items-center gap-6 md:flex">
                        {NAV_ITEMS.map((item) => (
                            <Link
                                key={item.to}
                                to={item.to}
                                className="font-sans text-sm font-semibold text-muted-foreground hover:text-primary"
                                activeProps={{
                                    className: "text-foreground underline decoration-2 underline-offset-8",
                                }}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    <ThemeToggle />

                    <button
                        type="button"
                        onClick={() => setOpen((value) => !value)}
                        aria-expanded={open}
                        aria-controls={MOBILE_MENU_ID}
                        aria-label={open ? "Close menu" : "Open menu"}
                        className="cursor-pointer border-2 border-border bg-background p-2 hover:text-primary md:hidden"
                    >
                        {open ? <X size={20} weight="bold" /> : <List size={20} weight="bold" />}
                    </button>
                </div>
            </div>

            {open && (
                <nav id={MOBILE_MENU_ID} aria-label="Main" className="border-t-2 border-border bg-background md:hidden">
                    <ul className="mx-auto flex max-w-5xl flex-col px-4 py-2 sm:px-6">
                        {NAV_ITEMS.map((item) => (
                            <li key={item.to}>
                                <Link
                                    to={item.to}
                                    onClick={closeMenu}
                                    // data-status diisi router untuk link aktif; varian data-[...] mengalahkan kelas dasar,
                                    // jadi tidak bergantung pada urutan CSS seperti activeProps.
                                    className="block border-l-4 border-transparent px-3 py-3 font-sans text-base font-semibold text-muted-foreground hover:text-primary data-[status=active]:border-primary data-[status=active]:text-foreground"
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            )}
        </header>
    );
}
