import { ArrowUUpLeft, Spinner } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { memo, useCallback, useEffect, useState } from "react";
import { taxonomyActions } from "@/lib/actions/taxonomy.action";
import { useAppForm } from "@/lib/hooks/use-apps";
import type { UpsertAppForm } from "@/lib/schemas/apps.schema";
import type { UpsertTagForm } from "@/lib/schemas/taxonomy.schema";
import { useAuthStore } from "@/lib/stores/auth.store";

interface AppsFormProps {
	initialData?: Partial<UpsertAppForm>;
	isEditMode?: boolean;
}

const statusDot: Record<string, string> = {
	coming_soon: "bg-yellow-500",
	published: "bg-green-500",
};

export const AppsForm = memo(function AppsForm({
	initialData,
	isEditMode = false,
}: AppsFormProps) {
	const profile = useAuthStore((state) => state.profile);

	const defaultValues = isEditMode
		? initialData
		: { user_id: profile?.id, ...initialData };

	// Gunakan hook yang sudah kamu buat
	const { form, loading } = useAppForm(defaultValues);

	const { data: tagRes, isLoading: tagLoading } = taxonomyActions.useGetTags();
	const tags = (tagRes?.data as UpsertTagForm[]) || [];

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
			form.setFieldValue("image" as never, null as never);
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
			form.setFieldValue("image" as never, null as never);
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
						to="/dashboard/apps"
						className="group inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary font-mono text-[10px] font-bold uppercase tracking-widest transition-colors w-fit -ml-1"
					>
						<span className="flex items-center justify-center p-1 rounded group-hover:bg-primary/10 transition-all">
							<ArrowUUpLeft
								size={14}
								weight="bold"
								className="group-hover:-translate-x-px transition-transform"
							/>
						</span>
						Back to Apps
					</Link>
					<div>
						<h2 className="text-2xl font-heading font-bold text-foreground mb-1 tracking-tight">
							{isEditMode ? "Edit App" : "Register New App"}
						</h2>
						<p className="text-muted-foreground font-mono text-[10px] sm:text-[11px] uppercase tracking-widest">
							{isEditMode
								? "Modify your app's metadata and store configuration."
								: "Add a new desktop application or tool to your portfolio."}
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
										App Icon / Cover
									</label>
									{previewUrl ? (
										<div className="relative w-full h-48 md:h-64 rounded-md border-2 border-border overflow-hidden shadow-brutal-sm dark:shadow-none group bg-muted flex items-center justify-center">
											<img
												src={previewUrl}
												alt="App Preview"
												className="w-auto h-full object-cover"
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
													Click or Drag Icon Here
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

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{/* Title */}
							<form.Field name="title">
								{(field) => (
									<div>
										<label
											className="block font-mono text-[11px] font-bold uppercase tracking-widest text-foreground mb-2"
											htmlFor={field.name}
										>
											App Name
										</label>
										<input
											id={field.name}
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="e.g., DanaKu"
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

							{/* Microsoft Store ID */}
							<form.Field name="microsoft_store_id">
								{(field) => (
									<div>
										<label
											className="block font-mono text-[11px] font-bold uppercase tracking-widest text-foreground mb-2"
											htmlFor={field.name}
										>
											Store ID{" "}
											<span className="font-normal text-muted-foreground">
												(Optional)
											</span>
										</label>
										<input
											id={field.name}
											value={field.state.value || ""}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="e.g., 9P0VXDK9ZVP0"
											className="w-full bg-background border-2 dark:border border-border rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder:text-muted-foreground text-sm font-mono shadow-brutal-sm dark:shadow-none transition-all uppercase"
										/>
									</div>
								)}
							</form.Field>
						</div>

						{/* Store URL */}
						<form.Field name="store_url">
							{(field) => (
								<div>
									<label
										className="block font-mono text-[11px] font-bold uppercase tracking-widest text-foreground mb-2"
										htmlFor={field.name}
									>
										Store / Download URL{" "}
										<span className="font-normal text-muted-foreground">
											(Optional)
										</span>
									</label>
									<input
										id={field.name}
										type="url"
										value={field.state.value || ""}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="https://apps.microsoft.com/..."
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
										Short Description
									</label>
									<textarea
										id={field.name}
										value={field.state.value || ""}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="Comprehensive financial management app..."
										rows={4}
										className="w-full bg-background border-2 dark:border border-border rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder:text-muted-foreground text-sm font-sans resize-y shadow-brutal-sm dark:shadow-none transition-all"
									/>
								</div>
							)}
						</form.Field>

						{/* Tags Multi-Select */}
						<form.Field name="tag_ids">
							{(field) => (
								<div className="p-6 bg-card border-2 border-border rounded-md shadow-brutal-sm dark:shadow-none">
									<div className="font-mono text-[11px] font-bold uppercase tracking-widest text-foreground mb-4">
										App Tags
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
								{isEditMode ? "Save Changes" : "Save App"}
							</button>
						</div>
					</div>

					{/* ── RIGHT COLUMN: Sidebar ───────────────────────── */}
					<div className="w-full lg:w-72 shrink-0 space-y-6">
						<div className="p-4 border-2 dark:border border-border rounded-md bg-card shadow-brutal-sm dark:shadow-none">
							<p className="font-mono text-[11px] font-bold uppercase tracking-widest text-foreground mb-4">
								App Status
							</p>

							<form.Field name="status">
								{(field) => (
									<div className="relative">
										<select
											id={field.name}
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
											className="w-full bg-background border-2 dark:border border-border rounded-md py-2 pl-7 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary shadow-brutal-sm dark:shadow-none cursor-pointer appearance-none"
										>
											<option value="coming_soon">Coming Soon</option>
											<option value="published">Published</option>
										</select>
										<span
											className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full pointer-events-none ${
												statusDot[field.state.value] ?? "bg-muted-foreground"
											}`}
										/>
									</div>
								)}
							</form.Field>
							<p className="font-mono text-[10px] text-muted-foreground mt-3 leading-relaxed">
								Jika diatur ke <b>Published</b> dan <b>Store ID</b> terisi,
								sistem akan otomatis menarik data dari Microsoft Store
								Analytics.
							</p>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
});
