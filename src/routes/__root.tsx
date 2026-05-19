import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
} from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import { Footer } from "@/components/shared/footer";
import { Navbar } from "@/components/shared/navbar";

interface MyRouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	component: () => (
		<ThemeProvider
			attribute="class"
			defaultTheme="dark"
			disableTransitionOnChange
		>
			<HeadContent />
			<Navbar />
			<Outlet />
			<Footer />
		</ThemeProvider>
	),
});
