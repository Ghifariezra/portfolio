import type {
	UpsertCategoryForm,
	UpsertTagForm,
} from "@/lib/schemas/taxonomy.schema";
import type { AppResponse } from "@/utils/middleware";
import { BaseService } from "./base.service";

export class TaxonomyService extends BaseService {
	private static instance: TaxonomyService;

	private constructor() {
		super();
	}

	public static getInstance(): TaxonomyService {
		if (!TaxonomyService.instance) {
			TaxonomyService.instance = new TaxonomyService();
		}
		return TaxonomyService.instance;
	}

	// --- CATEGORIES ---

	public async getCategories(): Promise<AppResponse> {
		return this.api.get<unknown, AppResponse>("/taxonomies/categories");
	}

	public async upsertCategory(
		payload: UpsertCategoryForm
	): Promise<AppResponse> {
		return this.api.put<unknown, AppResponse, UpsertCategoryForm>(
			"/taxonomies/categories",
			payload
		);
	}

	public async deleteCategory(id: string): Promise<AppResponse> {
		return this.api.delete<unknown, AppResponse>(
			`/taxonomies/categories/${id}`
		);
	}

	// --- TAGS ---

	public async getTags(): Promise<AppResponse> {
		return this.api.get<unknown, AppResponse>("/taxonomies/tags");
	}

	public async upsertTag(payload: UpsertTagForm): Promise<AppResponse> {
		return this.api.put<unknown, AppResponse, UpsertTagForm>(
			"/taxonomies/tags",
			payload
		);
	}

	public async deleteTag(id: string): Promise<AppResponse> {
		return this.api.delete<unknown, AppResponse>(`/taxonomies/tags/${id}`);
	}
}

export const taxonomyService = TaxonomyService.getInstance();
