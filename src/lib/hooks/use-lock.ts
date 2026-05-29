import { toast } from "sonner";
import { lockActions } from "@/lib/actions/lock.action";
import type {
	LockContentForm,
	UnlockContentForm,
} from "@/lib/schemas/lock.schema";

export function useLockManager() {
	const lockMutation = lockActions.useLock();
	const unlockMutation = lockActions.useUnlock();

	const lockResource = async (payload: LockContentForm) => {
		try {
			await lockMutation.mutateAsync(payload);
			toast.success("Resource locked successfully");
		} catch (error) {
			toast.error(
				error instanceof Error && error.message
					? error.message
					: "Failed to lock resource. Please try again."
			);
		}
	};

	const unlockResource = async (payload: UnlockContentForm) => {
		try {
			await unlockMutation.mutateAsync(payload);
			toast.success("Resource unlocked");
		} catch (error) {
			toast.error(
				error instanceof Error && error.message
					? error.message
					: "Failed to unlock resource. Please try again."
			);
		}
	};

	return {
		lockResource,
		unlockResource,
		isLocking: lockMutation.isPending,
		isUnlocking: unlockMutation.isPending,
	};
}
