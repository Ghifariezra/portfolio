import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
	UpsertCollaboratorForm,
	UpsertCollaboratorLinkForm,
} from "@/lib/schemas/collaborator.schema";
import { collaboratorService } from "@/lib/services/collaborator.service";
import type { AppResponse } from "@/utils/middleware";

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
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: collaboratorKeys.lists() });
			},
		});
	},

	useDeleteCollaborator() {
		const queryClient = useQueryClient();
		return useMutation<AppResponse, AppResponse, string>({
			mutationFn: (id) => collaboratorService.deleteCollaborator(id),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: collaboratorKeys.lists() });
			},
		});
	},

	// --- Collaborator Links ---
	useUpsertCollaboratorLink() {
		const queryClient = useQueryClient();
		return useMutation<AppResponse, AppResponse, UpsertCollaboratorLinkForm>({
			mutationFn: (payload) =>
				collaboratorService.upsertCollaboratorLink(payload),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: collaboratorKeys.lists() });
			},
		});
	},

	useDeleteCollaboratorLink() {
		const queryClient = useQueryClient();
		return useMutation<AppResponse, AppResponse, string>({
			mutationFn: (id) => collaboratorService.deleteCollaboratorLink(id),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: collaboratorKeys.lists() });
			},
		});
	},
};
