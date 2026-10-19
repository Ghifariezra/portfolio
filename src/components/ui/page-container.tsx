import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Pembungkus <main> standar semua halaman. */
export function PageContainer({ children }: { children: ReactNode }) {
    return <main className="mx-auto w-full max-w-5xl px-6 py-14">{children}</main>;
}

interface PageHeaderProps {
    title: string;
    description: string;
    className?: string;
}

export function PageHeader({ title, description, className }: PageHeaderProps) {
    return (
        <header className={cn("mb-10 max-w-2xl", className)}>
            <h1 className="font-heading text-4xl font-bold md:text-5xl">{title}</h1>
            <p className="mt-3 leading-relaxed text-muted-foreground">{description}</p>
        </header>
    );
}
