import {
	Link as LinkIcon,
	PlusCircle,
	Seal,
	Spinner,
	X,
} from "@phosphor-icons/react";
import { useCertificateForm, useResumeDeletions } from "@/lib/hooks/use-resume";
import type { UpsertCertificateForm } from "@/lib/schemas/resume.schema";

export function CertificatesSection({
	userId,
	certificates,
}: {
	userId: string;
	certificates: UpsertCertificateForm[];
}) {
	const { form, loading } = useCertificateForm({ user_id: userId });
	const { deleteCertificate, isDeletingCertificate } = useResumeDeletions();

	return (
		<section className="bg-card dark:bg-[#191c1e] border-2 dark:border border-border rounded-md p-6 shadow-brutal dark:shadow-none">
			<div className="flex items-center gap-3 mb-6">
				<div className="w-8 h-8 rounded bg-[#ffb786]/20 text-[#ffb786] border-2 dark:border border-border flex items-center justify-center shadow-brutal-sm dark:shadow-none">
					<Seal size={16} weight="bold" />
				</div>
				<h3 className="font-heading text-xl font-bold text-foreground">
					Certificates
				</h3>
			</div>

			<div className="space-y-6">
				{/* FORM TAMBAH CERTIFICATE */}
				<form
					onSubmit={(e) => {
						e.preventDefault();
						form.handleSubmit();
					}}
					className="flex flex-col md:flex-row gap-3"
				>
					<form.Field name="name">
						{(field) => (
							<div className="flex-1">
								<input
									placeholder="Cert Name (e.g. AWS)"
									value={field.state.value}
									onChange={(e) => field.handleChange(e.target.value)}
									className="h-10 w-full rounded-md border-2 dark:border border-border bg-background px-3 font-mono text-sm focus:outline-none focus:border-primary transition-colors"
								/>
							</div>
						)}
					</form.Field>

					<form.Field name="type_certified">
						{(field) => (
							<div className="flex-1">
								<input
									placeholder="Issuer (e.g. Amazon)"
									value={field.state.value}
									onChange={(e) => field.handleChange(e.target.value)}
									className="h-10 w-full rounded-md border-2 dark:border border-border bg-background px-3 font-mono text-sm focus:outline-none focus:border-primary transition-colors"
								/>
							</div>
						)}
					</form.Field>

					{/* TAMBAHAN: Field Image URL */}
					<form.Field name="image">
						{(field) => (
							<div className="flex-1">
								<input
									placeholder="Image URL (Optional)"
									value={field.state.value || ""} // Gunakan fallback string kosong jika null
									onChange={(e) => field.handleChange(e.target.value)}
									className="h-10 w-full rounded-md border-2 dark:border border-border bg-background px-3 font-mono text-sm focus:outline-none focus:border-primary transition-colors"
								/>
							</div>
						)}
					</form.Field>

					<button
						type="submit"
						disabled={loading}
						className="h-10 px-6 rounded-md bg-primary text-primary-foreground border-2 dark:border border-border shadow-brutal-sm dark:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all font-mono text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
					>
						{loading ? (
							<>
								<Spinner size={14} className="animate-spin" /> Saving
							</>
						) : (
							<>
								<PlusCircle size={14} weight="bold" /> Add
							</>
						)}
					</button>
				</form>

				{/* LIST CERTIFICATES */}
				{certificates.length > 0 ? (
					<div className="rounded-md border-2 dark:border border-border overflow-hidden divide-y-2 dark:divide-y divide-border">
						{certificates.map((cert) => (
							<div
								key={cert.id ?? Math.random()}
								className="flex items-center justify-between px-4 py-3 bg-background hover:bg-muted/50 transition-colors"
							>
								<div className="flex items-center gap-4">
									<div>
										<p className="font-sans font-bold text-sm text-foreground flex items-center gap-2">
											{cert.name}
											{/* Indikator visual jika image URL tersedia */}
											{cert.image && (
												<a
													href={cert.image}
													target="_blank"
													rel="noreferrer"
													title="View Certificate"
													className="text-muted-foreground hover:text-primary transition-colors"
												>
													<LinkIcon size={14} weight="bold" />
												</a>
											)}
										</p>
										<p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mt-1">
											{cert.type_certified}
										</p>
									</div>
								</div>
								<button
									type="button"
									onClick={() => cert.id && deleteCertificate(cert.id)}
									disabled={isDeletingCertificate}
									className="text-muted-foreground hover:text-destructive transition-colors cursor-pointer p-2"
								>
									{isDeletingCertificate ? (
										<Spinner size={16} className="animate-spin" />
									) : (
										<X size={16} weight="bold" />
									)}
								</button>
							</div>
						))}
					</div>
				) : (
					<div className="text-center py-6 border-2 border-dashed border-border rounded-md">
						<p className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
							No certificates added yet.
						</p>
					</div>
				)}
			</div>
		</section>
	);
}
