import type { AppResponse } from "@/utils/middleware";
import type { BlogListItem } from "../schemas/blog.schema";
import type { ProjectListItem } from "../schemas/project.schema";
import { BaseService } from "./base.service";

export interface CertificateItem {
	id: string;
	name: string;
	type_certified: string;
	image: string | null;
}

export interface HomeSkills {
	languages: string[];
	frameworks: string[];
	tools: string[];
}

export interface HomeHero {
	image: string | null;
	fullname: string | null;
	role: string | null;
	about_me: string | null;
	cv_url: string | null;
	github: string | null;
	linkedin: string | null;
}

export interface HomeContentResponse {
	hero: HomeHero | null;
	skills: HomeSkills;
	certificates: CertificateItem[];
	featured_projects: ProjectListItem[];
	recent_blogs: BlogListItem[];
}

export interface AppInstallItem {
	date: string;
	installCount: number;
}

// 1. UPDATE: Interface disesuaikan dengan hasil olahan BE (TopRegions)
export interface TopRegionItem {
	market: string;
	installCount: number;
	percentage: string;
}

export interface AnalyticsDataResponse {
	TotalInstalls: number;
	DataFreshnessTimestamp: string;
	Timeline: AppInstallItem[];
	TopRegions: TopRegionItem[];
}

// 2. TAMBAH: Interface untuk List App yang sudah include analytics
export interface TagItem {
	id: string;
	name: string;
}

export interface AppItem {
	id: string;
	name: string;
	description: string;
	image: string;
	status: string;
	microsoft_store_id: string | null;
	url_store: string | null;
	created_at: string;
	updated_at: string;
	tags: string[]; // Sesuaikan jika format tag string[] atau TagItem[]
	analytics: AnalyticsDataResponse | null;
}

export interface GithubContributionDay {
	date: string;
	contributionCount: number;
	color: string;
	weekday: number;
}

export interface GithubContributions {
	total: number;
	commits: number;
	pullRequests: number;
	issues: number;
	reviews: number;
	privateContributions: number;
	weeks: GithubContributionDay[][];
}

export interface GithubActivityItem {
	id: string;
	type: string;
	repo: string;
	createdAt: string;
	action: string | null;
	commits: number | null;
	ref: string | null;
	title: string | null;
	url: string | null;
}

export interface GithubProfile {
	login: string;
	avatar: string;
	url: string;
	followers: number;
	following: number;
	publicRepos: number;
}

export class PublicService extends BaseService {
	private static instance: PublicService;

	private constructor() {
		super();
	}

	public static getInstance(): PublicService {
		if (!PublicService.instance) {
			PublicService.instance = new PublicService();
		}
		return PublicService.instance;
	}

	// --- HOME ---
	public async getHomeContent(): Promise<AppResponse<HomeContentResponse>> {
		return this.api.get<unknown, AppResponse<HomeContentResponse>>(
			"/public/home"
		);
	}

	// --- PROJECTS ---
	public async getProjects(): Promise<AppResponse<ProjectListItem[]>> {
		return this.api.get<unknown, AppResponse<ProjectListItem[]>>(
			"/public/projects"
		);
	}

	public async getProjectBySlug(
		slug: string
	): Promise<AppResponse<ProjectListItem>> {
		return this.api.get<unknown, AppResponse<ProjectListItem>>(
			`/public/projects/${slug}`
		);
	}

	// --- NOTES (BLOGS) ---
	public async getNotes(): Promise<AppResponse<BlogListItem[]>> {
		return this.api.get<unknown, AppResponse<BlogListItem[]>>("/public/notes");
	}

	public async getNoteBySlug(slug: string): Promise<AppResponse<BlogListItem>> {
		return this.api.get<unknown, AppResponse<BlogListItem>>(
			`/public/notes/${slug}`
		);
	}

	// 3. UPDATE: Method getAnalytics dihapus dan diganti getApps
	// FE tinggal panggil ini tanpa perlu repot ngirim params apapun
	// --- APPS & ANALYTICS ---
	public async getApps(): Promise<AppResponse<AppItem[]>> {
		return this.api.get<unknown, AppResponse<AppItem[]>>("/public/apps");
	}

	// --- GITHUB ---
	public async getGithubContributions(): Promise<
		AppResponse<GithubContributions>
	> {
		return this.api.get<unknown, AppResponse<GithubContributions>>(
			"/public/github/contributions"
		);
	}

	public async getGithubActivity(
		limit = 10
	): Promise<AppResponse<GithubActivityItem[]>> {
		return this.api.get<unknown, AppResponse<GithubActivityItem[]>>(
			`/public/github/activity?limit=${limit}`
		);
	}

	public async getGithubProfile(): Promise<AppResponse<GithubProfile>> {
		return this.api.get<unknown, AppResponse<GithubProfile>>(
			"/public/github/profile"
		);
	}
}

export const publicService = PublicService.getInstance();
