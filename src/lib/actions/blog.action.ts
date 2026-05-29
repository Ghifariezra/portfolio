import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
    AssignBlogTagsForm,
    UpsertBlogForm,
} from "@/lib/schemas/blog.schema";
import { blogService } from "@/lib/services/blog.service";

export const blogKeys = {
    all: ["blogs"] as const,
    lists: () => [...blogKeys.all, "list"] as const,
    details: () => [...blogKeys.all, "detail"] as const,
    detail: (id: string) => [...blogKeys.details(), id] as const,
};

export const blogActions = {
    useGetBlogs() {
        return useQuery({
            queryKey: blogKeys.lists(),
            queryFn: () => blogService.getBlogs(),
        });
    },

    useGetBlogById(id: string) {
        return useQuery({
            queryKey: blogKeys.detail(id),
            queryFn: () => blogService.getBlogById(id),
            enabled: !!id,
        });
    },

    useUploadImage() {
        return useMutation({
            mutationFn: (file: File) => blogService.uploadBlogImage(file),
        });
    },

    useDeleteImage() {
        return useMutation({
            mutationFn: (url: string) => blogService.deleteBlogImage(url),
        });
    },

    useUpsertBlog() {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: (payload: UpsertBlogForm) => blogService.upsertBlog(payload),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
            },
        });
    },

    useDeleteBlog() {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: (id: string) => blogService.deleteBlog(id),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
            },
        });
    },

    useAssignTags() {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: (payload: AssignBlogTagsForm) =>
                blogService.assignTags(payload),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
            },
        });
    },
};