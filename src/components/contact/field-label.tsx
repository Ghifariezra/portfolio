interface FieldLabelProps {
	htmlFor: string;
	children: React.ReactNode;
	optional?: boolean;
}

export function FieldLabel({ htmlFor, children, optional }: FieldLabelProps) {
	return (
		<label
			htmlFor={htmlFor}
			className="flex items-center justify-between font-mono text-[11px] font-semibold tracking-[0.12em] uppercase text-foreground"
		>
			<span>{children}</span>
			{optional && (
				<span className="font-mono text-[10px] normal-case tracking-normal text-muted-foreground font-normal">
					(Optional)
				</span>
			)}
		</label>
	);
}
