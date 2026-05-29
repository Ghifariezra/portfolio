import { createFileRoute, redirect } from "@tanstack/react-router";
import { RouteComponent } from "@/lib/features/admin";

export const Route = createFileRoute("/auth/admin")({
	beforeLoad: ({ context }) => {
		const { auth } = context;
		const isAuthenticated = auth.getState().isAuthenticated;
		// Jika sudah login, jangan biarkan balik ke halaman login, arahkan ke dashboard
		if (isAuthenticated) {
			throw redirect({ to: "/dashboard" });
		}
	},
	component: RouteComponent,
});
