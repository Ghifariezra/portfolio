import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"; // 1. Tambah useQueryClient
import type {
	UpsertCategoryForm,
	UpsertTagForm,
} from "@/lib/schemas/taxonomy.schema";
import { taxonomyService } from "@/lib/services/taxonomy.service";
import type { AppResponse } from "@/utils/middleware";

export const taxonomyKeys = {
	all: ["taxonomies"] as const,
	categories: () => [...taxonomyKeys.all, "categories"] as const,
	tags: () => [...taxonomyKeys.all, "tags"] as const,
};

export const taxonomyActions = {
	useGetCategories() {
		return useQuery<AppResponse, AppResponse>({
			queryKey: taxonomyKeys.categories(),
			queryFn: () => taxonomyService.getCategories(),
		});
	},

	useUpsertCategory() {
		const queryClient = useQueryClient(); // 2. Inisialisasi queryClient
		return useMutation<AppResponse, AppResponse, UpsertCategoryForm>({
			mutationFn: (payload) => taxonomyService.upsertCategory(payload),
			onSuccess: () => {
				// 3. Invalidasi agar list otomatis update
				queryClient.invalidateQueries({ queryKey: taxonomyKeys.categories() });
			},
		});
	},

	useDeleteCategory() {
		const queryClient = useQueryClient();
		return useMutation<AppResponse, AppResponse, string>({
			mutationFn: (id) => taxonomyService.deleteCategory(id),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: taxonomyKeys.categories() });
			},
		});
	},

	useGetTags() {
		return useQuery<AppResponse, AppResponse>({
			queryKey: taxonomyKeys.tags(),
			queryFn: () => taxonomyService.getTags(),
		});
	},

	useUpsertTag() {
		const queryClient = useQueryClient();
		return useMutation<AppResponse, AppResponse, UpsertTagForm>({
			mutationFn: (payload) => taxonomyService.upsertTag(payload),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: taxonomyKeys.tags() });
			},
		});
	},

	useDeleteTag() {
		const queryClient = useQueryClient();
		return useMutation<AppResponse, AppResponse, string>({
			mutationFn: (id) => taxonomyService.deleteTag(id),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: taxonomyKeys.tags() });
			},
		});
	},
};
