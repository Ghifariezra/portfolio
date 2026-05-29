import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { blogActions } from "@/lib/actions/blog.action";
import { scheduleActions } from "@/lib/actions/schedule.action";
import type { UpsertBlogForm } from "@/lib/schemas/blog.schema";
import type { UpsertScheduleForm } from "@/lib/schemas/schedule.schema";

export function useBlogForm(
	defaultValues?: Partial<UpsertBlogForm>,
	defaultSchedule?: Partial<UpsertScheduleForm>
) {
	const navigate = useNavigate();

	const upsertBlogMutation = blogActions.useUpsertBlog();
	const assignTagsMutation = blogActions.useAssignTags();
	const uploadImageMutation = blogActions.useUploadImage();
	const deleteImageMutation = blogActions.useDeleteImage();
	const upsertScheduleMutation = scheduleActions.useUpsertSchedule();

	const form = useForm({
		defaultValues: {
			id: defaultValues?.id || undefined,
			user_id: defaultValues?.user_id || "",
			title: defaultValues?.title || "",
			slug: defaultValues?.slug || "",
			description: defaultValues?.description || "",
			content: defaultValues?.content || "",
			image: defaultValues?.image || null,
			_pendingImageFile: null as File | null,
			_originalImage: defaultValues?.image || null,
			type_language: defaultValues?.type_language || null,
			progress: defaultValues?.progress || 0,
			embed_url: defaultValues?.embed_url || null,
			embed_type: defaultValues?.embed_type || "",
			tag_ids: defaultValues?.tag_ids || [],
			// ── Schedule fields (tidak dikirim ke upsert_blog) ──
			_schedule_id: defaultSchedule?.id || undefined,
			_publish_status: (defaultSchedule?.publish_status || "draft") as
				| "draft"
				| "scheduled"
				| "published"
				| "archived",
			_publish_date: defaultSchedule?.publish_date || null,
			_scheduled_at: defaultSchedule?.scheduled_at || null,
		} as UpsertBlogForm & {
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
					toast.error("Failed to upload image. Blog not saved.");
					return;
				}
			}

			const payload: UpsertBlogForm = {
				...rest,
				tag_ids,
				image: imageUrl?.trim() || null,
				embed_url: rest.embed_url?.trim() || null,
			};

			try {
				const res = await upsertBlogMutation.mutateAsync(payload);
				const responseData = res.data as { id?: string } | undefined;
				const newBlogId = responseData?.id;
				if (!newBlogId) throw new Error("Failed to retrieve blog ID");

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

				// 3. Jalankan tags + schedule secara paralel
				const sideEffects: Promise<unknown>[] = [];

				if (tag_ids?.length > 0) {
					sideEffects.push(
						assignTagsMutation.mutateAsync({
							resource_id: newBlogId,
							tag_ids,
						})
					);
				}

				// Selalu upsert schedule — "draft" pun perlu disimpan
				// agar publish_status konsisten di vw_blog_list
				sideEffects.push(
					upsertScheduleMutation.mutateAsync({
						id: _schedule_id,
						blog_id: newBlogId,
						publish_status: _publish_status,
						publish_date:
							_publish_status === "scheduled" ? _publish_date : null,
						scheduled_at:
							_publish_status === "scheduled" ? _scheduled_at : null,
					})
				);

				await Promise.all(sideEffects);

				toast.success(value.id ? "Blog updated!" : "Blog created!");
				form.reset();
				navigate({ to: "/dashboard/posts" });
			} catch (error) {
				// Rollback: hapus gambar baru jika upsert gagal
				if (_pendingImageFile && imageUrl && imageUrl !== _originalImage) {
					await deleteImageMutation.mutateAsync(imageUrl).catch(() => null);
				}
				const err = error as { error?: string };
				toast.error(err?.error || "Failed to save blog.");
			}
		},
	});

	const isPending =
		upsertBlogMutation.isPending ||
		assignTagsMutation.isPending ||
		uploadImageMutation.isPending ||
		upsertScheduleMutation.isPending;

	return { form, loading: isPending, error: upsertBlogMutation.error };
}

export function useBlogDeletions() {
	const deleteBlogMutation = blogActions.useDeleteBlog();

	const deleteBlog = async (id: string) => {
		try {
			await deleteBlogMutation.mutateAsync(id);
			toast.success("Blog deleted successfully!");
		} catch (error) {
			const err = error as { error?: string };
			toast.error(err?.error || "Failed to delete blog.");
		}
	};

	return {
		deleteBlog,
		isDeletingBlog: deleteBlogMutation.isPending,
	};
}
