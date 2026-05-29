import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { projectActions } from "@/lib/actions/project.action";
import { scheduleActions } from "@/lib/actions/schedule.action";
import type { UpsertProjectForm } from "@/lib/schemas/project.schema";
import type { UpsertScheduleForm } from "@/lib/schemas/schedule.schema";

export function useProjectForm(
	defaultValues?: Partial<UpsertProjectForm>,
	defaultSchedule?: Partial<UpsertScheduleForm>
) {
	const navigate = useNavigate();

	const upsertProjectMutation = projectActions.useUpsertProject();
	const assignTagsMutation = projectActions.useAssignTags();
	const assignCollaboratorsMutation = projectActions.useAssignCollaborators();
	const uploadImageMutation = projectActions.useUploadImage();
	const deleteImageMutation = projectActions.useDeleteImage();
	const upsertScheduleMutation = scheduleActions.useUpsertSchedule();

	const form = useForm({
		defaultValues: {
			id: defaultValues?.id || undefined,
			user_id: defaultValues?.user_id || "",
			title: defaultValues?.title || "",
			slug: defaultValues?.slug || "",
			category_id: defaultValues?.category_id || null,
			description: defaultValues?.description || "",
			content: defaultValues?.content || "",
			image: defaultValues?.image || null,
			_pendingImageFile: null as File | null,
			_originalImage: defaultValues?.image || null,
			status: defaultValues?.status || "Individual",
			progress: defaultValues?.progress || 0,
			embed_url: defaultValues?.embed_url || null,
			embed_type: defaultValues?.embed_type || "",
			tag_ids: defaultValues?.tag_ids || [],
			collaborator_ids: defaultValues?.collaborator_ids || [],
			// ── Schedule fields ──
			_schedule_id: defaultSchedule?.id || undefined,
			_publish_status: (defaultSchedule?.publish_status || "draft") as
				| "draft"
				| "scheduled"
				| "published"
				| "archived",
			_publish_date: defaultSchedule?.publish_date || null,
			_scheduled_at: defaultSchedule?.scheduled_at || null,
		} as UpsertProjectForm & {
			_pendingImageFile: File | null;
			_originalImage: string | null;
			_schedule_id: string | undefined;
			_publish_status: "draft" | "scheduled" | "published" | "archived";
			_publish_date: string | null;
			_scheduled_at: string | null;
		},

		onSubmit: async ({ value }) => {
			const {
				tag_ids,
				collaborator_ids,
				_pendingImageFile,
				_originalImage,
				_schedule_id,
				_publish_status,
				_publish_date,
				_scheduled_at,
				...rest
			} = value;

			let imageUrl = rest.image;

			// 1. Upload gambar baru jika ada file pending
			if (_pendingImageFile) {
				try {
					const res = await uploadImageMutation.mutateAsync(_pendingImageFile);
					const data = res.data as { url?: string };
					if (!data?.url) throw new Error("Upload gagal, URL tidak ditemukan");
					imageUrl = data.url;
				} catch {
					toast.error("Failed to upload image. Project not saved.");
					return;
				}
			}

			const payload: UpsertProjectForm = {
				...rest,
				tag_ids,
				collaborator_ids,
				image: imageUrl?.trim() || null,
				embed_url: rest.embed_url?.trim() || null,
			};

			try {
				const res = await upsertProjectMutation.mutateAsync(payload);
				const responseData = res.data as { id?: string } | undefined;
				const newProjectId = responseData?.id;
				if (!newProjectId) throw new Error("Failed to retrieve project ID");

				// 2. Hapus gambar lama jika diganti atau dihapus
				const isReplaced =
					_pendingImageFile !== null &&
					_originalImage !== null &&
					imageUrl !== _originalImage;

				const isRemoved = !imageUrl && _originalImage !== null;

				if (isReplaced || isRemoved) {
					await deleteImageMutation
						.mutateAsync(_originalImage as string)
						.catch(() => null);
				}

				// 3. Assign tags, collaborators, dan schedule secara paralel
				const sideEffects: Promise<unknown>[] = [];

				if (tag_ids?.length > 0) {
					sideEffects.push(
						assignTagsMutation.mutateAsync({
							resource_id: newProjectId,
							tag_ids,
						})
					);
				}

				if (value.status === "Collaboration" && collaborator_ids?.length > 0) {
					sideEffects.push(
						assignCollaboratorsMutation.mutateAsync({
							project_id: newProjectId,
							collaborator_ids,
						})
					);
				}

				// Selalu upsert schedule
				sideEffects.push(
					upsertScheduleMutation.mutateAsync({
						id: _schedule_id,
						project_id: newProjectId,
						publish_status: _publish_status,
						publish_date:
							_publish_status === "scheduled" ? _publish_date : null,
						scheduled_at:
							_publish_status === "scheduled" ? _scheduled_at : null,
					})
				);

				await Promise.all(sideEffects);

				toast.success(value.id ? "Project updated!" : "Project created!");
				form.reset();
				navigate({ to: "/dashboard/projects" });
			} catch (error) {
				// 4. Rollback: hapus gambar baru jika upsert gagal
				if (_pendingImageFile && imageUrl && imageUrl !== _originalImage) {
					await deleteImageMutation.mutateAsync(imageUrl).catch(() => null);
				}
				const err = error as { error?: string };
				toast.error(err?.error || "Failed to save project.");
			}
		},
	});

	const isPending =
		upsertProjectMutation.isPending ||
		assignTagsMutation.isPending ||
		assignCollaboratorsMutation.isPending ||
		uploadImageMutation.isPending ||
		upsertScheduleMutation.isPending;

	return { form, loading: isPending, error: upsertProjectMutation.error };
}

export function useProjectDeletions() {
	const deleteProjectMutation = projectActions.useDeleteProject();

	const deleteProject = async (id: string) => {
		try {
			await deleteProjectMutation.mutateAsync(id);
			toast.success("Project deleted successfully!");
		} catch (error) {
			const err = error as { error?: string };
			toast.error(err?.error || "Failed to delete project.");
		}
	};

	return {
		deleteProject,
		isDeletingProject: deleteProjectMutation.isPending,
	};
}
