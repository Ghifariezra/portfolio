import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";
import { toast } from "sonner";
import { userActions } from "@/lib/actions/user.action";
import { type LoginForm, loginSchema } from "@/lib/schemas/user.schema";
import { useAuthStore } from "@/lib/stores/auth.store";

export function useAuth() {
	const loginMutation = userActions.useLogin();
	const logoutMutation = userActions.useLogout();
	const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);
	const setProfile = useAuthStore((state) => state.setProfile);
	const logoutStore = useAuthStore((state) => state.logout);
	const navigate = useNavigate();

	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
		} as LoginForm,
		validators: {
			onChange: loginSchema,
		},
		onSubmit: async ({ value }) => {
			try {
				const cleanData = loginSchema.parse(value);

				const response = await loginMutation.mutateAsync(cleanData);

				if (response.success && response.data) {
					setIsAuthenticated(true);
					setProfile(response.data.user);
					toast.success("Login successful!");
					navigate({ to: "/dashboard" });
				}
			} catch (error) {
				const err = error as { error?: string };
				toast.error(
					err?.error || "Login failed. Please check your credentials."
				);
			}
		},
	});

	// 3. Buat fungsi eksekusi Logout
	const handleLogout = useCallback(async () => {
		try {
			// Panggil API Backend untuk menghapus HttpOnly Cookie
			await logoutMutation.mutateAsync();
		} catch (error) {
			console.error("Failed to clear cookie on server", error);
		} finally {
			// Selalu bersihkan state lokal dan redirect, meskipun API error
			logoutStore();
			toast.success("Logged out successfully");
			navigate({ to: "/auth/admin" });
		}
	}, [logoutMutation, logoutStore, navigate]);

	return {
		form,
		loading: loginMutation.isPending,
		error: loginMutation.isError ? loginMutation.error : null,
		handleLogout,
		isLoggingOut: logoutMutation.isPending,
	};
}
