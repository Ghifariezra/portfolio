import { Spinner } from "@phosphor-icons/react";
import { useParams } from "@tanstack/react-router";
import { memo } from "react";
import { projectActions } from "@/lib/actions/project.action";
import type { ProjectListItem } from "@/lib/schemas/project.schema";
import { useAuthStore } from "@/lib/stores/auth.store";
import { ProjectForm } from "./project-form";

export const RouteComponent = memo(function RouteComponent() {
	const profile = useAuthStore((state) => state.profile);
	const { projectId } = useParams({
		from: "/dashboard/projects/edit/$projectId",
	});

	const {
		data: res,
		isLoading,
		isError,
	} = projectActions.useGetProjectById(projectId);

	if (isLoading) {
		return (
			<div className="flex h-full items-center justify-center font-mono text-sm uppercase tracking-widest text-muted-foreground">
				<Spinner size={24} className="animate-spin mr-3" />
				Loading Project Data...
			</div>
		);
	}

	if (isError || !res?.data) {
		return (
			<div className="flex h-full items-center justify-center font-mono text-sm text-destructive">
				Failed to load project details.
			</div>
		);
	}

	const project = res.data as ProjectListItem;

	return (
		<ProjectForm
			isEditMode
			initialData={{
				id: project.id,
				user_id: profile?.id || "",
				title: project.title,
				slug: project.slug,
				category_id: project.category_id,
				description: project.description,
				content: project.content,
				image: project.image,
				status: project.development_status,
				progress: project.progress,
				embed_url: project.embed_url,
				embed_type: project.embed_type,
				tag_ids: project.tags.map((tag) => tag.id as string),
				collaborator_ids: project.collaborators.map((col) => col.id as string),
			}}
			// Pass data schedule dari vw_project_list
			initialSchedule={{
				publish_status: project.publish_status,
				publish_date: project.publish_date,
				// vw_project_list tidak expose scheduled_at — null fallback
				scheduled_at: null,
			}}
		/>
	);
});
