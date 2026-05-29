import {
	ArrowRight,
	Envelope,
	Eye,
	EyeClosed,
	LockKey,
	Spinner,
} from "@phosphor-icons/react";
import { useState } from "react";
import { z } from "zod";
import { FieldError } from "@/components/contact/field-error";
import { useAuth } from "@/lib/hooks/use-auth";
import { cn } from "@/lib/utils";

function inputClass(hasError: boolean) {
	return cn(
		"block w-full pl-10 pr-10 py-3 bg-muted border-2 rounded font-sans text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
		hasError
			? "border-destructive focus:border-destructive focus:ring-destructive"
			: "border-border focus:border-primary focus:ring-primary"
	);
}

export function RouteComponent() {
	const [showPassword, setShowPassword] = useState(false);
	const { form, loading, error } = useAuth();

	return (
		<main className="grow flex items-center justify-center p-6 z-10 relative min-h-[calc(100vh-4rem)] w-full">
			{/* ─── Latar Belakang Grid Teknis ─── */}
			<div
				className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-100"
				style={{
					backgroundSize: "24px 24px",
					// PERBAIKAN: Dibungkus dengan backtick (`)
					backgroundImage: `
                        linear-gradient(to right, color-mix(in srgb, var(--color-border) 20%, transparent) 1px, transparent 1px),
                        linear-gradient(to bottom, color-mix(in srgb, var(--color-border) 20%, transparent) 1px, transparent 1px)
                    `,
				}}
			/>

			{/* ─── Kartu Autentikasi ─── */}
			<div className="w-full max-w-md bg-card border-2 border-border rounded-lg p-8 md:p-10 shadow-brutal-lg dark:shadow-2xl relative overflow-hidden z-10">
				{/* Aksen Garis Atas */}
				<div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>

				<div className="mb-8">
					<h1 className="font-heading text-3xl font-bold text-foreground mb-2 tracking-tight">
						System Access
					</h1>
					<p className="font-sans text-base text-muted-foreground">
						Enter your credentials to manage the portfolio.
					</p>
				</div>

				<form
					onSubmit={(e) => {
						e.preventDefault();
						form.handleSubmit();
					}}
					noValidate
					className="space-y-6"
				>
					{error && (
						<div className="p-3 mb-2 rounded bg-destructive/10 border border-destructive/20">
							<FieldError
								message={
									(error as any)?.error || "Failed to authorize session."
								}
							/>
						</div>
					)}

					{/* Field Email */}
					<form.Field
						name="email"
						validators={{
							onBlur: z.string().email("Invalid email address"),
						}}
					>
						{(field) => (
							<div>
								<label
									htmlFor="email"
									className="block font-mono text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-2"
								>
									Email Address
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<Envelope className="text-muted-foreground w-5 h-5" />
									</div>
									<input
										id="email"
										type="email"
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="admin@precision.sys"
										disabled={loading}
										className={inputClass(field.state.meta.errors.length > 0)}
									/>
								</div>
								{field.state.meta.isTouched &&
									field.state.meta.errors.length > 0 && (
										<div className="mt-1.5">
											<FieldError
												message={String(field.state.meta.errors[0]?.message)}
											/>
										</div>
									)}
							</div>
						)}
					</form.Field>

					{/* Field Password */}
					<form.Field
						name="password"
						validators={{
							onBlur: z.string().min(1, "Password is required"),
						}}
					>
						{(field) => (
							<div>
								<div className="flex justify-between items-center mb-2">
									<label
										htmlFor="password"
										className="block font-mono text-[11px] font-semibold text-muted-foreground uppercase tracking-widest"
									>
										Password
									</label>
									<button
										type="button"
										className="font-mono text-[11px] font-semibold text-primary hover:text-primary/80 transition-colors uppercase tracking-widest focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
										disabled={loading}
									>
										Forgot Password?
									</button>
								</div>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<LockKey className="text-muted-foreground w-5 h-5" />
									</div>
									<input
										id="password"
										type={showPassword ? "text" : "password"}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="••••••••"
										disabled={loading}
										className={inputClass(field.state.meta.errors.length > 0)}
									/>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										disabled={loading}
										className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
										aria-label={
											showPassword ? "Hide password" : "Show password"
										}
									>
										{showPassword ? (
											<Eye className="w-5 h-5" />
										) : (
											<EyeClosed className="w-5 h-5" />
										)}
									</button>
								</div>
								{field.state.meta.isTouched &&
									field.state.meta.errors.length > 0 && (
										<div className="mt-1.5">
											<FieldError
												message={String(field.state.meta.errors[0]?.message)}
											/>
										</div>
									)}
							</div>
						)}
					</form.Field>

					{/* Tombol Submit */}
					<button
						type="submit"
						disabled={loading}
						className="w-full flex justify-center items-center py-3 px-4 border-2 border-transparent rounded text-primary-foreground bg-primary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-background font-mono text-[11px] font-semibold uppercase tracking-widest transition-colors mt-8 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
					>
						{loading ? (
							<>
								<Spinner className="w-4 h-4 mr-2 animate-spin" />
								Authenticating
							</>
						) : (
							<>
								Authorize Session
								<ArrowRight className="ml-2 w-4 h-4" />
							</>
						)}
					</button>
				</form>

				{/* Footer Keamanan */}
				<div className="mt-6 text-center">
					<p className="font-mono text-muted-foreground/70 text-[11px] tracking-wider">
						IP logged for security auditing.
					</p>
				</div>
			</div>
		</main>
	);
}
