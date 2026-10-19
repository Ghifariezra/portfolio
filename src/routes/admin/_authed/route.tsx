import { createFileRoute, redirect } from "@tanstack/react-router";
import { AdminShell } from "@/features/admin/components/admin-shell";
import { adminToken } from "@/lib/auth/admin-token";

// Pathless layout: semua route di folder _authed butuh token, URL-nya tetap /admin/...
// Ini guard UX saja; keamanan sebenarnya ada di server (AdminGuard menolak request tanpa token yang benar).
export const Route = createFileRoute("/admin/_authed")({
    beforeLoad: ({ location }) => {
        if (!adminToken.get()) throw redirect({ to: "/admin/login", search: { next: location.href } });
    },
    component: AdminShell,
});
