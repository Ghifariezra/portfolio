import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
	useLocation,
} from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import { Footer } from "@/components/shared/footer";
import { Navbar } from "@/components/shared/navbar";
import { Toaster } from "@/components/ui/sonner";
import type { useAuthStore } from "@/lib/stores/auth.store";

interface MyRouterContext {
	queryClient: QueryClient;
	auth: typeof useAuthStore;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	component: () => {
		const location = useLocation();

		// Daftar path yang TIDAK menampilkan Navbar & Footer
		const hideLayoutRoutes = ["/auth/admin", "/dashboard"];
		const isHiddenRoute = hideLayoutRoutes.some((route) =>
			location.pathname.startsWith(route)
		);

		return (
			<ThemeProvider
				attribute="class"
				defaultTheme="dark"
				disableTransitionOnChange
			>
				<HeadContent />
				{!isHiddenRoute && <Navbar />}
				<Outlet />
				{!isHiddenRoute && <Footer />}
				<Toaster
					position="top-right"
					toastOptions={{
						classNames: {
							toast:
								"group flex gap-3 p-4 bg-card text-foreground border-2 border-border dark:border dark:border-border rounded shadow-brutal dark:shadow-md",
							title: "font-heading font-semibold text-base tracking-tight",
							description: "font-sans text-sm text-muted-foreground",
							actionButton:
								"bg-primary text-primary-foreground font-mono text-[11px] font-semibold uppercase tracking-widest px-4 py-2 rounded border-2 border-border dark:border-transparent transition-colors hover:opacity-90",
							cancelButton:
								"bg-muted text-foreground font-mono text-[11px] font-semibold uppercase tracking-widest px-4 py-2 rounded border-2 border-border dark:border-transparent transition-colors hover:bg-secondary",
							error:
								"group border-destructive bg-destructive/10 text-destructive dark:bg-destructive dark:text-destructive-foreground",
							success:
								"group border-primary bg-primary/10 text-primary dark:bg-primary dark:text-primary-foreground",
						},
					}}
				/>
			</ThemeProvider>
		);
	},
});
