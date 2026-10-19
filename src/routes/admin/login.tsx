import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";
import { adminHead } from "@/features/admin/lib/admin-head";
import { LoginPage } from "@/features/admin/pages/login-page";
import { adminToken } from "@/lib/auth/admin-token";

export const Route = createFileRoute("/admin/login")({
    validateSearch: z.object({ next: z.string().optional() }),
    // Sudah login: tidak perlu melihat halaman login lagi.
    beforeLoad: () => {
        if (adminToken.get()) throw redirect({ to: "/admin" });
    },
    head: () => adminHead("Sign in"),
    component: LoginRoute,
});

function LoginRoute() {
    const { next } = Route.useSearch();
    return <LoginPage next={next} />;
}
