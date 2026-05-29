import { useMutation, useQuery } from "@tanstack/react-query";
import type { LoginForm, UpsertUserForm } from "@/lib/schemas/user.schema";
import { userService } from "@/lib/services/user.service";
import type { AppResponse } from "@/utils/middleware";

export const userKeys = {
	all: ["user"] as const,
	profile: () => [...userKeys.all, "profile"] as const,
	me: () => [...userKeys.all, "me"] as const,
};

export const userActions = {
	useGetMe() {
		return useQuery<AppResponse, AppResponse>({
			queryKey: userKeys.me(),
			queryFn: () => userService.getMe(),
			retry: false,
		});
	},

	useLogin() {
		return useMutation<
			AppResponse<{ token: string; user: UpsertUserForm }>,
			AppResponse,
			LoginForm
		>({
			mutationFn: (payload: LoginForm) => userService.login(payload),
		});
	},

	useLogout() {
		// Mutation tanpa payload (void)
		return useMutation<AppResponse, AppResponse, void>({
			mutationFn: () => userService.logout(),
		});
	},

	useUpsertProfile() {
		return useMutation<AppResponse, AppResponse, UpsertUserForm>({
			mutationFn: (payload: UpsertUserForm) =>
				userService.upsertProfile(payload),
		});
	},
};
