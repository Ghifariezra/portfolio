import type {
	UpsertCollaboratorForm,
	UpsertCollaboratorLinkForm,
} from "@/lib/schemas/collaborator.schema";
import type { AppResponse } from "@/utils/middleware";
import { BaseService } from "./base.service";

export class CollaboratorService extends BaseService {
	private static instance: CollaboratorService;

	private constructor() {
		super();
	}

	public static getInstance(): CollaboratorService {
		if (!CollaboratorService.instance) {
			CollaboratorService.instance = new CollaboratorService();
		}
		return CollaboratorService.instance;
	}

	// --- Collaborators ---
	public async getCollaborators(): Promise<AppResponse> {
		return this.api.get<unknown, AppResponse>("/collaborators");
	}

	public async upsertCollaborator(
		payload: UpsertCollaboratorForm
	): Promise<AppResponse> {
		return this.api.put<unknown, AppResponse, UpsertCollaboratorForm>(
			"/collaborators",
			payload
		);
	}

	public async deleteCollaborator(id: string): Promise<AppResponse> {
		return this.api.delete<unknown, AppResponse>(`/collaborators/${id}`);
	}

	// --- Collaborator Links ---
	public async upsertCollaboratorLink(
		payload: UpsertCollaboratorLinkForm
	): Promise<AppResponse> {
		return this.api.put<unknown, AppResponse, UpsertCollaboratorLinkForm>(
			"/collaborators/links",
			payload
		);
	}

	public async deleteCollaboratorLink(id: string): Promise<AppResponse> {
		return this.api.delete<unknown, AppResponse>(`/collaborators/links/${id}`);
	}
}

export const collaboratorService = CollaboratorService.getInstance();
