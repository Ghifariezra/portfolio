import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FormFieldProps {
    label: string;
    /** id input di dalamnya, supaya klik label memfokuskan input. */
    htmlFor: string;
    hint?: string;
    error?: string;
    className?: string;
    children: ReactNode;
}

export function FormField({ label, htmlFor, hint, error, className, children }: FormFieldProps) {
    return (
        <div className={cn("flex flex-col gap-1.5", className)}>
            <label htmlFor={htmlFor} className="font-mono text-xs font-semibold">
                {label}
            </label>
            {children}
            {error ? (
                <p role="alert" className="text-xs text-destructive">
                    {error}
                </p>
            ) : (
                hint && <p className="text-xs text-muted-foreground">{hint}</p>
            )}
        </div>
    );
}
