import { CheckCircle } from "@phosphor-icons/react";

export function SuccessMessage() {
	return (
		<div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
			<div className="w-14 h-14 rounded-full border border-primary/30 bg-primary/10 flex items-center justify-center">
				<CheckCircle size={28} className="text-primary" weight="fill" />
			</div>
			<div>
				<h3 className="font-heading text-xl font-semibold text-foreground mb-2">
					Message Sent
				</h3>
				<p className="font-sans text-sm text-muted-foreground leading-relaxed max-w-xs">
					Thanks for reaching out. I'll review your message and get back to you
					within 24–48 hours.
				</p>
			</div>
			<div className="font-mono text-[11px] text-muted-foreground tracking-wider mt-2">
				<span className="text-primary">{">"}</span> Transmission received.
			</div>
		</div>
	);
}
