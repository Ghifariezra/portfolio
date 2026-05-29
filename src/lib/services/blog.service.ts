import type {
    AssignBlogTagsForm,
    UpsertBlogForm,
} from "@/lib/schemas/blog.schema";
import type { AppResponse } from "@/utils/middleware";
import { BaseService } from "./base.service";

export class BlogService extends BaseService {
    private static instance: BlogService;

    private constructor() {
        super();
    }

    public static getInstance(): BlogService {
        if (!BlogService.instance) {
            BlogService.instance = new BlogService();
        }
        return BlogService.instance;
    }

    public async uploadBlogImage(file: File): Promise<AppResponse> {
        const formData = new FormData();
        formData.append("image", file);

        return this.api.post<unknown, AppResponse, FormData>(
            "/blogs/upload-image",
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );
    }

    public async deleteBlogImage(url: string): Promise<AppResponse> {
        return this.api.post<unknown, AppResponse>("/blogs/remove-image", { url });
    }

    public async getBlogs(): Promise<AppResponse> {
        return this.api.get<unknown, AppResponse>("/blogs");
    }

    public async getBlogById(id: string): Promise<AppResponse> {
        return this.api.get<unknown, AppResponse>(`/blogs/${id}`);
    }

    public async upsertBlog(payload: UpsertBlogForm): Promise<AppResponse> {
        return this.api.put<unknown, AppResponse, UpsertBlogForm>("/blogs", payload);
    }

    public async deleteBlog(id: string): Promise<AppResponse> {
        return this.api.delete<unknown, AppResponse>(`/blogs/${id}`);
    }

    public async assignTags(payload: AssignBlogTagsForm): Promise<AppResponse> {
        return this.api.post<unknown, AppResponse, AssignBlogTagsForm>(
            "/blogs/assign-tags",
            payload
        );
    }
}

export const blogService = BlogService.getInstance();