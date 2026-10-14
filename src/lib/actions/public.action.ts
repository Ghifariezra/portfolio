import { useQuery } from "@tanstack/react-query";
import type {
	AppItem,
	GithubActivityItem,
	GithubContributions,
	GithubProfile,
	HomeContentResponse,
} from "@/lib/services/public.service";
import { publicService } from "@/lib/services/public.service";
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

	// Keys untuk Apps (Sudah include Analytics)
	apps: () => [...publicKeys.all, "apps"] as const,

	// Keys untuk GitHub
	github: () => [...publicKeys.all, "github"] as const,
	githubContributions: () => [...publicKeys.github(), "contributions"] as const,
	githubActivity: (limit: number) =>
		[...publicKeys.github(), "activity", limit] as const,
	githubProfile: () => [...publicKeys.github(), "profile"] as const,
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
			enabled: !!slug,
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
			enabled: !!slug,
		});
	},

	// --- APPS (PENGGANTI ANALYTICS) ---
	useGetApps() {
		return useQuery<AppResponse<AppItem[]>, Error>({
			queryKey: publicKeys.apps(),
			queryFn: () => publicService.getApps(),
			staleTime: 300000, // 5 menit
		});
	},

	// --- GITHUB ---
	useGetGithubContributions() {
		return useQuery<AppResponse<GithubContributions>, Error>({
			queryKey: publicKeys.githubContributions(),
			queryFn: () => publicService.getGithubContributions(),
			staleTime: 3600000, // 1 jam
			retry: 1,
		});
	},

	useGetGithubActivity(limit = 10) {
		return useQuery<AppResponse<GithubActivityItem[]>, Error>({
			queryKey: publicKeys.githubActivity(limit),
			queryFn: () => publicService.getGithubActivity(limit),
			staleTime: 300000,
			retry: 1,
		});
	},

	useGetGithubProfile() {
		return useQuery<AppResponse<GithubProfile>, Error>({
			queryKey: publicKeys.githubProfile(),
			queryFn: () => publicService.getGithubProfile(),
			staleTime: 3600000,
			retry: 1,
		});
	},
};
