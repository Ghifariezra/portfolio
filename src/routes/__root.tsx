import { createRootRoute, HeadContent, Outlet } from "@tanstack/react-router";
import { Navbar } from "@/components/layout/navbar";
import { NotFound } from "@/components/layout/not-found";

export const Route = createRootRoute({
    component: RootLayout,
    notFoundComponent: NotFound,
});

// Provider global (Query, Theme) ada di src/app/providers.tsx.
function RootLayout() {
    return (
        <>
            <HeadContent />
            <Navbar />
            <Outlet />
        </>
    );
}
