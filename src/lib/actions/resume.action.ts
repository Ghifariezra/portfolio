import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"; // Tambahkan useQuery & useQueryClient
import type {
	UpsertCertificateForm,
	UpsertSkillForm,
} from "@/lib/schemas/resume.schema";
import { resumeService } from "@/lib/services/resume.service";

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
			onSuccess: () => {
				// Invalidasi cache agar data di UI update otomatis setelah sukses
				queryClient.invalidateQueries({ queryKey: resumeKeys.all });
			},
		});
	},

	useDeleteSkill() {
		const queryClient = useQueryClient();
		return useMutation({
			mutationFn: (id: string) => resumeService.deleteSkill(id),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: resumeKeys.all });
			},
		});
	},

	useUpsertCertificate() {
		const queryClient = useQueryClient();
		return useMutation({
			mutationFn: (payload: UpsertCertificateForm) =>
				resumeService.upsertCertificate(payload),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: resumeKeys.all });
			},
		});
	},

	useDeleteCertificate() {
		const queryClient = useQueryClient();
		return useMutation({
			mutationFn: (id: string) => resumeService.deleteCertificate(id),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: resumeKeys.all });
			},
		});
	},
};
