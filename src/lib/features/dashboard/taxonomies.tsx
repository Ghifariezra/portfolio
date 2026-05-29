import { FolderOpen, PlusCircle, Spinner, Tag, X } from "@phosphor-icons/react";
import { memo } from "react";
import { taxonomyActions } from "@/lib/actions/taxonomy.action";
import {
	useCategoryDeletions,
	useCategoryForm,
	useTagDeletions,
	useTagForm,
} from "@/lib/hooks/use-taxonomy";
import type {
	UpsertCategoryForm,
	UpsertTagForm,
} from "@/lib/schemas/taxonomy.schema";

export const RouteComponent = memo(function RouteComponent() {
	// Queries (Akan me-return empty array sementara BE belum siap)
	const { data: catRes, isLoading: catLoading } =
		taxonomyActions.useGetCategories();
	const { data: tagRes, isLoading: tagLoading } = taxonomyActions.useGetTags();

	// Data extraction (asumsikan response.data berisi array object)
	const categories = (catRes?.data as UpsertCategoryForm[]) || [];
	const tags = (tagRes?.data as UpsertTagForm[]) || [];

	// Hooks
	const { form: categoryForm, loading: categorySaving } = useCategoryForm();
	const { deleteCategory, isDeleting: categoryDeleting } =
		useCategoryDeletions();

	const { form: tagForm, loading: tagSaving } = useTagForm();
	const { deleteTag, isDeleting: tagDeleting } = useTagDeletions();

	return (
		<div className="flex flex-col h-full overflow-hidden bg-background">
			{/* Topbar / Header */}
			<header className="border-b-2 dark:border-b border-border py-6 px-8 shrink-0 bg-card dark:bg-background">
				<h2 className="text-3xl font-heading font-bold text-foreground mb-2">
					Taxonomies
				</h2>
				<p className="text-muted-foreground font-mono text-xs uppercase tracking-widest">
					Manage categories and tags for your projects and posts.
				</p>
			</header>

			{/* Content Scrollable Area */}
			<div className="flex-1 overflow-y-auto p-8">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl">
					{/* ============================== */}
					{/* CARD 1: CATEGORIES             */}
					{/* ============================== */}
					<section className="bg-card dark:bg-[#191c1e] border-2 dark:border border-border rounded-md p-6 shadow-brutal dark:shadow-none flex flex-col">
						<div className="flex items-center gap-3 mb-6">
							<div className="w-8 h-8 rounded bg-primary/20 text-primary border-2 dark:border border-border flex items-center justify-center shadow-brutal-sm dark:shadow-none">
								<FolderOpen size={16} weight="bold" />
							</div>
							<h3 className="font-heading text-xl font-bold text-foreground">
								Categories
							</h3>
						</div>

						{/* Form Add Category */}
						<form
							onSubmit={(e) => {
								e.preventDefault();
								e.stopPropagation();
								categoryForm.handleSubmit();
							}}
							className="flex flex-col sm:flex-row gap-3"
						>
							<categoryForm.Field name="name">
								{(field) => (
									<div className="flex-2">
										<input
											value={field.state.value}
											onChange={(e) => {
												field.handleChange(e.target.value);
												// Auto-fill slug
												categoryForm.setFieldValue(
													"slug",
													e.target.value
														.toLowerCase()
														.replace(/[^a-z0-9]+/g, "-")
														.replace(/(^-|-$)+/g, "")
												);
											}}
											placeholder="Category Name (e.g. Backend)"
											className="h-10 w-full rounded-md border-2 dark:border border-border bg-background px-3 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
										/>
									</div>
								)}
							</categoryForm.Field>

							<categoryForm.Field name="slug">
								{(field) => (
									<div className="flex-2">
										<input
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="slug-name"
											className="h-10 w-full rounded-md border-2 dark:border border-border bg-muted px-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
										/>
									</div>
								)}
							</categoryForm.Field>

							<button
								type="submit"
								disabled={categorySaving}
								className="h-10 px-4 rounded-md bg-primary text-primary-foreground border-2 dark:border border-border shadow-brutal-sm dark:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all font-mono text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shrink-0"
							>
								{categorySaving ? (
									<Spinner size={14} className="animate-spin" />
								) : (
									<PlusCircle size={14} weight="bold" />
								)}
								Add
							</button>
						</form>

						{/* List Categories */}
						<div className="mt-6 pt-6 border-t-2 dark:border-t border-border flex-1">
							<p className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">
								ACTIVE CATEGORIES
							</p>

							{catLoading ? (
								<div className="flex items-center gap-2 text-muted-foreground font-mono text-xs">
									<Spinner size={14} className="animate-spin" /> Loading...
								</div>
							) : categories.length > 0 ? (
								<div className="flex flex-wrap gap-2">
									{categories.map((cat) => (
										<div
											key={cat.id}
											className="inline-flex items-center gap-2 px-3 py-1.5 bg-background border-2 dark:border border-border rounded-md shadow-brutal-sm dark:shadow-none transition-all group hover:border-destructive dark:hover:border-destructive"
										>
											<span className="font-sans text-sm font-semibold">
												{cat.name}
											</span>
											<div className="w-px h-3 bg-border" />
											<button
												type="button"
												onClick={() => deleteCategory(cat.id as string)}
												disabled={categoryDeleting}
												className="text-muted-foreground hover:text-destructive disabled:opacity-50 cursor-pointer"
											>
												<X size={14} weight="bold" />
											</button>
										</div>
									))}
								</div>
							) : (
								<p className="font-mono text-xs text-muted-foreground border-2 border-dashed border-border rounded-md p-4 text-center">
									No categories found.
								</p>
							)}
						</div>
					</section>

					{/* ============================== */}
					{/* CARD 2: TAGS                   */}
					{/* ============================== */}
					<section className="bg-card dark:bg-[#191c1e] border-2 dark:border border-border rounded-md p-6 shadow-brutal dark:shadow-none flex flex-col">
						<div className="flex items-center gap-3 mb-6">
							<div className="w-8 h-8 rounded bg-accent/20 text-accent-foreground border-2 dark:border border-border flex items-center justify-center shadow-brutal-sm dark:shadow-none">
								<Tag size={16} weight="bold" />
							</div>
							<h3 className="font-heading text-xl font-bold text-foreground">
								Tags
							</h3>
						</div>

						{/* Form Add Tag */}
						<form
							onSubmit={(e) => {
								e.preventDefault();
								e.stopPropagation();
								tagForm.handleSubmit();
							}}
							className="flex flex-col sm:flex-row gap-3"
						>
							<tagForm.Field name="name">
								{(field) => (
									<div className="flex-2">
										<input
											value={field.state.value}
											onChange={(e) => {
												field.handleChange(e.target.value);
												// Auto-fill slug
												tagForm.setFieldValue(
													"slug",
													e.target.value
														.toLowerCase()
														.replace(/[^a-z0-9]+/g, "-")
														.replace(/(^-|-$)+/g, "")
												);
											}}
											placeholder="Tag Name (e.g. React)"
											className="h-10 w-full rounded-md border-2 dark:border border-border bg-background px-3 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
										/>
									</div>
								)}
							</tagForm.Field>

							<tagForm.Field name="slug">
								{(field) => (
									<div className="flex-2">
										<input
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="slug-name"
											className="h-10 w-full rounded-md border-2 dark:border border-border bg-muted px-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
										/>
									</div>
								)}
							</tagForm.Field>

							<button
								type="submit"
								disabled={tagSaving}
								className="h-10 px-4 rounded-md bg-accent text-accent-foreground border-2 dark:border border-border shadow-brutal-sm dark:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all font-mono text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shrink-0"
							>
								{tagSaving ? (
									<Spinner size={14} className="animate-spin" />
								) : (
									<PlusCircle size={14} weight="bold" />
								)}
								Add
							</button>
						</form>

						{/* List Tags */}
						<div className="mt-6 pt-6 border-t-2 dark:border-t border-border flex-1">
							<p className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">
								ACTIVE TAGS
							</p>

							{tagLoading ? (
								<div className="flex items-center gap-2 text-muted-foreground font-mono text-xs">
									<Spinner size={14} className="animate-spin" /> Loading...
								</div>
							) : tags.length > 0 ? (
								<div className="flex flex-wrap gap-2">
									{tags.map((tag) => (
										<div
											key={tag.id}
											className="inline-flex items-center gap-2 px-3 py-1.5 bg-background border-2 dark:border border-border rounded-md shadow-brutal-sm dark:shadow-none transition-all group hover:border-destructive dark:hover:border-destructive"
										>
											<span className="font-sans text-sm font-semibold">
												{tag.name}
											</span>
											<div className="w-px h-3 bg-border" />
											<button
												type="button"
												onClick={() => deleteTag(tag.id as string)}
												disabled={tagDeleting}
												className="text-muted-foreground hover:text-destructive disabled:opacity-50 cursor-pointer"
											>
												<X size={14} weight="bold" />
											</button>
										</div>
									))}
								</div>
							) : (
								<p className="font-mono text-xs text-muted-foreground border-2 border-dashed border-border rounded-md p-4 text-center">
									No tags found.
								</p>
							)}
						</div>
					</section>
				</div>
			</div>
		</div>
	);
});
