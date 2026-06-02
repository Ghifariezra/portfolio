import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { appActions } from "@/lib/actions/apps.action";
import type { UpsertAppForm } from "@/lib/schemas/apps.schema";

export function useAppForm(defaultValues?: Partial<UpsertAppForm>) {
	const navigate = useNavigate();

	const upsertAppMutation = appActions.useUpsertApp();
	const assignTagsMutation = appActions.useAssignTags();
	const uploadImageMutation = appActions.useUploadImage();
	const deleteImageMutation = appActions.useDeleteImage();

	const form = useForm({
		defaultValues: {
			id: defaultValues?.id || undefined,
			user_id: defaultValues?.user_id || "",
			title: defaultValues?.title || "",
			description: defaultValues?.description || "",
			image: defaultValues?.image || null,
			_pendingImageFile: null as File | null,
			_originalImage: defaultValues?.image || null,
			status: defaultValues?.status || "coming_soon",
			microsoft_store_id: defaultValues?.microsoft_store_id || null,
			store_url: defaultValues?.store_url || null,
			tag_ids: defaultValues?.tag_ids || [],
		} as UpsertAppForm & {
			_pendingImageFile: File | null;
			_originalImage: string | null;
		},

		onSubmit: async ({ value }) => {
			const { tag_ids, _pendingImageFile, _originalImage, ...rest } = value;

			let imageUrl = rest.image;

			// 1. Jalankan upload ke storage jika ada file gambar baru di antrean
			if (_pendingImageFile) {
				try {
					const res = await uploadImageMutation.mutateAsync(_pendingImageFile);
					const data = res.data as { url?: string };
					if (!data?.url) throw new Error("Upload gagal");
					imageUrl = data.url;
				} catch {
					toast.error("Failed to upload image. App data not saved.");
					return;
				}
			}

			const payload: UpsertAppForm = {
				...rest,
				tag_ids,
				image: imageUrl?.trim() || null,
				microsoft_store_id: rest.microsoft_store_id?.trim() || null,
				store_url: rest.store_url?.trim() || null,
			};

			try {
				// 2. Ekstrak data teks ke RPC database via BE
				const res = await upsertAppMutation.mutateAsync(payload);
				const responseData = res.data as { id?: string } | undefined;
				const newAppId = responseData?.id;

				if (!newAppId) throw new Error("Failed to retrieve app ID");

				// 3. Bersihkan gambar lama di Supabase jika gambar sukses diganti/dihapus
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

				// 4. Sinkronisasi m2m tags
				if (tag_ids?.length > 0) {
					await assignTagsMutation.mutateAsync({
						resource_id: newAppId,
						tag_ids,
					});
				}

				toast.success(
					value.id ? "App updated successfully!" : "App created successfully!"
				);
				form.reset();
				navigate({ to: "/dashboard/apps" });
			} catch (error) {
				// Fallback / Rollback: Hapus file baru dari bucket jika insert data DB gagal
				if (_pendingImageFile && imageUrl && imageUrl !== _originalImage) {
					await deleteImageMutation.mutateAsync(imageUrl).catch(() => null);
				}
				const err = error as { error?: string };
				toast.error(err?.error || "Failed to save app data.");
			}
		},
	});

	const isPending =
		upsertAppMutation.isPending ||
		assignTagsMutation.isPending ||
		uploadImageMutation.isPending;

	return { form, loading: isPending, error: upsertAppMutation.error };
}

export function useAppDeletions() {
	const deleteAppMutation = appActions.useDeleteApp();

	const deleteApp = async (id: string) => {
		try {
			await deleteAppMutation.mutateAsync(id);
			toast.success("App structure deleted successfully!");
		} catch (error) {
			const err = error as { error?: string };
			toast.error(err?.error || "Failed to delete app entry.");
		}
	};

	return {
		deleteApp,
		isDeletingApp: deleteAppMutation.isPending,
	};
}
