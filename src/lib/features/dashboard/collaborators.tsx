import {
	Globe,
	IdentificationCard,
	Link as LinkIcon,
	PlusCircle,
	Spinner,
	Trash,
	Users,
	X,
} from "@phosphor-icons/react";
import { memo } from "react";
import { collaboratorActions } from "@/lib/actions/collaborator.action";
import {
	useCollaboratorDeletions,
	useCollaboratorForm,
	useCollaboratorLinkDeletions,
	useCollaboratorLinkForm,
} from "@/lib/hooks/use-collaborator";
import type {
	UpsertCollaboratorForm,
	UpsertCollaboratorLinkForm,
} from "@/lib/schemas/collaborator.schema";

// 1. BUAT TIPE DATA BARU UNTUK RESPONSE DARI BACKEND
type CollaboratorWithLinks = UpsertCollaboratorForm & {
	collaborator_links?: UpsertCollaboratorLinkForm[];
};

export const RouteComponent = memo(function RouteComponent() {
	// Queries
	const { data: collabRes, isLoading: collabLoading } =
		collaboratorActions.useGetCollaborators();

	// 2. GUNAKAN TIPE DATA BARU DI SINI
	const collaborators = (collabRes?.data as CollaboratorWithLinks[]) || [];

	// Hooks Collaborator
	const { form: collabForm, loading: collabSaving } = useCollaboratorForm();
	const { deleteCollaborator, isDeleting: collabDeleting } =
		useCollaboratorDeletions();

	// Hooks Collaborator Links
	const { form: linkForm, loading: linkSaving } = useCollaboratorLinkForm();
	const { deleteLink, isDeleting: linkDeleting } =
		useCollaboratorLinkDeletions();

	return (
		<div className="flex flex-col h-full overflow-hidden bg-background">
			{/* Topbar / Header */}
			<header className="border-b-2 dark:border-b border-border py-6 px-8 shrink-0 bg-card dark:bg-background">
				<h2 className="text-3xl font-heading font-bold text-foreground mb-2">
					Collaborators
				</h2>
				<p className="text-muted-foreground font-mono text-xs uppercase tracking-widest">
					Manage your team members and their social platform links.
				</p>
			</header>

			{/* Content Scrollable Area */}
			<div className="flex-1 overflow-y-auto p-8">
				<div className="grid grid-cols-1 xl:grid-cols-12 gap-8 max-w-7xl">
					{/* ============================== */}
					{/* LEFT COLUMN: FORMS             */}
					{/* ============================== */}
					<div className="xl:col-span-5 space-y-8">
						{/* CARD 1: ADD COLLABORATOR */}
						<section className="bg-card dark:bg-[#191c1e] border-2 dark:border border-border rounded-md p-6 shadow-brutal dark:shadow-none flex flex-col">
							<div className="flex items-center gap-3 mb-6">
								<div className="w-8 h-8 rounded bg-primary/20 text-primary border-2 dark:border border-border flex items-center justify-center shadow-brutal-sm dark:shadow-none">
									<Users size={16} weight="bold" />
								</div>
								<h3 className="font-heading text-xl font-bold text-foreground">
									Add Team Member
								</h3>
							</div>

							<form
								onSubmit={(e) => {
									e.preventDefault();
									e.stopPropagation();
									collabForm.handleSubmit();
								}}
								className="flex flex-col gap-4"
							>
								<collabForm.Field name="name">
									{(field) => (
										<div>
											<label
												htmlFor={field.name}
												className="block font-mono text-[11px] font-bold uppercase tracking-widest text-foreground mb-1.5"
											>
												Name
											</label>
											<input
												id={field.name}
												value={field.state.value}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="e.g. Dheka Airlangga"
												className="h-10 w-full rounded-md border-2 dark:border border-border bg-background px-3 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
											/>
											{field.state.meta.errors ? (
												<p className="text-destructive text-xs mt-1 font-mono">
													{field.state.meta.errors.join(", ")}
												</p>
											) : null}
										</div>
									)}
								</collabForm.Field>

								<collabForm.Field name="role">
									{(field) => (
										<div>
											<label
												htmlFor={field.name}
												className="block font-mono text-[11px] font-bold uppercase tracking-widest text-foreground mb-1.5"
											>
												Role{" "}
												<span className="text-muted-foreground font-normal">
													(Optional)
												</span>
											</label>
											<input
												id={field.name}
												value={field.state.value || ""}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="e.g. UI/UX Designer"
												className="h-10 w-full rounded-md border-2 dark:border border-border bg-background px-3 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
											/>
										</div>
									)}
								</collabForm.Field>

								<button
									type="submit"
									disabled={collabSaving}
									className="h-10 w-full mt-2 rounded-md bg-primary text-primary-foreground border-2 dark:border border-border shadow-brutal-sm dark:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all font-mono text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
								>
									{collabSaving ? (
										<Spinner size={14} className="animate-spin" />
									) : (
										<PlusCircle size={14} weight="bold" />
									)}
									Create Member
								</button>
							</form>
						</section>

						{/* CARD 2: ADD SOCIAL LINK */}
						<section className="bg-card dark:bg-[#191c1e] border-2 dark:border border-border rounded-md p-6 shadow-brutal dark:shadow-none flex flex-col">
							<div className="flex items-center gap-3 mb-6">
								<div className="w-8 h-8 rounded bg-accent/20 text-accent-foreground border-2 dark:border border-border flex items-center justify-center shadow-brutal-sm dark:shadow-none">
									<LinkIcon size={16} weight="bold" />
								</div>
								<h3 className="font-heading text-xl font-bold text-foreground">
									Add Social Link
								</h3>
							</div>

							<form
								onSubmit={(e) => {
									e.preventDefault();
									e.stopPropagation();
									linkForm.handleSubmit();
								}}
								className="flex flex-col gap-4"
							>
								<linkForm.Field name="collaborator_id">
									{(field) => (
										<div>
											<label
												htmlFor={field.name}
												className="block font-mono text-[11px] font-bold uppercase tracking-widest text-foreground mb-1.5"
											>
												Select Member
											</label>
											<select
												id={field.name}
												value={field.state.value}
												onChange={(e) => field.handleChange(e.target.value)}
												className="h-10 w-full rounded-md border-2 dark:border border-border bg-background px-3 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all cursor-pointer"
											>
												<option value="" disabled>
													Choose a collaborator...
												</option>
												{collaborators.map((c) => (
													<option key={c.id} value={c.id}>
														{c.name}
													</option>
												))}
											</select>
											{field.state.meta.errors ? (
												<p className="text-destructive text-xs mt-1 font-mono">
													{field.state.meta.errors.join(", ")}
												</p>
											) : null}
										</div>
									)}
								</linkForm.Field>

								<div className="flex flex-col sm:flex-row gap-4">
									<linkForm.Field name="platform">
										{(field) => (
											<div className="flex-1">
												<label
													htmlFor={field.name}
													className="block font-mono text-[11px] font-bold uppercase tracking-widest text-foreground mb-1.5"
												>
													Platform
												</label>
												<select
													id={field.name}
													value={field.state.value}
													onChange={(e) => field.handleChange(e.target.value)}
													className="h-10 w-full rounded-md border-2 dark:border border-border bg-background px-3 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all cursor-pointer"
												>
													<option value="" disabled>
														Select...
													</option>
													{[
														"Instagram",
														"Tiktok",
														"Facebook",
														"Linkedin",
														"Github",
														"Personal Site",
														"Other",
													].map((p) => (
														<option key={p} value={p}>
															{p}
														</option>
													))}
												</select>
												{field.state.meta.errors ? (
													<p className="text-destructive text-xs mt-1 font-mono">
														{field.state.meta.errors.join(", ")}
													</p>
												) : null}
											</div>
										)}
									</linkForm.Field>

									<linkForm.Field name="url">
										{(field) => (
											<div className="flex-2">
												<label
													htmlFor={field.name}
													className="block font-mono text-[11px] font-bold uppercase tracking-widest text-foreground mb-1.5"
												>
													URL
												</label>
												<input
													type="url"
													id={field.name}
													value={field.state.value}
													onChange={(e) => field.handleChange(e.target.value)}
													placeholder="https://..."
													className="h-10 w-full rounded-md border-2 dark:border border-border bg-background px-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
												/>
												{field.state.meta.errors ? (
													<p className="text-destructive text-xs mt-1 font-mono">
														{field.state.meta.errors.join(", ")}
													</p>
												) : null}
											</div>
										)}
									</linkForm.Field>
								</div>

								<button
									type="submit"
									disabled={linkSaving}
									className="h-10 w-full mt-2 rounded-md bg-accent text-accent-foreground border-2 dark:border border-border shadow-brutal-sm dark:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all font-mono text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
								>
									{linkSaving ? (
										<Spinner size={14} className="animate-spin" />
									) : (
										<LinkIcon size={14} weight="bold" />
									)}
									Attach Link
								</button>
							</form>
						</section>
					</div>

					{/* ============================== */}
					{/* RIGHT COLUMN: ACTIVE TEAM      */}
					{/* ============================== */}
					<div className="xl:col-span-7">
						<section className="bg-transparent flex flex-col h-full">
							<div className="flex items-center justify-between mb-6 px-2">
								<h3 className="font-mono text-sm font-bold uppercase tracking-widest text-muted-foreground">
									Active Team Members ({collaborators.length})
								</h3>
								{collabLoading && (
									<Spinner
										size={16}
										className="animate-spin text-muted-foreground"
									/>
								)}
							</div>

							{collaborators.length > 0 ? (
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									{collaborators.map((member) => {
										return (
											<div
												key={member.id}
												className="bg-card dark:bg-[#191c1e] border-2 dark:border border-border rounded-md p-5 shadow-brutal-sm dark:shadow-none flex flex-col relative group transition-all hover:border-primary"
											>
												{/* Delete Collaborator Button */}
												<button
													type="button"
													onClick={() =>
														deleteCollaborator(member.id as string)
													}
													disabled={collabDeleting}
													className="absolute top-4 right-4 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50 cursor-pointer"
													title="Delete Collaborator"
												>
													<Trash size={18} weight="bold" />
												</button>

												<div className="flex items-start gap-4 mb-4">
													<div className="w-10 h-10 rounded bg-secondary flex items-center justify-center border border-border shrink-0">
														<IdentificationCard
															size={20}
															weight="regular"
															className="text-secondary-foreground"
														/>
													</div>
													<div>
														<h4 className="font-heading text-lg font-bold text-foreground leading-tight">
															{member.name}
														</h4>
														<p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mt-1">
															{member.role || "No Role Assigned"}
														</p>
													</div>
												</div>

												{/* Render Social Links if available */}
												{member.collaborator_links &&
												member.collaborator_links.length > 0 ? (
													<div className="mt-auto pt-4 border-t border-border/50 flex flex-wrap gap-2">
														{/* 3. HILANGKAN TIPE ANY DI SINI KARENA SUDAH DI-INFER OLEH TYPESCRIPT */}
														{member.collaborator_links.map((link) => (
															<div
																key={link.id}
																className="inline-flex items-center gap-1.5 px-2 py-1 bg-muted rounded border border-border/50 text-[10px] font-mono group/link"
															>
																<Globe size={12} />
																<a
																	href={link.url}
																	target="_blank"
																	rel="noreferrer"
																	className="hover:underline text-foreground truncate max-w-20"
																>
																	{link.platform}
																</a>
																<button
																	onClick={() => deleteLink(link.id as string)}
																	disabled={linkDeleting}
																	className="ml-1 text-muted-foreground hover:text-destructive cursor-pointer"
																	type="button"
																>
																	<X size={10} weight="bold" />
																</button>
															</div>
														))}
													</div>
												) : (
													<div className="mt-auto pt-4 border-t border-border/50">
														<p className="text-xs text-muted-foreground italic">
															No social links attached.
														</p>
													</div>
												)}
											</div>
										);
									})}
								</div>
							) : (
								<div className="border-2 border-dashed border-border rounded-md p-12 flex flex-col items-center justify-center text-center bg-card/50">
									<Users
										size={32}
										className="text-muted-foreground mb-4 opacity-50"
									/>
									<p className="font-sans text-sm text-muted-foreground">
										No team members found.
										<br /> Use the form on the left to add your first
										collaborator.
									</p>
								</div>
							)}
						</section>
					</div>
				</div>
			</div>
		</div>
	);
});
