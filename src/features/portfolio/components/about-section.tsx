import type { ReactNode } from "react";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";

interface AboutSectionProps {
    title: string;
    id?: string;
    isPending: boolean;
    isError: boolean;
    onRetry: () => void;
    /** Section disembunyikan kalau data sudah dimuat tapi kosong. */
    isEmpty: boolean;
    children: ReactNode;
}

/** Pembungkus section About: judul + state loading/error/kosong yang seragam. */
export function AboutSection({ title, id, isPending, isError, onRetry, isEmpty, children }: AboutSectionProps) {
    if (!isPending && !isError && isEmpty) return null;

    return (
        <section id={id} aria-label={title} className="scroll-mt-24">
            <h2 className="mb-6 border-b-2 border-border pb-2 font-heading text-2xl font-bold">{title}</h2>
            {isPending && <Skeleton className="h-32 border-2 border-border" />}
            {isError && <ErrorState message={`Could not load ${title.toLowerCase()} right now.`} onRetry={onRetry} />}
            {!isPending && !isError && children}
        </section>
    );
}
