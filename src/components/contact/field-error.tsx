import { Warning } from "@phosphor-icons/react";

interface FieldErrorProps {
	message: string;
}

export function FieldError({ message }: FieldErrorProps) {
	return (
		<span className="flex items-center gap-1.5 font-sans text-[12px] text-destructive">
			<Warning size={12} />
			{message}
		</span>
	);
}
