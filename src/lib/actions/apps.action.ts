import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UpsertAppForm } from "@/lib/schemas/apps.schema";
import type { AssignTagsForm } from "@/lib/schemas/project.schema";
import { appsService } from "@/lib/services/apps.service";
import { publicKeys } from "./public.action";

export const appKeys = {
	all: ["apps"] as const,
	lists: () => [...appKeys.all, "list"] as const,
	details: () => [...appKeys.all, "detail"] as const,
	detail: (id: string) => [...appKeys.details(), id] as const,
};

export const appActions = {
	useGetApps() {
		return useQuery({
			queryKey: appKeys.lists(),
			queryFn: () => appsService.getApps(),
		});
	},

	useGetAppById(id: string) {
		return useQuery({
			queryKey: appKeys.detail(id),
			queryFn: () => appsService.getAppById(id),
			enabled: !!id,
		});
	},

	useUploadImage() {
		return useMutation({
			mutationFn: (file: File) => appsService.uploadAppImage(file),
		});
	},

	useDeleteImage() {
		return useMutation({
			mutationFn: (url: string) => appsService.deleteAppImage(url),
		});
	},

	useUpsertApp() {
		const queryClient = useQueryClient();
		return useMutation({
			mutationFn: (payload: UpsertAppForm) => appsService.upsertApp(payload),
			onSuccess: () =>
				Promise.all([
					queryClient.invalidateQueries({ queryKey: appKeys.all }),
					queryClient.invalidateQueries({ queryKey: publicKeys.all }),
				]),
		});
	},

	useDeleteApp() {
		const queryClient = useQueryClient();
		return useMutation({
			mutationFn: (id: string) => appsService.deleteApp(id),
			onSuccess: () =>
				Promise.all([
					queryClient.invalidateQueries({ queryKey: appKeys.all }),
					queryClient.invalidateQueries({ queryKey: publicKeys.all }),
				]),
		});
	},

	useAssignTags() {
		const queryClient = useQueryClient();
		return useMutation({
			mutationFn: (payload: AssignTagsForm) => appsService.assignTags(payload),
			onSuccess: () =>
				Promise.all([
					queryClient.invalidateQueries({ queryKey: appKeys.all }),
					queryClient.invalidateQueries({ queryKey: publicKeys.all }),
				]),
		});
	},
};
