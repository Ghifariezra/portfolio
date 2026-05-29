import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UpsertScheduleForm } from "@/lib/schemas/schedule.schema";
import { scheduleService } from "@/lib/services/schedule.service";
import type { AppResponse } from "@/utils/middleware";

export const scheduleKeys = {
	all: ["schedules"] as const,
	lists: () => [...scheduleKeys.all, "list"] as const,
};

export const scheduleActions = {
	useGetSchedules() {
		return useQuery<AppResponse, AppResponse>({
			queryKey: scheduleKeys.lists(),
			queryFn: () => scheduleService.getSchedules(),
		});
	},

	useUpsertSchedule() {
		const queryClient = useQueryClient();
		return useMutation<AppResponse, AppResponse, UpsertScheduleForm>({
			mutationFn: (payload) => scheduleService.upsertSchedule(payload),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() });
			},
		});
	},

	useDeleteSchedule() {
		const queryClient = useQueryClient();
		return useMutation<AppResponse, AppResponse, string>({
			mutationFn: (id) => scheduleService.deleteSchedule(id),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() });
			},
		});
	},
};
