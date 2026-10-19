import { Link } from "@tanstack/react-router";
import { brutalButtonClass } from "@/components/ui/button-styles";

export function NotFound() {
    return (
        <main className="mx-auto flex min-h-[60vh] max-w-5xl flex-col items-start justify-center gap-4 px-6">
            <h1 className="font-heading text-6xl font-black">404</h1>
            <p className="text-muted-foreground">Halaman ini tidak ada.</p>
            <Link to="/projects" className={brutalButtonClass("primary")}>
                Lihat projects
            </Link>
        </main>
    );
}
