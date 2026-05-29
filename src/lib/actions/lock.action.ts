import { useMutation /* useQueryClient */ } from "@tanstack/react-query";
import type {
	LockContentForm,
	UnlockContentForm,
} from "@/lib/schemas/lock.schema";
import { lockService } from "@/lib/services/lock.service";
import type { AppResponse } from "@/utils/middleware";

export const lockActions = {
	useLock() {
		return useMutation<AppResponse, AppResponse, LockContentForm>({
			mutationFn: (payload) => lockService.lock(payload),
		});
	},
	useUnlock() {
		return useMutation<AppResponse, AppResponse, UnlockContentForm>({
			mutationFn: (payload) => lockService.unlock(payload),
		});
	},
};
