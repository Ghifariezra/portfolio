import type { ReactNode } from "react";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";

/** Gaya link "lihat semua" di pojok kanan judul section. */
export const HOME_LINK_CLASS =
    "font-mono text-xs font-semibold text-muted-foreground underline underline-offset-4 hover:text-primary";

interface HomeSectionProps {
    title: string;
    /** Biasanya <Link> ke halaman lengkapnya. */
    action?: ReactNode;
    isPending: boolean;
    isError: boolean;
    onRetry: () => void;
    /** Section disembunyikan kalau data sudah dimuat tapi kosong. */
    isEmpty: boolean;
    /** Placeholder loading khusus; default satu kotak. */
    skeleton?: ReactNode;
    children: ReactNode;
}

/** Pembungkus section Home: judul + link + state loading/error/kosong yang seragam. */
export function HomeSection({
    title,
    action,
    isPending,
    isError,
    onRetry,
    isEmpty,
    skeleton,
    children,
}: HomeSectionProps) {
    if (!isPending && !isError && isEmpty) return null;

    return (
        <section aria-label={title}>
            <div className="mb-6 flex items-end justify-between gap-4 border-b-2 border-border pb-2">
                <h2 className="font-heading text-2xl font-bold">{title}</h2>
                {action}
            </div>
            {isPending && (skeleton ?? <Skeleton className="h-32 border-2 border-border" />)}
            {isError && <ErrorState message={`Could not load ${title.toLowerCase()} right now.`} onRetry={onRetry} />}
            {!isPending && !isError && children}
        </section>
    );
}