import { Spinner, Tag, X } from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge"; // 1. Import Badge
import { useResumeDeletions, useSkillForm } from "@/lib/hooks/use-resume";
import type { UpsertSkillForm } from "@/lib/schemas/resume.schema";

export function SkillsSection({
	userId,
	skills,
}: {
	userId: string;
	skills: UpsertSkillForm[];
}) {
	const { form, loading } = useSkillForm({ user_id: userId });
	const { deleteSkill, isDeletingSkill } = useResumeDeletions();

	// 1. Kelompokkan skill berdasarkan type_skill
	const groupedSkills = skills.reduce(
		(acc, skill) => {
			const type = skill.type_skill || "Other";
			if (!acc[type]) acc[type] = [];
			acc[type].push(skill);
			return acc;
		},
		{} as Record<string, UpsertSkillForm[]>
	);

	return (
		<section className="bg-card dark:bg-[#191c1e] border-2 dark:border border-border rounded-md p-6 shadow-brutal dark:shadow-none">
			<div className="flex items-center gap-3 mb-6">
				<div className="w-8 h-8 rounded bg-secondary text-secondary-foreground border-2 dark:border border-border flex items-center justify-center shadow-brutal-sm dark:shadow-none">
					<Tag size={16} weight="bold" />
				</div>
				<h3 className="font-heading text-xl font-bold text-foreground">
					Skills
				</h3>
			</div>

			<div className="space-y-4">
				<form
					onSubmit={(e) => {
						e.preventDefault();
						form.handleSubmit();
					}}
					className="flex gap-2"
				>
					{/* Input Nama Skill */}
					<form.Field name="name">
						{(field) => (
							<input
								placeholder="Skill name (e.g. React)"
								value={field.state.value}
								onChange={(e) => field.handleChange(e.target.value)}
								className="h-10 w-full rounded-md border-2 dark:border border-border bg-background px-3 font-mono text-sm"
							/>
						)}
					</form.Field>

					{/* Input Type Skill */}
					<form.Field name="type_skill">
						{(field) => (
							<select
								value={field.state.value}
								onChange={(e) => field.handleChange(e.target.value)}
								className="h-10 rounded-md border-2 dark:border border-border bg-background px-2 font-mono text-sm cursor-pointer"
							>
								<option value="" disabled>
									Type
								</option>
								<option value="Language">Language</option>
								<option value="Framework">Framework</option>
								<option value="Tool">Tool</option>
								<option value="Other">Other</option>
							</select>
						)}
					</form.Field>

					<button
						type="submit"
						disabled={loading}
						className="h-10 px-4 rounded bg-primary text-white font-bold cursor-pointer"
					>
						{loading ? <Spinner className="animate-spin" /> : "Add"}
					</button>
				</form>

				{/* List Skills dengan Grouping */}
				<div className="space-y-8">
					{" "}
					{/* Space antar kategori */}
					{Object.entries(groupedSkills).map(([type, skillList]) => (
						<div key={type} className="space-y-3">
							{/* Judul Kategori */}
							<h4 className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border pb-1">
								{type}
							</h4>

							{/* Badge Container */}
							<div className="flex flex-wrap gap-2">
								{skillList.map((skill) => {
									console.log(skill);
									return (
										<Badge
											key={skill.id}
											variant="secondary"
											className="flex items-center gap-1.5 py-1 px-3 text-xs font-mono font-bold"
										>
											{skill.name}
											<button
												type="button"
												onClick={() => skill.id && deleteSkill(skill.id)}
												disabled={isDeletingSkill}
												className="hover:text-destructive transition-colors ml-1"
											>
												<X size={12} weight="bold" />
											</button>
										</Badge>
									);
								})}
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
