import { PaperPlaneTilt, Spinner } from "@phosphor-icons/react";
import { z } from "zod";
import { useContact } from "@/lib/hooks/use-contact";
import { cn } from "@/lib/utils";
import { FieldError } from "./field-error";
import { FieldLabel } from "./field-label";
import { SuccessMessage } from "./success-message";

function inputClass(hasError: boolean) {
	return cn(
		"w-full bg-background border rounded px-4 py-3",
		"font-sans text-sm text-foreground placeholder:text-muted-foreground/50",
		"focus:outline-none focus:ring-1 transition-colors duration-200",
		"disabled:opacity-50 disabled:cursor-not-allowed",
		hasError
			? "border-destructive focus:border-destructive focus:ring-destructive"
			: "border-border focus:border-primary focus:ring-primary"
	);
}

export function ContactForm() {
	const { form, submitted, loading, error } = useContact();

	if (submitted) {
		return <SuccessMessage />;
	}

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
			noValidate
			className="flex flex-col gap-5"
		>
			{error && (
				<div className="p-3 mb-2 rounded bg-destructive/10 border border-destructive/20">
					<FieldError
						message={error.error || "Failed to send message. Please try again."}
					/>
				</div>
			)}

			{/* Name */}
			<form.Field
				name="name"
				validators={{
					onBlur: z.string().min(2, "Name must be at least 2 characters"),
				}}
			>
				{(field) => (
					<div className="flex flex-col gap-1.5">
						<FieldLabel htmlFor="name">Name</FieldLabel>
						<input
							id="name"
							type="text"
							placeholder="Jane Doe"
							value={field.state.value}
							onBlur={field.handleBlur}
							onChange={(e) => field.handleChange(e.target.value)}
							className={inputClass(field.state.meta.errors.length > 0)}
							disabled={loading}
						/>
						{field.state.meta.isTouched &&
							field.state.meta.errors.length > 0 && (
								<FieldError
									message={String(field.state.meta.errors[0]?.message)}
								/>
							)}
					</div>
				)}
			</form.Field>

			{/* Email */}
			<form.Field
				name="email"
				validators={{
					onBlur: z.string().email("Invalid email address"),
				}}
			>
				{(field) => (
					<div className="flex flex-col gap-1.5">
						<FieldLabel htmlFor="email">Email</FieldLabel>
						<input
							id="email"
							type="email"
							placeholder="jane@example.com"
							value={field.state.value}
							onBlur={field.handleBlur}
							onChange={(e) => field.handleChange(e.target.value)}
							className={inputClass(field.state.meta.errors.length > 0)}
							disabled={loading}
						/>
						{field.state.meta.isTouched &&
							field.state.meta.errors.length > 0 && (
								<FieldError
									message={String(field.state.meta.errors[0]?.message)}
								/>
							)}
					</div>
				)}
			</form.Field>

			{/* Phone (optional) */}
			<form.Field name="phone">
				{(field) => (
					<div className="flex flex-col gap-1.5">
						<FieldLabel htmlFor="phone" optional>
							Phone Number
						</FieldLabel>
						<input
							id="phone"
							type="tel"
							placeholder="+62 812-3456-7890"
							value={field.state.value}
							onChange={(e) => field.handleChange(e.target.value)}
							className={inputClass(false)}
							disabled={loading}
						/>
					</div>
				)}
			</form.Field>

			{/* Message */}
			<form.Field
				name="message"
				validators={{
					onBlur: z.string().min(10, "Message must be at least 10 characters"),
				}}
			>
				{(field) => (
					<div className="flex flex-col gap-1.5">
						<FieldLabel htmlFor="message">Message</FieldLabel>
						<textarea
							id="message"
							rows={5}
							placeholder="Detail your project requirements or inquiry here..."
							value={field.state.value}
							onBlur={field.handleBlur}
							onChange={(e) => field.handleChange(e.target.value)}
							className={`${inputClass(field.state.meta.errors.length > 0)} resize-y`}
							disabled={loading}
						/>
						{field.state.meta.isTouched &&
							field.state.meta.errors.length > 0 && (
								<FieldError
									message={String(field.state.meta.errors[0]?.message)}
								/>
							)}
					</div>
				)}
			</form.Field>

			{/* Footer */}
			<div className="pt-4 border-t border-border flex items-center justify-between gap-4 mt-1">
				<p className="font-mono text-[11px] text-muted-foreground hidden md:block">
					<span className="text-primary">{">"}</span> Awaiting transmission...
				</p>
				<button
					type="submit"
					disabled={loading}
					className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-mono text-[11px] font-semibold tracking-widest uppercase py-3 px-8 rounded hover:opacity-90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
				>
					{loading ? (
						<>
							<Spinner size={14} className="animate-spin" />
							<span>Processing</span>
						</>
					) : (
						<>
							<span>Send Message</span>
							<PaperPlaneTilt size={14} />
						</>
					)}
				</button>
			</div>
		</form>
	);
}
