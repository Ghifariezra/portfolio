import type { UpsertAppForm } from "@/lib/schemas/apps.schema";
import type { AssignTagsForm } from "@/lib/schemas/project.schema";
import type { AppResponse } from "@/utils/middleware";
import { BaseService } from "./base.service";

export class AppsService extends BaseService {
	private static instance: AppsService;

	private constructor() {
		super();
	}

	public static getInstance(): AppsService {
		if (!AppsService.instance) {
			AppsService.instance = new AppsService();
		}
		return AppsService.instance;
	}

	public async uploadAppImage(file: File): Promise<AppResponse> {
		const formData = new FormData();
		formData.append("image", file);

		return this.api.post<unknown, AppResponse, FormData>(
			"/apps/upload-image",
			formData,
			{
				headers: {
					"Content-Type": "multipart/form-data",
				},
			}
		);
	}

	public async deleteAppImage(url: string): Promise<AppResponse> {
		return this.api.post<unknown, AppResponse>("/apps/remove-image", {
			url,
		});
	}

	public async getApps(): Promise<AppResponse> {
		return this.api.get<unknown, AppResponse>("/apps");
	}

	public async getAppById(id: string): Promise<AppResponse> {
		return this.api.get<unknown, AppResponse>(`/apps/${id}`);
	}

	public async upsertApp(payload: UpsertAppForm): Promise<AppResponse> {
		return this.api.put<unknown, AppResponse, UpsertAppForm>("/apps", payload);
	}

	public async deleteApp(id: string): Promise<AppResponse> {
		return this.api.delete<unknown, AppResponse>(`/apps/${id}`);
	}

	public async assignTags(payload: AssignTagsForm): Promise<AppResponse> {
		return this.api.post<unknown, AppResponse, AssignTagsForm>(
			"/apps/assign-tags",
			payload
		);
	}
}

export const appsService = AppsService.getInstance();
