import type { ReactNode } from "react";

interface AdminPageHeaderProps {
    title: string;
    description?: string;
    /** Tombol aksi di kanan judul (mis. "New project"). */
    actions?: ReactNode;
}

export function AdminPageHeader({ title, description, actions }: AdminPageHeaderProps) {
    return (
        <header className="mb-8 flex flex-wrap items-start justify-between gap-4 border-b-2 border-border pb-6">
            <div className="max-w-xl">
                <h1 className="font-heading text-3xl font-bold md:text-4xl">{title}</h1>
                {description && <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>}
            </div>
            {actions}
        </header>
    );
}
