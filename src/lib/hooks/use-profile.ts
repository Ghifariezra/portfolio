import { useForm } from "@tanstack/react-form";
import { useCallback } from "react";
import { toast } from "sonner";
import { userActions } from "@/lib/actions/user.action";
import type { UpsertUserForm } from "@/lib/schemas/user.schema";
import { useAuthStore } from "@/lib/stores/auth.store";

export function useProfile() {
	const upsertProfileMutation = userActions.useUpsertProfile();
	const profile = useAuthStore((state) => state.profile);
	const setProfile = useAuthStore((state) => state.setProfile);

	const form = useForm({
		defaultValues: {
			id: profile?.id ?? "",
			username: profile?.username ?? "",
			email: profile?.email ?? "",
			fullname: profile?.fullname ?? "",
			about_me: profile?.about_me ?? "",
			image: profile?.image ?? "",
			role: profile?.role ?? "",
			cv_url: profile?.cv_url ?? "",
			linkedin: profile?.linkedin ?? "",
			github: profile?.github ?? "",
		} as UpsertUserForm,
		onSubmit: async ({ value }) => {
			try {
				const response = await upsertProfileMutation.mutateAsync(value);

				if (response.success) {
					setProfile({ ...profile, ...value });
					toast.success("Profile updated successfully!");
				}
			} catch (error) {
				const err = error as { error?: string };
				toast.error(
					err?.error || "Failed to update profile. Please try again."
				);
			}
		},
	});

	const handleSubmit = useCallback(
		(e: React.FormEvent) => {
			e.preventDefault();
			e.stopPropagation();
			form.handleSubmit();
		},
		[form]
	);

	return {
		form,
		profile,
		handleSubmit,
		loading: upsertProfileMutation.isPending,
		error: upsertProfileMutation.isError ? upsertProfileMutation.error : null,
	};
}
