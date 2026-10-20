import { QueryClient } from "@tanstack/react-query";
import { isClientError } from "@/lib/api";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // 4xx (mis. 404 repo tidak ada) tidak akan berubah kalau diulang; 5xx dicoba sekali lagi.
            retry: (failureCount, error) => !isClientError(error) && failureCount < 1,
            refetchOnWindowFocus: false,
        },
    },
});
