import { Spinner } from "@phosphor-icons/react";
import { useParams } from "@tanstack/react-router";
import { memo } from "react";
import { appActions } from "@/lib/actions/apps.action";
import type { AppListItem } from "@/lib/schemas/apps.schema";
import { useAuthStore } from "@/lib/stores/auth.store";
import { AppsForm } from "./apps-form";

export const RouteComponent = memo(function RouteComponent() {
	const profile = useAuthStore((state) => state.profile);
	const { appId } = useParams({
		from: "/dashboard/apps/edit/$appId",
	});

	const { data: res, isLoading, isError } = appActions.useGetAppById(appId);

	if (isLoading) {
		return (
			<div className="flex h-[60vh] items-center justify-center font-mono text-sm uppercase tracking-widest text-muted-foreground">
				<Spinner size={24} className="animate-spin mr-3" />
				Loading App Details...
			</div>
		);
	}

	if (isError || !res?.data) {
		return (
			<div className="flex h-[60vh] items-center justify-center font-mono text-sm text-destructive uppercase tracking-widest">
				Failed to load application details.
			</div>
		);
	}

	const app = res.data as AppListItem;

	return (
		<AppsForm
			isEditMode
			initialData={{
				id: app.id,
				user_id: profile?.id || "",
				title: app.name,
				description: app.description,
				image: app.image,
				status: app.status,
				microsoft_store_id: app.microsoft_store_id,
				store_url: app.url_store,
				tag_ids: app.tags.map((tag) => tag.id), // ← extract UUID saja
			}}
		/>
	);
});
