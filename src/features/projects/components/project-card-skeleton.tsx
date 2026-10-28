import { Skeleton } from "@/components/ui/skeleton";

export function ProjectCardSkeleton() {
    return (
        <div aria-busy="true" className="flex min-h-104 flex-col border-2 border-border bg-card">
            <Skeleton className="h-36 border-b-2 border-border" />
            <div className="flex flex-1 flex-col gap-4 p-5">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-5 w-1/2" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                </div>
                <Skeleton className="h-6 w-5/6" />
                <div className="mt-auto border-t-2 border-border pt-3">
                    <Skeleton className="h-4 w-2/3" />
                </div>
            </div>
        </div>
    );
}
