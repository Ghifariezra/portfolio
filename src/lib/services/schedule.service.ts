import type { UpsertScheduleForm } from "@/lib/schemas/schedule.schema";
import type { AppResponse } from "@/utils/middleware";
import { BaseService } from "./base.service";

export class ScheduleService extends BaseService {
	private static instance: ScheduleService;

	private constructor() {
		super();
	}

	public static getInstance(): ScheduleService {
		if (!ScheduleService.instance) {
			ScheduleService.instance = new ScheduleService();
		}
		return ScheduleService.instance;
	}

	// Mendapatkan daftar schedule (Opsional, sangat berguna untuk kalender/list di UI)
	public async getSchedules(): Promise<AppResponse> {
		return this.api.get<unknown, AppResponse>("/schedules");
	}

	public async upsertSchedule(
		payload: UpsertScheduleForm
	): Promise<AppResponse> {
		return this.api.put<unknown, AppResponse, UpsertScheduleForm>(
			"/schedules",
			payload
		);
	}

	public async deleteSchedule(id: string): Promise<AppResponse> {
		return this.api.delete<unknown, AppResponse>(`/schedules/${id}`);
	}
}

export const scheduleService = ScheduleService.getInstance();
