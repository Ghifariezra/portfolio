import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { adminRequest } from "@/lib/api";
import { type AdminProject, adminProjectSchema } from "../schemas/admin-project.schema";
import { saveProject } from "./project-admin-api";

/** Setelah tulis: segarkan data admin dan cache query publik, supaya halaman publik tidak menampilkan data lama. */
function useRefreshAfterWrite() {
    const queryClient = useQueryClient();
    return () =>
        Promise.all([
            queryClient.invalidateQueries({ queryKey: ["admin"] }),
            queryClient.invalidateQueries({ queryKey: ["portfolio"] }),
        ]);
}

export function useSaveProject() {
    const refresh = useRefreshAfterWrite();
    return useMutation({ mutationFn: saveProject, onSettled: refresh });
}

export function useToggleProject() {
    const refresh = useRefreshAfterWrite();
    return useMutation({
        mutationFn: ({ id, patch }: { id: string; patch: Partial<Pick<AdminProject, "is_visible" | "featured">> }) =>
            adminRequest("PATCH", `/projects/${id}`, adminProjectSchema, patch),
        onSettled: refresh,
    });
}

export function useDeleteProject() {
    const refresh = useRefreshAfterWrite();
    return useMutation({
        mutationFn: (id: string) => adminRequest("DELETE", `/projects/${id}`, z.object({ id: z.string() })),
        onSettled: refresh,
    });
}
