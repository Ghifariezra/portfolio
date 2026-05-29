import { FloppyDisk, Spinner } from "@phosphor-icons/react";
import { memo } from "react";
import { CertificatesSection } from "@/components/settings/certificates-section";
// Import komponen-komponen yang sudah kamu pecah
import { ProfileSection } from "@/components/settings/profile-section";
import { SkillsSection } from "@/components/settings/skills-section";
import { resumeActions } from "@/lib/actions/resume.action";
import { useProfile } from "@/lib/hooks/use-profile";

export const RouteComponent = memo(function RouteComponent() {
	const { form, handleSubmit, loading } = useProfile();
	const userId = form.state.values.id || "";
	const { data: resume } = resumeActions.useGetResume(userId);

	const skills = resume?.data?.skills || [];
	const certificates = resume?.data?.certificates || [];

	return (
		<div className="p-8 max-w-5xl mx-auto w-full pb-20">
			{/* Page Header */}
			<div className="mb-8">
				<h2 className="text-5xl font-bold font-heading tracking-tight text-foreground">
					Account Settings
				</h2>
				<p className="font-mono text-sm text-muted-foreground mt-2 uppercase tracking-widest">
					Manage your professional profile & portfolio configuration.
				</p>
			</div>

			<div className="space-y-8">
				{/* ================= USER PROFILE SECTION ================= */}
				{/* Kita batasi tag <form> hanya untuk Profile Section & Save Button */}
				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						handleSubmit(e);
					}}
				>
					<div className="space-y-4">
						{/* Render Komponen Profile dengan melempar 'form' sebagai props */}
						<ProfileSection form={form} />

						{/* SAVE BUTTON UNTUK PROFILE */}
						<div className="flex justify-end pt-2">
							<button
								type="submit"
								disabled={loading}
								className="h-10 px-6 rounded-md bg-primary text-primary-foreground border-2 dark:border border-border shadow-brutal-sm dark:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all font-mono text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-x-0 disabled:translate-y-0 disabled:shadow-brutal-sm cursor-pointer"
							>
								{loading ? (
									<>
										<Spinner size={16} weight="bold" className="animate-spin" />
										Saving...
									</>
								) : (
									<>
										<FloppyDisk size={16} weight="bold" /> Save Changes
									</>
								)}
							</button>
						</div>
					</div>
				</form>

				{/* Gunakan optional chaining (?.) untuk menghindari error jika data belum ada */}
				<SkillsSection userId={userId} skills={skills} />
				<CertificatesSection userId={userId} certificates={certificates} />
			</div>
		</div>
	);
});
