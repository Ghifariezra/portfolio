import { cn } from "@/lib/utils";

export interface TagItem {
    key: string;
    label: string;
}

type TagSize = "sm" | "md";

const BASE = "border border-border bg-muted px-2 py-0.5 font-mono";
const SIZE: Record<TagSize, string> = { sm: "text-[11px]", md: "text-xs" };

/** Satu tag inline (untuk dicampur dengan badge lain dalam satu baris). */
export function Tag({ label, size = "md" }: { label: string; size?: TagSize }) {
    return <span className={cn(BASE, SIZE[size])}>{label}</span>;
}

interface TagListProps {
    tags: readonly TagItem[];
    size?: TagSize;
    /** Batas tag yang ditampilkan; sisanya diringkas jadi "+n". */
    max?: number;
    className?: string;
}

export function TagList({ tags, size = "md", max, className }: TagListProps) {
    const visible = max === undefined ? tags : tags.slice(0, max);
    const hidden = tags.length - visible.length;

    return (
        <ul className={cn("flex flex-wrap gap-1.5", className)}>
            {visible.map((tag) => (
                <li key={tag.key} className={cn(BASE, SIZE[size])}>
                    {tag.label}
                </li>
            ))}
            {hidden > 0 && <li className="px-1 py-0.5 font-mono text-[11px] text-muted-foreground">+{hidden}</li>}
        </ul>
    );
}
