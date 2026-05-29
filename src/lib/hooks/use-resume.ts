import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { resumeActions } from "@/lib/actions/resume.action";
import {
	type UpsertCertificateForm,
	type UpsertSkillForm,
	upsertCertificateSchema,
	upsertSkillSchema,
} from "@/lib/schemas/resume.schema";

export function useSkillForm(defaultValues?: Partial<UpsertSkillForm>) {
	const upsertSkillMutation = resumeActions.useUpsertSkill();

	const form = useForm({
		defaultValues: {
			id: defaultValues?.id || undefined,
			user_id: defaultValues?.user_id || "",
			name: defaultValues?.name || "",
			type_skill: defaultValues?.type_skill || "",
			image: defaultValues?.image || null,
		} as UpsertSkillForm,
		validators: {
			onChange: upsertSkillSchema,
		},
		onSubmit: async ({ value }) => {
			// Bersihkan data sebelum kirim ke backend
			const payload = {
				...value,
				image: value.image && value.image.trim() !== "" ? value.image : null,
			};

			try {
				await upsertSkillMutation.mutateAsync(payload);
				toast.success("Skill saved successfully!");
				form.reset();
			} catch (error) {
				const err = error as { error?: string };
				toast.error(err?.error || "Failed to save skill.");
			}
		},
	});

	return {
		form,
		loading: upsertSkillMutation.isPending,
		error: upsertSkillMutation.error,
	};
}

export function useCertificateForm(
	defaultValues?: Partial<UpsertCertificateForm>
) {
	const upsertCertificateMutation = resumeActions.useUpsertCertificate();

	const form = useForm({
		defaultValues: {
			id: defaultValues?.id || undefined,
			user_id: defaultValues?.user_id || "",
			name: defaultValues?.name || "",
			type_certified: defaultValues?.type_certified || "",
			image: defaultValues?.image || null,
		} as UpsertCertificateForm,
		validators: {
			onChange: upsertCertificateSchema,
		},
		onSubmit: async ({ value }) => {
			// Bersihkan data sebelum kirim ke backend
			const payload = {
				...value,
				image: value.image && value.image.trim() !== "" ? value.image : null,
			};

			try {
				await upsertCertificateMutation.mutateAsync(payload);
				toast.success("Certificate saved successfully!");
				form.reset();
			} catch (error) {
				const err = error as { error?: string };
				toast.error(err?.error || "Failed to save certificate.");
			}
		},
	});

	return {
		form,
		loading: upsertCertificateMutation.isPending,
		error: upsertCertificateMutation.error,
	};
}

export function useResumeDeletions() {
	const deleteSkillMutation = resumeActions.useDeleteSkill();
	const deleteCertificateMutation = resumeActions.useDeleteCertificate();

	const deleteSkill = async (id: string) => {
		try {
			await deleteSkillMutation.mutateAsync(id);
			toast.success("Skill deleted successfully!");
		} catch (error) {
			const err = error as { error?: string };
			toast.error(err?.error || "Failed to delete skill.");
		}
	};

	const deleteCertificate = async (id: string) => {
		try {
			await deleteCertificateMutation.mutateAsync(id);
			toast.success("Certificate deleted successfully!");
		} catch (error) {
			const err = error as { error?: string };
			toast.error(err?.error || "Failed to delete certificate.");
		}
	};

	return {
		deleteSkill,
		isDeletingSkill: deleteSkillMutation.isPending,
		deleteCertificate,
		isDeletingCertificate: deleteCertificateMutation.isPending,
	};
}
