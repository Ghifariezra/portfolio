import {
	ArrowUUpLeft,
	CalendarBlank,
	Clock,
	Spinner,
} from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { memo, useCallback, useEffect, useState } from "react";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { collaboratorActions } from "@/lib/actions/collaborator.action";
import { taxonomyActions } from "@/lib/actions/taxonomy.action";
import { useProjectForm } from "@/lib/hooks/use-project";
import type { UpsertCollaboratorForm } from "@/lib/schemas/collaborator.schema";
import type { UpsertProjectForm } from "@/lib/schemas/project.schema";
import type { UpsertScheduleForm } from "@/lib/schemas/schedule.schema";
import type {
	UpsertCategoryForm,
	UpsertTagForm,
} from "@/lib/schemas/taxonomy.schema";
import { useAuthStore } from "@/lib/stores/auth.store";

interface ProjectFormProps {
	initialData?: Partial<UpsertProjectForm>;
	initialSchedule?: Partial<UpsertScheduleForm>;
	isEditMode?: boolean;
}

const statusDot: Record<string, string> = {
	draft: "bg-muted-foreground",
	scheduled: "bg-yellow-500",
	published: "bg-green-500",
	archived: "bg-red-400",
};

export const ProjectForm = memo(function ProjectForm({
	initialData,
	initialSchedule,
	isEditMode = false,
}: ProjectFormProps) {
	const profile = useAuthStore((state) => state.profile);

	const defaultValues = isEditMode
		? initialData
		: { user_id: profile?.id, ...initialData };
	const { form, loading } = useProjectForm(defaultValues, initialSchedule);

	const { data: catRes, isLoading: catLoading } =
		taxonomyActions.useGetCategories();
	const categories = (catRes?.data as UpsertCategoryForm[]) || [];

	const { data: tagRes, isLoading: tagLoading } = taxonomyActions.useGetTags();
	const tags = (tagRes?.data as UpsertTagForm[]) || [];

	const { data: colRes, isLoading: colLoading } =
		collaboratorActions.useGetCollaborators();
	const collaborators = (colRes?.data as UpsertCollaboratorForm[]) || [];

	const [, setPendingFile] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(
		initialData?.image || null
	);

	const handleImageSelect = useCallback(
		(
			file: File,
			setFile: (v: File | null) => void,
			setPreview: (v: string | null) => void
		) => {
			const url = URL.createObjectURL(file);
			setFile(file);
			setPreview(url);
			form.setFieldValue("_pendingImageFile" as never, file as never);
			form.setFieldValue("image", null);
		},
		[form]
	);

	const handleRemoveImage = useCallback(
		(
			setFile: (v: File | null) => void,
			setPreview: (v: string | null) => void
		) => {
			setFile(null);
			setPreview(null);
			form.setFieldValue("_pendingImageFile" as never, null as never);
			form.setFieldValue("image", null);
		},
		[form]
	);

	useEffect(() => {
		return () => {
			if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
		};
	}, [previewUrl]);

	return (
		<div className="flex flex-col h-full overflow-hidden bg-background">
			<header className="border-b-2 dark:border-b border-border py-5 px-4 md:px-8 shrink-0 bg-card dark:bg-background">
				<div className="flex flex-col gap-3 max-w-7xl mx-auto w-full">
					<Link
						to="/dashboard/projects"
						className="group inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary font-mono text-[10px] font-bold uppercase tracking-widest transition-colors w-fit -ml-1"
					>
						<span className="flex items-center justify-center p-1 rounded group-hover:bg-primary/10 transition-all">
							<ArrowUUpLeft
								size={14}
								weight="bold"
								className="group-hover:-translate-x-px transition-transform"
							/>
						</span>
						Back to Projects
					</Link>
					<div>
						<h2 className="text-2xl font-heading font-bold text-foreground mb-1 tracking-tight">
							{isEditMode ? "Edit Project" : "Create New Project"}
						</h2>
						<p className="text-muted-foreground font-mono text-[10px] sm:text-[11px] uppercase tracking-widest">
							{isEditMode
								? "Modify your existing project details and configuration."
								: "Add a new project to your engineering portfolio."}
						</p>
					</div>
				</div>
			</header>

			<div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8">
				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
					className="flex flex-col lg:flex-row gap-8 lg:gap-12 max-w-7xl mx-auto w-full"
				>
					{/* ── LEFT COLUMN ─────────────────────────────────── */}
					<div className="flex-1 min-w-0 space-y-6 lg:max-w-3xl">
						{/* Cover Image */}
						<form.Field name="image">
							{() => (
								<div>
									<label
										htmlFor="image"
										className="block font-mono text-[11px] font-bold uppercase tracking-widest text-foreground mb-2"
									>
										Cover Image
									</label>
									{previewUrl ? (
										<div className="relative w-full h-48 md:h-64 rounded-md border-2 border-border overflow-hidden shadow-brutal-sm dark:shadow-none group">
											<img
												src={previewUrl}
												alt="Cover Preview"
												className="w-full h-full object-cover"
											/>
											<button
												type="button"
												onClick={() =>
													handleRemoveImage(setPendingFile, setPreviewUrl)
												}
												className="absolute top-2 right-2 bg-destructive text-destructive-foreground px-3 py-1.5 rounded font-mono text-[10px] font-bold uppercase tracking-widest border-2 border-border opacity-0 group-hover:opacity-100 hover:-translate-x-px hover:-translate-y-px transition-all shadow-brutal-sm dark:shadow-none cursor-pointer"
											>
												Remove
											</button>
										</div>
									) : (
										<div className="relative w-full border-2 border-dashed border-border rounded-md p-8 text-center hover:bg-muted/50 transition-colors bg-card">
											<input
												type="file"
												accept="image/*"
												onChange={(e) => {
													const file = e.target.files?.[0];
													if (file)
														handleImageSelect(
															file,
															setPendingFile,
															setPreviewUrl
														);
												}}
												className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
											/>
											<div className="flex flex-col items-center justify-center gap-3">
												<span className="font-mono text-xs font-bold uppercase tracking-widest text-foreground">
													Click or Drag Image Here
												</span>
												<span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
													PNG, JPG, WEBP
												</span>
											</div>
										</div>
									)}
								</div>
							)}
						</form.Field>

						{/* Title */}
						<form.Field name="title">
							{(field) => (
								<div>
									<label
										className="block font-mono text-[11px] font-bold uppercase tracking-widest text-foreground mb-2"
										htmlFor={field.name}
									>
										Title
									</label>
									<input
										id={field.name}
										value={field.state.value}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="e.g., Nexus Gateway API"
										className="w-full bg-background border-2 dark:border border-border rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder:text-muted-foreground text-sm font-sans shadow-brutal-sm dark:shadow-none transition-all"
									/>
									{field.state.meta.errors?.length ? (
										<p className="text-destructive text-xs mt-1 font-mono">
											{field.state.meta.errors.join(", ")}
										</p>
									) : null}
								</div>
							)}
						</form.Field>

						{/* Slug */}
						<form.Field name="slug">
							{(field) => (
								<div>
									<label
										className="block font-mono text-[11px] font-bold uppercase tracking-widest text-foreground mb-2"
										htmlFor={field.name}
									>
										Slug
									</label>
									<input
										id={field.name}
										value={field.state.value}
										onChange={(e) =>
											field.handleChange(
												e.target.value.toLowerCase().replace(/\s+/g, "-")
											)
										}
										placeholder="e.g., nexus-gateway-api"
										className="w-full bg-background border-2 dark:border border-border rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder:text-muted-foreground text-sm font-mono shadow-brutal-sm dark:shadow-none transition-all"
									/>
								</div>
							)}
						</form.Field>

						{/* Description */}
						<form.Field name="description">
							{(field) => (
								<div>
									<label
										className="block font-mono text-[11px] font-bold uppercase tracking-widest text-foreground mb-2"
										htmlFor={field.name}
									>
										Description
									</label>
									<textarea
										id={field.name}
										value={field.state.value || ""}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="Short summary of the project..."
										rows={3}
										className="w-full bg-background border-2 dark:border border-border rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder:text-muted-foreground text-sm font-sans resize-y shadow-brutal-sm dark:shadow-none transition-all"
									/>
								</div>
							)}
						</form.Field>

						{/* Content */}
						<form.Field name="content">
							{(field) => (
								<div className="space-y-2">
									<label
										htmlFor={field.name}
										className="block font-mono text-[11px] font-bold uppercase tracking-widest text-foreground"
									>
										Content
									</label>
									<RichTextEditor
										initialContent={field.state.value || ""}
										onChange={(newContent) => field.handleChange(newContent)}
									/>
								</div>
							)}
						</form.Field>

						{/* Tags Multi-Select */}
						<form.Field name="tag_ids">
							{(field) => (
								<div className="mt-8 p-6 bg-card border-2 border-border rounded-md shadow-brutal-sm dark:shadow-none">
									<div className="font-mono text-[11px] font-bold uppercase tracking-widest text-foreground mb-4">
										Project Tags
									</div>
									{tagLoading ? (
										<Spinner
											size={16}
											className="animate-spin text-muted-foreground"
										/>
									) : tags.length > 0 ? (
										<div className="flex flex-wrap gap-2">
											{tags.map((tag) => {
												const isSelected = field.state.value.includes(
													tag.id as string
												);
												return (
													<button
														type="button"
														key={tag.id as string}
														onClick={() => {
															if (isSelected) {
																field.handleChange(
																	field.state.value.filter(
																		(id) => id !== (tag.id as string)
																	)
																);
															} else {
																field.handleChange([
																	...field.state.value,
																	tag.id as string,
																]);
															}
														}}
														className={`px-3 py-1.5 rounded border-2 font-mono text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer ${
															isSelected
																? "bg-primary text-primary-foreground border-border shadow-brutal-sm -translate-x-px -translate-y-px"
																: "bg-background text-muted-foreground border-transparent hover:border-border"
														}`}
													>
														{tag.name}
													</button>
												);
											})}
										</div>
									) : (
										<p className="text-muted-foreground text-xs font-mono">
											No tags available.
										</p>
									)}
								</div>
							)}
						</form.Field>

						{/* Form Actions */}
						<div className="flex justify-end space-x-4 pt-6">
							<button
								type="button"
								onClick={() => form.reset()}
								className="h-10 px-6 font-mono text-[11px] font-bold uppercase tracking-widest text-foreground bg-muted border-2 border-border dark:border-transparent rounded-md transition-colors hover:bg-secondary cursor-pointer"
							>
								Reset
							</button>
							<button
								type="submit"
								disabled={loading}
								className="h-10 px-6 font-mono text-[11px] font-bold uppercase tracking-widest bg-primary text-primary-foreground border-2 dark:border border-border rounded-md shadow-brutal-sm dark:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
							>
								{loading ? (
									<Spinner size={16} className="animate-spin" />
								) : null}
								{isEditMode ? "Save Changes" : "Save Project"}
							</button>
						</div>
					</div>

					{/* ── RIGHT COLUMN: Sidebar ───────────────────────── */}
					<div className="w-full lg:w-72 shrink-0 space-y-6">
						{/* Category */}
						<form.Field name="category_id">
							{(field) => (
								<div>
									<label
										htmlFor={field.name}
										className="block font-mono text-[11px] font-bold uppercase tracking-widest text-foreground mb-2"
									>
										Category
									</label>
									<select
										id={field.name}
										value={field.state.value || ""}
										onChange={(e) => field.handleChange(e.target.value)}
										disabled={catLoading}
										className="w-full bg-background border-2 dark:border border-border rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary shadow-brutal-sm dark:shadow-none cursor-pointer disabled:opacity-50"
									>
										<option value="" disabled>
											Select Category...
										</option>
										{categories.map((cat) => (
											<option key={cat.id as string} value={cat.id as string}>
												{cat.name}
											</option>
										))}
									</select>
								</div>
							)}
						</form.Field>

						{/* Development Status */}
						<form.Field name="status">
							{(field) => (
								<div>
									<label
										htmlFor={field.name}
										className="block font-mono text-[11px] font-bold uppercase tracking-widest text-foreground mb-2"
									>
										Dev Status
									</label>
									<select
										id={field.name}
										value={field.state.value}
										onChange={(e) => {
											field.handleChange(e.target.value);
											if (e.target.value !== "Collaboration") {
												form.setFieldValue("collaborator_ids", []);
											}
										}}
										className="w-full bg-background border-2 dark:border border-border rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary shadow-brutal-sm dark:shadow-none cursor-pointer"
									>
										<option value="Planning">Planning</option>
										<option value="In Progress">In Progress</option>
										<option value="Completed">Completed</option>
										<option value="Individual">Individual</option>
										<option value="Collaboration">Collaboration</option>
									</select>
								</div>
							)}
						</form.Field>

						{/* Collaborators — conditional */}
						<form.Subscribe selector={(state) => state.values.status}>
							{(status) =>
								status === "Collaboration" ? (
									<form.Field name="collaborator_ids">
										{(field) => (
											<div className="p-4 border-2 border-dashed border-border rounded-md bg-accent/5">
												<div className="font-mono text-[11px] font-bold uppercase tracking-widest text-accent-foreground mb-3">
													Select Team Members
												</div>
												{colLoading ? (
													<Spinner size={16} className="animate-spin" />
												) : (
													<div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-2">
														{collaborators.map((col) => (
															<label
																key={col.id as string}
																className="flex items-center gap-2 cursor-pointer group"
															>
																<input
																	type="checkbox"
																	checked={field.state.value.includes(
																		col.id as string
																	)}
																	onChange={(e) => {
																		if (e.target.checked) {
																			field.handleChange([
																				...field.state.value,
																				col.id as string,
																			]);
																		} else {
																			field.handleChange(
																				field.state.value.filter(
																					(id) => id !== (col.id as string)
																				)
																			);
																		}
																	}}
																	className="w-4 h-4 rounded border-2 border-border text-primary focus:ring-primary/50"
																/>
																<span className="font-sans text-sm text-foreground group-hover:text-primary transition-colors">
																	{col.name}{" "}
																	<span className="text-muted-foreground text-xs">
																		({col.role || "Member"})
																	</span>
																</span>
															</label>
														))}
													</div>
												)}
											</div>
										)}
									</form.Field>
								) : null
							}
						</form.Subscribe>

						{/* Progress */}
						<form.Field name="progress">
							{(field) => (
								<div>
									<label
										htmlFor={field.name}
										className="block font-mono text-[11px] font-bold uppercase tracking-widest text-foreground mb-2"
									>
										Progress
									</label>
									<div className="flex items-center space-x-4">
										<input
											id={field.name}
											type="range"
											min="0"
											max="100"
											value={field.state.value}
											onChange={(e) =>
												field.handleChange(Number(e.target.value))
											}
											className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
										/>
										<input
											type="number"
											min="0"
											max="100"
											value={field.state.value}
											onChange={(e) =>
												field.handleChange(Number(e.target.value))
											}
											className="w-16 bg-background border-2 dark:border border-border rounded-md py-1 px-2 text-center text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary shadow-brutal-sm dark:shadow-none"
										/>
									</div>
								</div>
							)}
						</form.Field>

						{/* Embed Type */}
						<form.Field name="embed_type">
							{(field) => (
								<div>
									<label
										htmlFor={field.name}
										className="block font-mono text-[11px] font-bold uppercase tracking-widest text-foreground mb-2"
									>
										Embed Type{" "}
										<span className="text-muted-foreground font-normal">
											(Optional)
										</span>
									</label>
									<select
										id={field.name}
										value={field.state.value || ""}
										onChange={(e) => field.handleChange(e.target.value)}
										className="w-full bg-background border-2 dark:border border-border rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary shadow-brutal-sm dark:shadow-none cursor-pointer"
									>
										<option value="">None</option>
										<option value="youtube">YouTube</option>
										<option value="github">GitHub</option>
										<option value="figma">Figma</option>
										<option value="codesandbox">CodeSandbox</option>
										<option value="google_docs">Google Docs</option>
										<option value="google_slides">Google Slides</option>
										<option value="pdf">PDF Document</option>
										<option value="other">Other</option>
									</select>
								</div>
							)}
						</form.Field>

						{/* Embed URL — conditional */}
						<form.Subscribe selector={(state) => state.values.embed_type}>
							{(embedType) =>
								embedType ? (
									<form.Field name="embed_url">
										{(field) => (
											<div>
												<label
													htmlFor={field.name}
													className="block font-mono text-[11px] font-bold uppercase tracking-widest text-foreground mb-2"
												>
													Embed URL{" "}
													<span className="text-muted-foreground font-normal">
														(Optional)
													</span>
												</label>
												<input
													id={field.name}
													type="url"
													value={field.state.value || ""}
													onChange={(e) => field.handleChange(e.target.value)}
													placeholder="https://..."
													className="w-full bg-background border-2 dark:border border-border rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder:text-muted-foreground text-sm font-mono shadow-brutal-sm dark:shadow-none transition-all"
												/>
											</div>
										)}
									</form.Field>
								) : null
							}
						</form.Subscribe>

						{/* ── PUBLICATION SECTION ───────────────────────── */}
						<div className="border-t-2 dark:border-t border-border pt-6 space-y-4">
							<p className="font-mono text-[11px] font-bold uppercase tracking-widest text-foreground flex items-center gap-1.5">
								<CalendarBlank size={13} weight="bold" />
								Publication
							</p>

							{/* Publish Status */}
							<form.Field name="_publish_status">
								{(field) => (
									<div>
										<label
											htmlFor={field.name}
											className="block font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2"
										>
											Status
										</label>
										<div className="relative">
											<select
												id={field.name}
												value={field.state.value}
												onChange={(e) =>
													field.handleChange(
														e.target.value as
															| "draft"
															| "scheduled"
															| "published"
															| "archived"
													)
												}
												className="w-full bg-background border-2 dark:border border-border rounded-md py-2 pl-7 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary shadow-brutal-sm dark:shadow-none cursor-pointer appearance-none"
											>
												<option value="draft">Draft</option>
												<option value="scheduled">Scheduled</option>
												<option value="published">Published</option>
												<option value="archived">Archived</option>
											</select>
											<span
												className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full pointer-events-none ${statusDot[field.state.value] ?? "bg-muted-foreground"}`}
											/>
										</div>
									</div>
								)}
							</form.Field>

							{/* Publish Date & Scheduled At — hanya saat "scheduled" */}
							<form.Subscribe
								selector={(state) => state.values._publish_status}
							>
								{(publishStatus) =>
									publishStatus === "scheduled" ? (
										<div className="space-y-4 p-4 border-2 border-dashed border-border rounded-md bg-accent/5">
											{/* Publish Date */}
											<form.Field name="_publish_date">
												{(field) => (
													<div>
														<label
															htmlFor={field.name}
															className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1.5"
														>
															<CalendarBlank size={11} weight="bold" />
															Publish Date
														</label>
														<input
															id={field.name}
															type="date"
															value={field.state.value || ""}
															onChange={(e) =>
																field.handleChange(e.target.value || null)
															}
															className="w-full bg-background border-2 dark:border border-border rounded-md py-2 px-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary shadow-brutal-sm dark:shadow-none cursor-pointer"
														/>
													</div>
												)}
											</form.Field>

											{/* Scheduled At */}
											<form.Field name="_scheduled_at">
												{(field) => (
													<div>
														<label
															htmlFor={field.name}
															className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1.5"
														>
															<Clock size={11} weight="bold" />
															Scheduled At
														</label>
														<input
															id={field.name}
															type="datetime-local"
															value={
																field.state.value
																	? field.state.value.slice(0, 16)
																	: ""
															}
															onChange={(e) =>
																field.handleChange(
																	e.target.value
																		? new Date(e.target.value).toISOString()
																		: null
																)
															}
															className="w-full bg-background border-2 dark:border border-border rounded-md py-2 px-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary shadow-brutal-sm dark:shadow-none cursor-pointer"
														/>
														<p className="font-mono text-[10px] text-muted-foreground mt-1.5">
															Auto-publish berjalan tiap 1 menit via cron.
														</p>
													</div>
												)}
											</form.Field>
										</div>
									) : null
								}
							</form.Subscribe>
						</div>
						{/* ── END PUBLICATION SECTION ──────────────────── */}
					</div>
				</form>
			</div>
		</div>
	);
});
