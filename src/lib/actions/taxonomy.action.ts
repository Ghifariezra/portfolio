import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
	UpsertCategoryForm,
	UpsertTagForm,
} from "@/lib/schemas/taxonomy.schema";
import { taxonomyService } from "@/lib/services/taxonomy.service";
import type { AppResponse } from "@/utils/middleware";
import { invalidateContent } from "./invalidate";

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
		const queryClient = useQueryClient();
		return useMutation<AppResponse, AppResponse, UpsertCategoryForm>({
			mutationFn: (payload) => taxonomyService.upsertCategory(payload),
			onSuccess: () =>
				Promise.all([
					queryClient.invalidateQueries({
						queryKey: taxonomyKeys.categories(),
					}),
					invalidateContent(queryClient),
				]),
		});
	},

	useDeleteCategory() {
		const queryClient = useQueryClient();
		return useMutation<AppResponse, AppResponse, string>({
			mutationFn: (id) => taxonomyService.deleteCategory(id),
			onSuccess: () =>
				Promise.all([
					queryClient.invalidateQueries({
						queryKey: taxonomyKeys.categories(),
					}),
					invalidateContent(queryClient),
				]),
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
			onSuccess: () =>
				Promise.all([
					queryClient.invalidateQueries({ queryKey: taxonomyKeys.tags() }),
					invalidateContent(queryClient),
				]),
		});
	},

	useDeleteTag() {
		const queryClient = useQueryClient();
		return useMutation<AppResponse, AppResponse, string>({
			mutationFn: (id) => taxonomyService.deleteTag(id),
			onSuccess: () =>
				Promise.all([
					queryClient.invalidateQueries({ queryKey: taxonomyKeys.tags() }),
					invalidateContent(queryClient),
				]),
		});
	},
};
