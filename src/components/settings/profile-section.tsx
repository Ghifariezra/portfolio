import {
	FilePdf,
	GithubLogo,
	Image,
	LinkedinLogo,
	User,
} from "@phosphor-icons/react";
import type { useProfile } from "@/lib/hooks/use-profile";

interface ProfileSectionProps {
	form: ReturnType<typeof useProfile>["form"];
}

export function ProfileSection({ form }: ProfileSectionProps) {
	return (
		<section className="bg-card dark:bg-[#191c1e] border-2 dark:border border-border rounded-md p-6 shadow-brutal dark:shadow-none">
			<div className="flex items-center gap-3 mb-6">
				<div className="w-8 h-8 rounded bg-primary text-primary-foreground border-2 dark:border border-border flex items-center justify-center shadow-brutal-sm dark:shadow-none">
					<User size={16} weight="bold" />
				</div>
				<h3 className="font-heading text-xl font-bold text-foreground">
					User Profile
				</h3>
			</div>

			<div className="space-y-6">
				{/* Row 1: username + email */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<form.Field name="username">
						{(field) => (
							<div className="flex flex-col gap-2">
								<label
									htmlFor={field.name}
									className="font-mono text-[11px] font-bold uppercase tracking-widest text-muted-foreground"
								>
									Username
								</label>
								<input
									id={field.name}
									name={field.name}
									type="text"
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="johndoe"
									className="h-10 w-full rounded-md border-2 dark:border border-border bg-background px-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
								/>
								{field.state.meta.errors.length > 0 && (
									<p className="font-mono text-[10px] text-destructive uppercase tracking-widest">
										{/* The ?. operator handles the case where the error object might be undefined */}
										{(field.state.meta.errors[0] as any)?.message}
									</p>
								)}
							</div>
						)}
					</form.Field>

					<form.Field name="email">
						{(field) => (
							<div className="flex flex-col gap-2">
								<label
									htmlFor={field.name}
									className="font-mono text-[11px] font-bold uppercase tracking-widest text-muted-foreground"
								>
									Email
								</label>
								<input
									id={field.name}
									name={field.name}
									type="text"
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="john@example.com"
									className="h-10 w-full rounded-md border-2 dark:border border-border bg-background px-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
								/>
								{field.state.meta.errors.length > 0 && (
									<p className="font-mono text-[10px] text-destructive uppercase tracking-widest">
										{/* The ?. operator handles the case where the error object might be undefined */}
										{(field.state.meta.errors[0] as any)?.message}
									</p>
								)}
							</div>
						)}
					</form.Field>
				</div>

				{/* Row 2: fullname + role (readonly) */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<form.Field name="fullname">
						{(field) => (
							<div className="flex flex-col gap-2">
								<label
									htmlFor={field.name}
									className="font-mono text-[11px] font-bold uppercase tracking-widest text-muted-foreground"
								>
									Full Name
								</label>
								<input
									id={field.name}
									name={field.name}
									type="text"
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="John Doe"
									className="h-10 w-full rounded-md border-2 dark:border border-border bg-background px-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
								/>
								{field.state.meta.errors.length > 0 && (
									<p className="font-mono text-[10px] text-destructive uppercase tracking-widest">
										{/* The ?. operator handles the case where the error object might be undefined */}
										{(field.state.meta.errors[0] as any)?.message}
									</p>
								)}
							</div>
						)}
					</form.Field>

					<form.Field name="role">
						{(field) => (
							<div className="flex flex-col gap-2">
								<label
									htmlFor={field.name}
									className="font-mono text-[11px] font-bold uppercase tracking-widest text-muted-foreground"
								>
									Role
								</label>
								<input
									id={field.name}
									name={field.name}
									type="text"
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="user"
									className="h-10 w-full rounded-md border-2 dark:border border-border bg-background px-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
								/>
								{field.state.meta.errors.length > 0 && (
									<p className="font-mono text-[10px] text-destructive uppercase tracking-widest">
										{/* The ?. operator handles the case where the error object might be undefined */}
										{(field.state.meta.errors[0] as any)?.message}
									</p>
								)}
							</div>
						)}
					</form.Field>
				</div>

				{/* About Me */}
				<form.Field name="about_me">
					{(field) => (
						<div className="flex flex-col gap-2">
							<label
								htmlFor={field.name}
								className="font-mono text-[11px] font-bold uppercase tracking-widest text-muted-foreground"
							>
								About Me
							</label>
							<textarea
								id={field.name}
								name={field.name}
								rows={4}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								placeholder="Tell us about your professional background..."
								className="w-full rounded-md border-2 dark:border border-border bg-background px-3 py-2.5 font-sans text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-y"
							/>
							{field.state.meta.errors.length > 0 && (
								<p className="font-mono text-[10px] text-destructive uppercase tracking-widest">
									{/* The ?. operator handles the case where the error object might be undefined */}
									{(field.state.meta.errors[0] as any)?.message}
								</p>
							)}
						</div>
					)}
				</form.Field>

				{/* Assets & Socials */}
				<div className="space-y-4">
					<p className="font-mono text-[11px] font-bold uppercase tracking-widest text-muted-foreground border-b-2 dark:border-b border-border pb-3">
						Assets & Socials
					</p>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<form.Field name="image">
							{(field) => (
								<div className="flex flex-col gap-2">
									<label
										htmlFor={field.name}
										className="font-mono text-[11px] font-bold uppercase tracking-widest text-muted-foreground"
									>
										Profile Image URL
									</label>
									<div className="relative">
										<Image
											size={16}
											weight="bold"
											className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
										/>
										<input
											id={field.name}
											name={field.name}
											type="text"
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="https://example.com/avatar.jpg"
											className="h-10 w-full rounded-md border-2 dark:border border-border bg-background pl-9 pr-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
										/>
									</div>
									{field.state.meta.errors.length > 0 && (
										<p className="font-mono text-[10px] text-destructive uppercase tracking-widest">
											{/* The ?. operator handles the case where the error object might be undefined */}
											{(field.state.meta.errors[0] as any)?.message}
										</p>
									)}
								</div>
							)}
						</form.Field>

						<form.Field name="cv_url">
							{(field) => (
								<div className="flex flex-col gap-2">
									<label
										htmlFor={field.name}
										className="font-mono text-[11px] font-bold uppercase tracking-widest text-muted-foreground"
									>
										CV URL
									</label>
									<div className="relative">
										<FilePdf
											size={16}
											weight="bold"
											className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
										/>
										<input
											id={field.name}
											name={field.name}
											type="text"
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="https://example.com/cv.pdf"
											className="h-10 w-full rounded-md border-2 dark:border border-border bg-background pl-9 pr-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
										/>
									</div>
									{field.state.meta.errors.length > 0 && (
										<p className="font-mono text-[10px] text-destructive uppercase tracking-widest">
											{/* The ?. operator handles the case where the error object might be undefined */}
											{(field.state.meta.errors[0] as any)?.message}
										</p>
									)}
								</div>
							)}
						</form.Field>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<form.Field name="linkedin">
							{(field) => (
								<div className="flex flex-col gap-2">
									<label
										htmlFor={field.name}
										className="font-mono text-[11px] font-bold uppercase tracking-widest text-muted-foreground"
									>
										LinkedIn
									</label>
									<div className="relative">
										<LinkedinLogo
											size={16}
											weight="bold"
											className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
										/>
										<input
											id={field.name}
											name={field.name}
											type="text"
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="https://linkedin.com/in/username"
											className="h-10 w-full rounded-md border-2 dark:border border-border bg-background pl-9 pr-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
										/>
									</div>
									{field.state.meta.errors.length > 0 && (
										<p className="font-mono text-[10px] text-destructive uppercase tracking-widest">
											{/* The ?. operator handles the case where the error object might be undefined */}
											{(field.state.meta.errors[0] as any)?.message}
										</p>
									)}
								</div>
							)}
						</form.Field>

						<form.Field name="github">
							{(field) => (
								<div className="flex flex-col gap-2">
									<label
										htmlFor={field.name}
										className="font-mono text-[11px] font-bold uppercase tracking-widest text-muted-foreground"
									>
										GitHub
									</label>
									<div className="relative">
										<GithubLogo
											size={16}
											weight="bold"
											className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
										/>
										<input
											id={field.name}
											name={field.name}
											type="text"
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="https://github.com/username"
											className="h-10 w-full rounded-md border-2 dark:border border-border bg-background pl-9 pr-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
										/>
									</div>
									{field.state.meta.errors.length > 0 && (
										<p className="font-mono text-[10px] text-destructive uppercase tracking-widest">
											{/* The ?. operator handles the case where the error object might be undefined */}
											{(field.state.meta.errors[0] as any)?.message}
										</p>
									)}
								</div>
							)}
						</form.Field>
					</div>
				</div>
			</div>
		</section>
	);
}
