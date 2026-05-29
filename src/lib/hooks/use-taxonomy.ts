import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { taxonomyActions } from "@/lib/actions/taxonomy.action";
import {
	type UpsertCategoryForm,
	type UpsertTagForm,
	upsertCategorySchema,
	upsertTagSchema,
} from "@/lib/schemas/taxonomy.schema";

// ==============================
// CATEGORY HOOKS
// ==============================
export function useCategoryForm(defaultValues?: Partial<UpsertCategoryForm>) {
	const upsertMutation = taxonomyActions.useUpsertCategory();

	const form = useForm({
		defaultValues: {
			id: defaultValues?.id || undefined,
			name: defaultValues?.name || "",
			slug: defaultValues?.slug || "",
		} as UpsertCategoryForm,
		validators: {
			onChange: ({ value }) => {
				const result = upsertCategorySchema.safeParse(value);
				if (!result.success) {
					return result.error.issues[0]?.message;
				}
				return undefined;
			},
		},
		onSubmit: async ({ value }) => {
			try {
				await upsertMutation.mutateAsync(value);
				toast.success("Category saved successfully!");
				form.reset();
			} catch (error) {
				const err = error as { error?: string };
				toast.error(err?.error || "Failed to save category.");
			}
		},
	});

	return {
		form,
		loading: upsertMutation.isPending,
		error: upsertMutation.error,
	};
}

export function useCategoryDeletions() {
	const deleteMutation = taxonomyActions.useDeleteCategory();

	const deleteCategory = async (id: string) => {
		try {
			await deleteMutation.mutateAsync(id);
			toast.success("Category deleted successfully!");
		} catch (error) {
			const err = error as { error?: string };
			toast.error(err?.error || "Failed to delete category.");
		}
	};

	return { deleteCategory, isDeleting: deleteMutation.isPending };
}

// ==============================
// TAG HOOKS
// ==============================
export function useTagForm(defaultValues?: Partial<UpsertTagForm>) {
	const upsertMutation = taxonomyActions.useUpsertTag();

	const form = useForm({
		defaultValues: {
			id: defaultValues?.id || undefined,
			name: defaultValues?.name || "",
			slug: defaultValues?.slug || "",
		} as UpsertTagForm,
		validators: {
			onChange: ({ value }) => {
				const result = upsertTagSchema.safeParse(value);
				if (!result.success) {
					return result.error.issues[0]?.message;
				}
				return undefined;
			},
		},
		onSubmit: async ({ value }) => {
			try {
				await upsertMutation.mutateAsync(value);
				toast.success("Tag saved successfully!");
				form.reset();
			} catch (error) {
				const err = error as { error?: string };
				toast.error(err?.error || "Failed to save tag.");
			}
		},
	});

	return {
		form,
		loading: upsertMutation.isPending,
		error: upsertMutation.error,
	};
}

export function useTagDeletions() {
	const deleteMutation = taxonomyActions.useDeleteTag();

	const deleteTag = async (id: string) => {
		try {
			await deleteMutation.mutateAsync(id);
			toast.success("Tag deleted successfully!");
		} catch (error) {
			const err = error as { error?: string };
			toast.error(err?.error || "Failed to delete tag.");
		}
	};

	return { deleteTag, isDeleting: deleteMutation.isPending };
}
