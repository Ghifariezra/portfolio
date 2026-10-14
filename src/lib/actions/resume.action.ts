import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"; // Tambahkan useQuery & useQueryClient
import type {
	UpsertCertificateForm,
	UpsertSkillForm,
} from "@/lib/schemas/resume.schema";
import { resumeService } from "@/lib/services/resume.service";
import { publicKeys } from "./public.action";

export const resumeKeys = {
	all: ["resume"] as const,
	detail: (id: string) => [...resumeKeys.all, id] as const,
};

export const resumeActions = {
	useGetResume(id: string) {
		return useQuery({
			queryKey: resumeKeys.detail(id),
			queryFn: () => resumeService.getResume(id),
			enabled: !!id,
		});
	},

	useUpsertSkill() {
		const queryClient = useQueryClient();
		return useMutation({
			mutationFn: (payload: UpsertSkillForm) =>
				resumeService.upsertSkill(payload),
			onSuccess: () =>
				Promise.all([
					queryClient.invalidateQueries({ queryKey: resumeKeys.all }),
					queryClient.invalidateQueries({ queryKey: publicKeys.all }),
				]),
		});
	},

	useDeleteSkill() {
		const queryClient = useQueryClient();
		return useMutation({
			mutationFn: (id: string) => resumeService.deleteSkill(id),
			onSuccess: () =>
				Promise.all([
					queryClient.invalidateQueries({ queryKey: resumeKeys.all }),
					queryClient.invalidateQueries({ queryKey: publicKeys.all }),
				]),
		});
	},

	useUpsertCertificate() {
		const queryClient = useQueryClient();
		return useMutation({
			mutationFn: (payload: UpsertCertificateForm) =>
				resumeService.upsertCertificate(payload),
			onSuccess: () =>
				Promise.all([
					queryClient.invalidateQueries({ queryKey: resumeKeys.all }),
					queryClient.invalidateQueries({ queryKey: publicKeys.all }),
				]),
		});
	},

	useDeleteCertificate() {
		const queryClient = useQueryClient();
		return useMutation({
			mutationFn: (id: string) => resumeService.deleteCertificate(id),
			onSuccess: () =>
				Promise.all([
					queryClient.invalidateQueries({ queryKey: resumeKeys.all }),
					queryClient.invalidateQueries({ queryKey: publicKeys.all }),
				]),
		});
	},
};
