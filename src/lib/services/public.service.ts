import type { AppResponse } from "@/utils/middleware";
import { BaseService } from "./base.service";
import type { BlogListItem } from "../schemas/blog.schema";
import type { ProjectListItem } from "../schemas/project.schema";

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
    featured_projects: ProjectListItem[];
    recent_blogs: BlogListItem[];
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
        return this.api.get<unknown, AppResponse<HomeContentResponse>>("/public/home");
    }

    // --- PROJECTS ---
    public async getProjects(): Promise<AppResponse<ProjectListItem[]>> {
        return this.api.get<unknown, AppResponse<ProjectListItem[]>>("/public/projects");
    }

    public async getProjectBySlug(slug: string): Promise<AppResponse<ProjectListItem>> {
        return this.api.get<unknown, AppResponse<ProjectListItem>>(`/public/projects/${slug}`);
    }

    // --- NOTES (BLOGS) ---
    public async getNotes(): Promise<AppResponse<BlogListItem[]>> {
        return this.api.get<unknown, AppResponse<BlogListItem[]>>("/public/notes");
    }

    public async getNoteBySlug(slug: string): Promise<AppResponse<BlogListItem>> {
        return this.api.get<unknown, AppResponse<BlogListItem>>(`/public/notes/${slug}`);
    }
}

export const publicService = PublicService.getInstance();