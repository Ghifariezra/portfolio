import { Spinner } from "@phosphor-icons/react";
import { useParams } from "@tanstack/react-router";
import { memo } from "react";
import { blogActions } from "@/lib/actions/blog.action";
import type { BlogListItem } from "@/lib/schemas/blog.schema";
import { useAuthStore } from "@/lib/stores/auth.store";
import { BlogForm } from "./blog-form";

export const RouteComponent = memo(function RouteComponent() {
	const profile = useAuthStore((state) => state.profile);
	const { postId } = useParams({ strict: false }) as { postId: string };
	const { data: res, isLoading } = blogActions.useGetBlogById(postId);
	const blog = res?.data as BlogListItem | undefined;

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-full text-muted-foreground gap-3 font-mono text-sm uppercase tracking-widest">
				<Spinner size={24} className="animate-spin" />
				Loading Post...
			</div>
		);
	}

	if (!blog) {
		return (
			<div className="flex items-center justify-center h-full">
				<p className="font-mono text-sm text-muted-foreground uppercase tracking-widest">
					Post not found.
				</p>
			</div>
		);
	}

	return (
		<BlogForm
			isEditMode
			initialData={{
				id: blog.id,
				user_id: profile?.id || "",
				title: blog.title,
				slug: blog.slug,
				description: blog.description,
				content: blog.content,
				image: blog.image,
				type_language: blog.type_language,
				progress: blog.progress,
				embed_url: blog.embed_url,
				embed_type: blog.embed_type,
				tag_ids: blog.tags.map((t) => t.id as string),
			}}
			// Pass data schedule dari vw_blog_list
			initialSchedule={{
				publish_status: blog.publish_status,
				publish_date: blog.publish_date,
				scheduled_at: blog.scheduled_at,
			}}
		/>
	);
});
