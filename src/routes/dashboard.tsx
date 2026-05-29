import { createFileRoute, redirect } from "@tanstack/react-router";
import { userKeys } from "@/lib/actions/user.action";
import { RouteComponent } from "@/lib/features/dashboard";
import { userService } from "@/lib/services/user.service";

export const Route = createFileRoute("/dashboard")({
	beforeLoad: async ({ context }) => {
		// Ambil fungsi auth dari context
		const { queryClient, auth } = context;
		const isAuthenticated = auth.getState().isAuthenticated;

		if (!isAuthenticated) {
			throw redirect({ to: "/auth/admin" });
		}

		// Fetch data profil user terbaru setiap kali masuk area dashboard
		try {
			await queryClient.fetchQuery({
				queryKey: userKeys.me(),
				queryFn: () => userService.getMe(),
			});
		} catch {
			// Jika token tidak valid / server mati, paksa logout dan redirect
			auth.getState().logout();
			throw redirect({ to: "/auth/admin" });
		}
	},
	component: RouteComponent,
});
