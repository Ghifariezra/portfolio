import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { collaboratorActions } from "@/lib/actions/collaborator.action";
import {
	type UpsertCollaboratorForm,
	type UpsertCollaboratorLinkForm,
	upsertCollaboratorLinkSchema,
	upsertCollaboratorSchema,
} from "@/lib/schemas/collaborator.schema";

// ==============================
// COLLABORATOR HOOKS
// ==============================
export function useCollaboratorForm(
	defaultValues?: Partial<UpsertCollaboratorForm>
) {
	const upsertMutation = collaboratorActions.useUpsertCollaborator();

	const form = useForm({
		defaultValues: {
			id: defaultValues?.id || undefined,
			name: defaultValues?.name || "",
			role: defaultValues?.role || "",
		} as UpsertCollaboratorForm,
		validators: {
			onChange: ({ value }) => {
				const result = upsertCollaboratorSchema.safeParse(value);
				if (!result.success) {
					return result.error.issues[0]?.message;
				}
				return undefined;
			},
		},
		onSubmit: async ({ value }) => {
			try {
				// 1. CUCI DATA DI SINI (Jalankan Zod Parser untuk memicu sanitizeText)
				const parsedData = upsertCollaboratorSchema.parse(value);

				// 2. Gunakan parsedData, BUKAN value mentah!
				const payload = {
					...parsedData,
					role:
						parsedData.role && parsedData.role.trim() !== ""
							? parsedData.role
							: null,
				};

				await upsertMutation.mutateAsync(payload);
				toast.success("Collaborator saved successfully!");
				form.reset();
			} catch (error) {
				const err = error as { error?: string };
				toast.error(err?.error || "Failed to save collaborator.");
			}
		},
	});

	return {
		form,
		loading: upsertMutation.isPending,
		error: upsertMutation.error,
	};
}

export function useCollaboratorDeletions() {
	const deleteMutation = collaboratorActions.useDeleteCollaborator();

	const deleteCollaborator = async (id: string) => {
		try {
			await deleteMutation.mutateAsync(id);
			toast.success("Collaborator deleted successfully!");
		} catch (error) {
			const err = error as { error?: string };
			toast.error(err?.error || "Failed to delete collaborator.");
		}
	};

	return { deleteCollaborator, isDeleting: deleteMutation.isPending };
}

// ==============================
// COLLABORATOR LINK HOOKS
// ==============================
export function useCollaboratorLinkForm(
	defaultValues?: Partial<UpsertCollaboratorLinkForm>
) {
	const upsertMutation = collaboratorActions.useUpsertCollaboratorLink();

	const form = useForm({
		defaultValues: {
			id: defaultValues?.id || undefined,
			collaborator_id: defaultValues?.collaborator_id || "",
			platform: defaultValues?.platform || "",
			url: defaultValues?.url || "",
		} as UpsertCollaboratorLinkForm,
		validators: {
			onChange: ({ value }) => {
				const result = upsertCollaboratorLinkSchema.safeParse(value);
				if (!result.success) {
					return result.error.issues[0]?.message;
				}
				return undefined;
			},
		},
		onSubmit: async ({ value }) => {
			try {
				// 1. CUCI DATA DENGAN ZOD (Memicu sanitizeText untuk URL & Platform)
				const parsedData = upsertCollaboratorLinkSchema.parse(value);

				// 2. Kirim data yang sudah dicuci (parsedData)
				await upsertMutation.mutateAsync(parsedData);
				toast.success("Social link saved successfully!");
				form.reset();
			} catch (error) {
				const err = error as { error?: string };
				toast.error(err?.error || "Failed to save link.");
			}
		},
	});

	return {
		form,
		loading: upsertMutation.isPending,
		error: upsertMutation.error,
	};
}

export function useCollaboratorLinkDeletions() {
	const deleteMutation = collaboratorActions.useDeleteCollaboratorLink();

	const deleteLink = async (id: string) => {
		try {
			await deleteMutation.mutateAsync(id);
			toast.success("Social link deleted successfully!");
		} catch (error) {
			const err = error as { error?: string };
			toast.error(err?.error || "Failed to delete link.");
		}
	};

	return { deleteLink, isDeleting: deleteMutation.isPending };
}
