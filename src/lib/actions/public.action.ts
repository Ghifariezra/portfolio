import { useQuery } from "@tanstack/react-query";
import { publicService } from "@/lib/services/public.service";
import type { HomeContentResponse } from "@/lib/services/public.service";
import type { AppResponse } from "@/utils/middleware";
import type { BlogListItem } from "../schemas/blog.schema";
import type { ProjectListItem } from "../schemas/project.schema";

export const publicKeys = {
    all: ["public"] as const,
    home: () => [...publicKeys.all, "home"] as const,

    // Keys untuk Projects
    projects: () => [...publicKeys.all, "projects"] as const,
    project: (slug: string) => [...publicKeys.projects(), slug] as const,

    // Keys untuk Notes (Blogs)
    notes: () => [...publicKeys.all, "notes"] as const,
    note: (slug: string) => [...publicKeys.notes(), slug] as const,
};

export const publicActions = {
    // --- HOME ---
    useGetHomeContent() {
        return useQuery<AppResponse<HomeContentResponse>, Error>({
            queryKey: publicKeys.home(),
            queryFn: () => publicService.getHomeContent(),
            staleTime: 300000, // 5 menit
        });
    },

    // --- PROJECTS ---
    useGetProjects() {
        return useQuery<AppResponse<ProjectListItem[]>, Error>({
            queryKey: publicKeys.projects(),
            queryFn: () => publicService.getProjects(),
            staleTime: 300000,
        });
    },

    useGetProjectBySlug(slug: string) {
        return useQuery<AppResponse<ProjectListItem>, Error>({
            queryKey: publicKeys.project(slug),
            queryFn: () => publicService.getProjectBySlug(slug),
            staleTime: 300000,
            enabled: !!slug, // Hanya fetch jika slug tersedia
        });
    },

    // --- NOTES (BLOGS) ---
    useGetNotes() {
        return useQuery<AppResponse<BlogListItem[]>, Error>({
            queryKey: publicKeys.notes(),
            queryFn: () => publicService.getNotes(),
            staleTime: 300000,
        });
    },

    useGetNoteBySlug(slug: string) {
        return useQuery<AppResponse<BlogListItem>, Error>({
            queryKey: publicKeys.note(slug),
            queryFn: () => publicService.getNoteBySlug(slug),
            staleTime: 300000,
            enabled: !!slug, // Hanya fetch jika slug tersedia
        });
    },
};