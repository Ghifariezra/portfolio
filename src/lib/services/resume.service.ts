import type {
	UpsertCertificateForm,
	UpsertSkillForm,
} from "@/lib/schemas/resume.schema";
import type { AppResponse } from "@/utils/middleware";
import { BaseService } from "./base.service";

export interface ResumeData {
	user_id: string;
	username: string;
	fullname: string;
	email: string;
	certificates: UpsertCertificateForm[];
	skills: UpsertSkillForm[];
}

// Update tipe response agar menggunakan ResumeData
type ResumeResponse = AppResponse<ResumeData>;

export class ResumeService extends BaseService {
	private static instance: ResumeService;

	private constructor() {
		super();
	}

	public static getInstance(): ResumeService {
		if (!ResumeService.instance) {
			ResumeService.instance = new ResumeService();
		}
		return ResumeService.instance;
	}

	/**
	 * Ambil data resume (menggunakan View vw_user_resume)
	 * GET /api/v1/resume/:id
	 */
	public async getResume(id: string): Promise<ResumeResponse> {
		// Menggunakan ResumeResponse agar tipe datanya jelas di frontend
		return this.api.get<unknown, ResumeResponse>(`/resume/${id}`);
	}

	/**
	 * Upsert keahlian (Skill)
	 * PUT /api/v1/resume/skills
	 */
	public async upsertSkill(payload: UpsertSkillForm): Promise<AppResponse> {
		// Pecah string nama berdasarkan koma
		const names = payload.name
			.split(",")
			.map((n) => n.trim())
			.filter((n) => n !== "");

		// Jika ada lebih dari satu skill, kirim satu per satu atau ubah backend ke bulk insert
		// Untuk saat ini, kita kirim array of promises
		const promises = names.map((name) =>
			this.api.put<unknown, AppResponse, UpsertSkillForm>("/resume/skills", {
				...payload,
				name,
			})
		);

		return Promise.all(promises).then((res) => res[0]); // Sederhanakan response
	}

	/**
	 * Hapus keahlian (Skill)
	 * DELETE /api/v1/resume/skills/:id
	 */
	public async deleteSkill(id: string): Promise<AppResponse> {
		return this.api.delete<unknown, AppResponse>(`/resume/skills/${id}`);
	}

	/**
	 * Upsert sertifikat
	 * PUT /api/v1/resume/certificates
	 */
	public async upsertCertificate(
		payload: UpsertCertificateForm
	): Promise<AppResponse> {
		return this.api.put<unknown, AppResponse, UpsertCertificateForm>(
			"/resume/certificates",
			payload
		);
	}

	/**
	 * Hapus sertifikat
	 * DELETE /api/v1/resume/certificates/:id
	 */
	public async deleteCertificate(id: string): Promise<AppResponse> {
		return this.api.delete<unknown, AppResponse>(`/resume/certificates/${id}`);
	}
}

export const resumeService = ResumeService.getInstance();
