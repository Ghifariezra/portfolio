import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { useAuthStore } from "./lib/stores/auth.store";
// Import routeTree yang di-generate otomatis oleh Vite
import { routeTree } from "./routeTree.gen";

// 1. Inisialisasi QueryClient dengan beberapa pengaturan default
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 5, // Data (misal: profil/portfolio) dianggap fresh selama 5 menit
			retry: 1, // Jika koneksi ke API gagal, coba ulang 1 kali saja
			refetchOnWindowFocus: false, // Jangan fetch ulang otomatis saat user pindah tab
		},
	},
});

// 2. Buat instance router dan injeksikan queryClient ke dalam context
const router = createRouter({
	routeTree,
	context: {
		queryClient,
		auth: useAuthStore,
	},
	defaultPreload: "intent", // Otomatis fetch data saat user hover menu navigasi
	defaultPreloadStaleTime: 0,
});

// Register router untuk Type Safety (Sangat penting di TypeScript!)
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		{/* 3. Bungkus RouterProvider dengan QueryClientProvider */}
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	</StrictMode>
);
