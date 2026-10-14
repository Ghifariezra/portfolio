import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
	AssignCollaboratorsForm,
	AssignTagsForm,
	UpsertProjectForm,
} from "@/lib/schemas/project.schema";
import { projectService } from "@/lib/services/project.service";
import { publicKeys } from "./public.action";

export const projectKeys = {
	all: ["projects"] as const,
	lists: () => [...projectKeys.all, "list"] as const,
	details: () => [...projectKeys.all, "detail"] as const,
	detail: (id: string) => [...projectKeys.details(), id] as const,
};

export const projectActions = {
	// 1. TAMBAHKAN HOOK GET LIST
	useGetProjects() {
		return useQuery({
			queryKey: projectKeys.lists(),
			queryFn: () => projectService.getProjects(),
		});
	},

	// 2. TAMBAHKAN HOOK GET DETAIL
	useGetProjectById(id: string) {
		return useQuery({
			queryKey: projectKeys.detail(id),
			queryFn: () => projectService.getProjectById(id),
			enabled: !!id, // Hanya jalankan query jika ID tersedia
		});
	},

	useUploadImage() {
		return useMutation({
			mutationFn: (file: File) => projectService.uploadProjectImage(file),
		});
	},

	useDeleteImage() {
		return useMutation({
			mutationFn: (url: string) => projectService.deleteProjectImage(url),
		});
	},

	useUpsertProject() {
		const queryClient = useQueryClient();
		return useMutation({
			mutationFn: (payload: UpsertProjectForm) =>
				projectService.upsertProject(payload),
			onSuccess: () =>
				Promise.all([
					queryClient.invalidateQueries({ queryKey: projectKeys.all }),
					queryClient.invalidateQueries({ queryKey: publicKeys.all }),
				]),
		});
	},

	useDeleteProject() {
		const queryClient = useQueryClient();
		return useMutation({
			mutationFn: (id: string) => projectService.deleteProject(id),
			onSuccess: () =>
				Promise.all([
					queryClient.invalidateQueries({ queryKey: projectKeys.all }),
					queryClient.invalidateQueries({ queryKey: publicKeys.all }),
				]),
		});
	},

	useAssignTags() {
		const queryClient = useQueryClient();
		return useMutation({
			mutationFn: (payload: AssignTagsForm) =>
				projectService.assignTags(payload),
			onSuccess: () =>
				Promise.all([
					queryClient.invalidateQueries({ queryKey: projectKeys.all }),
					queryClient.invalidateQueries({ queryKey: publicKeys.all }),
				]),
		});
	},

	useAssignCollaborators() {
		const queryClient = useQueryClient();
		return useMutation({
			mutationFn: (payload: AssignCollaboratorsForm) =>
				projectService.assignCollaborators(payload),
			onSuccess: () =>
				Promise.all([
					queryClient.invalidateQueries({ queryKey: projectKeys.all }),
					queryClient.invalidateQueries({ queryKey: publicKeys.all }),
				]),
		});
	},
};
