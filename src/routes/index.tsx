import { createFileRoute, redirect } from "@tanstack/react-router";

// Home belum dibuat; sementara arahkan ke halaman pertama yang sudah ada.
export const Route = createFileRoute("/")({
    beforeLoad: () => {
        throw redirect({ to: "/projects" });
    },
});
