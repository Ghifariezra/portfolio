import { createRootRoute, HeadContent, Outlet, useRouterState } from "@tanstack/react-router";
import { Navbar } from "@/components/layout/navbar";
import { NotFound } from "@/components/layout/not-found";

export const Route = createRootRoute({
    component: RootLayout,
    notFoundComponent: NotFound,
});

// Provider global (Query, Theme) ada di src/app/providers.tsx.
function RootLayout() {
    // Halaman admin punya shell sendiri (sidebar), jadi navbar publik disembunyikan.
    const isAdmin = useRouterState({ select: (s) => s.location.pathname.startsWith("/admin") });

    return (
        <>
            <HeadContent />
            {!isAdmin && <Navbar />}
            <Outlet />
        </>
    );
}
