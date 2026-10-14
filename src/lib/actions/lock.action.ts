import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
	LockContentForm,
	UnlockContentForm,
} from "@/lib/schemas/lock.schema";
import { lockService } from "@/lib/services/lock.service";
import type { AppResponse } from "@/utils/middleware";
import { invalidateContent } from "./invalidate";

export const lockActions = {
	useLock() {
		const queryClient = useQueryClient();
		return useMutation<AppResponse, AppResponse, LockContentForm>({
			mutationFn: (payload) => lockService.lock(payload),
			onSuccess: () => invalidateContent(queryClient),
		});
	},
	useUnlock() {
		const queryClient = useQueryClient();
		return useMutation<AppResponse, AppResponse, UnlockContentForm>({
			mutationFn: (payload) => lockService.unlock(payload),
			onSuccess: () => invalidateContent(queryClient),
		});
	},
};
