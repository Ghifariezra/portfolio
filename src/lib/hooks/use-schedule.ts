import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { scheduleActions } from "@/lib/actions/schedule.action";
import {
	type UpsertScheduleForm,
	upsertScheduleSchema,
} from "@/lib/schemas/schedule.schema";

export function useScheduleForm(defaultValues?: Partial<UpsertScheduleForm>) {
	const upsertMutation = scheduleActions.useUpsertSchedule();

	const form = useForm({
		defaultValues: {
			id: defaultValues?.id || undefined,
			publish_status: defaultValues?.publish_status || "draft",
			blog_id: defaultValues?.blog_id || null,
			project_id: defaultValues?.project_id || null,
			publish_date: defaultValues?.publish_date || null,
			scheduled_at: defaultValues?.scheduled_at || null,
		} as UpsertScheduleForm,
		validators: {
			onChange: ({ value }) => {
				const result = upsertScheduleSchema.safeParse(value);
				if (!result.success) {
					return result.error.issues[0]?.message;
				}
				return undefined;
			},
		},
		onSubmit: async ({ value }) => {
			try {
				// 1. Validasi final & pastikan tipe data sesuai skema (termasuk aturan XOR)
				const parsedData = upsertScheduleSchema.parse(value);

				// 2. Kirim payload
				await upsertMutation.mutateAsync(parsedData);

				toast.success("Schedule saved successfully!");
				form.reset();
			} catch (error) {
				toast.error(
					error instanceof Error && error.message
						? error.message
						: "Failed to save schedule. Please try again."
				);
			}
		},
	});

	return {
		form,
		loading: upsertMutation.isPending,
		error: upsertMutation.error,
	};
}

export function useScheduleDeletions() {
	const deleteMutation = scheduleActions.useDeleteSchedule();

	const deleteSchedule = async (id: string) => {
		try {
			await deleteMutation.mutateAsync(id);
			toast.success("Schedule deleted successfully!");
		} catch (error) {
			toast.error(
				error instanceof Error && error.message
					? error.message
					: "Failed to delete schedule. Please try again."
			);
		}
	};

	return { deleteSchedule, isDeleting: deleteMutation.isPending };
}
