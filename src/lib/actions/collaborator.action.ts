import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
	UpsertCollaboratorForm,
	UpsertCollaboratorLinkForm,
} from "@/lib/schemas/collaborator.schema";
import { collaboratorService } from "@/lib/services/collaborator.service";
import type { AppResponse } from "@/utils/middleware";
import { invalidateContent } from "./invalidate";

export const collaboratorKeys = {
	all: ["collaborators"] as const,
	lists: () => [...collaboratorKeys.all, "list"] as const,
};

export const collaboratorActions = {
	// --- Collaborators ---
	useGetCollaborators() {
		return useQuery<AppResponse, AppResponse>({
			queryKey: collaboratorKeys.lists(),
			queryFn: () => collaboratorService.getCollaborators(),
		});
	},

	useUpsertCollaborator() {
		const queryClient = useQueryClient();
		return useMutation<AppResponse, AppResponse, UpsertCollaboratorForm>({
			mutationFn: (payload) => collaboratorService.upsertCollaborator(payload),
			onSuccess: () =>
				Promise.all([
					queryClient.invalidateQueries({ queryKey: collaboratorKeys.lists() }),
					invalidateContent(queryClient),
				]),
		});
	},

	useDeleteCollaborator() {
		const queryClient = useQueryClient();
		return useMutation<AppResponse, AppResponse, string>({
			mutationFn: (id) => collaboratorService.deleteCollaborator(id),
			onSuccess: () =>
				Promise.all([
					queryClient.invalidateQueries({ queryKey: collaboratorKeys.lists() }),
					invalidateContent(queryClient),
				]),
		});
	},

	// --- Collaborator Links ---
	useUpsertCollaboratorLink() {
		const queryClient = useQueryClient();
		return useMutation<AppResponse, AppResponse, UpsertCollaboratorLinkForm>({
			mutationFn: (payload) =>
				collaboratorService.upsertCollaboratorLink(payload),
			onSuccess: () =>
				Promise.all([
					queryClient.invalidateQueries({ queryKey: collaboratorKeys.lists() }),
					invalidateContent(queryClient),
				]),
		});
	},

	useDeleteCollaboratorLink() {
		const queryClient = useQueryClient();
		return useMutation<AppResponse, AppResponse, string>({
			mutationFn: (id) => collaboratorService.deleteCollaboratorLink(id),
			onSuccess: () =>
				Promise.all([
					queryClient.invalidateQueries({ queryKey: collaboratorKeys.lists() }),
					invalidateContent(queryClient),
				]),
		});
	},
};
