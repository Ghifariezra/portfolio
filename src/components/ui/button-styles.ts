import { cn } from "@/lib/utils";

type BrutalButtonVariant = "primary" | "card";

/**
 * Class tombol neo-brutalist. Berupa fungsi class (bukan komponen) supaya bisa dipakai di
 * <a>, <button>, maupun <Link> dari router tanpa wrapper tambahan.
 */
export const brutalButtonClass = (variant: BrutalButtonVariant = "primary", className?: string) =>
    cn(
        "border-2 border-border px-4 py-2 font-mono text-xs font-bold shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none",
        variant === "primary" ? "bg-primary text-primary-foreground" : "bg-card",
        className,
    );
