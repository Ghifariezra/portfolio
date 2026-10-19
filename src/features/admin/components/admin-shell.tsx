import { useQueryClient } from "@tanstack/react-query";
import { Link, Navigate, Outlet } from "@tanstack/react-router";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { SITE } from "@/config/site";
import { adminToken, useAdminToken } from "@/lib/auth/admin-token";
import { ADMIN_NAV_ITEMS } from "./admin-nav-items";

/**
 * Layout semua halaman admin yang butuh login. Guard utamanya ada di beforeLoad route (_authed),
 * tapi komponen ini juga memantau token: begitu token dihapus (logout atau 401 dari server),
 * pengguna langsung dilempar ke halaman login tanpa menunggu navigasi.
 */
export function AdminShell() {
    const token = useAdminToken();
    const queryClient = useQueryClient();

    if (!token) return <Navigate to="/admin/login" />;

    const signOut = () => {
        adminToken.clear();
        queryClient.clear(); // buang data tersembunyi dari memori
    };

    return (
        <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col md:flex-row">
            <aside className="flex shrink-0 flex-col gap-6 border-b-2 border-border p-6 md:w-56 md:border-r-2 md:border-b-0">
                <p className="font-heading text-lg font-bold">{SITE.name} / admin</p>

                <nav className="flex flex-wrap gap-x-4 gap-y-2 md:flex-col">
                    {ADMIN_NAV_ITEMS.map((item) => (
                        <Link
                            key={item.to}
                            to={item.to}
                            activeOptions={{ exact: item.exact }}
                            className="font-sans text-sm font-semibold text-muted-foreground hover:text-primary"
                            activeProps={{ className: "text-foreground underline decoration-2 underline-offset-8" }}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="mt-auto flex items-center gap-3">
                    <ThemeToggle />
                    <Link to="/projects" className="font-mono text-xs text-muted-foreground hover:text-primary">
                        View site
                    </Link>
                    <button
                        type="button"
                        onClick={signOut}
                        className="cursor-pointer font-mono text-xs text-muted-foreground hover:text-destructive"
                    >
                        Sign out
                    </button>
                </div>
            </aside>

            <div className="min-w-0 flex-1 px-6 py-10">
                <Outlet />
            </div>
        </div>
    );
}
