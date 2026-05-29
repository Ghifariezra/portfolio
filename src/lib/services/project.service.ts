import type {
	AssignCollaboratorsForm,
	AssignTagsForm,
	UpsertProjectForm,
} from "@/lib/schemas/project.schema";
import type { AppResponse } from "@/utils/middleware";
import { BaseService } from "./base.service";

export class ProjectService extends BaseService {
	private static instance: ProjectService;

	private constructor() {
		super();
	}

	public static getInstance(): ProjectService {
		if (!ProjectService.instance) {
			ProjectService.instance = new ProjectService();
		}
		return ProjectService.instance;
	}

	public async uploadProjectImage(file: File): Promise<AppResponse> {
		const formData = new FormData();
		formData.append("image", file);

		return this.api.post<unknown, AppResponse, FormData>(
			"/projects/upload-image",
			formData,
			{
				headers: {
					"Content-Type": "multipart/form-data",
				},
			}
		);
	}

	public async deleteProjectImage(url: string): Promise<AppResponse> {
		return this.api.post<unknown, AppResponse>(
			"/projects/remove-image",
			{ url }
		);
	}

	public async getProjects(): Promise<AppResponse> {
		return this.api.get<unknown, AppResponse>("/projects");
	}

	public async getProjectById(id: string): Promise<AppResponse> {
		return this.api.get<unknown, AppResponse>(`/projects/${id}`);
	}

	/**
	 * Upsert data project
	 * PUT /api/v1/projects
	 */
	public async upsertProject(payload: UpsertProjectForm): Promise<AppResponse> {
		return this.api.put<unknown, AppResponse, UpsertProjectForm>(
			"/projects",
			payload
		);
	}

	/**
	 * Menghapus project berdasarkan ID
	 * DELETE /api/v1/projects/:id
	 */
	public async deleteProject(id: string): Promise<AppResponse> {
		return this.api.delete<unknown, AppResponse>(`/projects/${id}`);
	}

	/**
	 * Menetapkan tag ke sebuah project
	 * POST /api/v1/projects/assign-tags
	 */
	public async assignTags(payload: AssignTagsForm): Promise<AppResponse> {
		return this.api.post<unknown, AppResponse, AssignTagsForm>(
			"/projects/assign-tags",
			payload
		);
	}

	/**
	 * Menetapkan collaborator ke sebuah project
	 * POST /api/v1/projects/assign-collaborators
	 */
	public async assignCollaborators(
		payload: AssignCollaboratorsForm
	): Promise<AppResponse> {
		return this.api.post<unknown, AppResponse, AssignCollaboratorsForm>(
			"/projects/assign-collaborators",
			payload
		);
	}
}

export const projectService = ProjectService.getInstance();
