import type {
	LockContentForm,
	UnlockContentForm,
} from "@/lib/schemas/lock.schema";
import type { AppResponse } from "@/utils/middleware";
import { BaseService } from "./base.service";

export class LockService extends BaseService {
	private static instance: LockService;
	private constructor() {
		super();
	}
	public static getInstance(): LockService {
		if (!LockService.instance) LockService.instance = new LockService();
		return LockService.instance;
	}

	public async lock(payload: LockContentForm): Promise<AppResponse> {
		return this.api.post<unknown, AppResponse, LockContentForm>(
			"/locks/lock",
			payload
		);
	}

	public async unlock(payload: UnlockContentForm): Promise<AppResponse> {
		return this.api.post<unknown, AppResponse, UnlockContentForm>(
			"/locks/unlock",
			payload
		);
	}
}
export const lockService = LockService.getInstance();
