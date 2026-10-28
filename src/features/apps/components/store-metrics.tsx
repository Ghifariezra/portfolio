import { Download, Globe, MapPin } from "@/components/ui/icons";
import { Skeleton } from "@/components/ui/skeleton";
import { useStoreAnalytics } from "@/features/apps/hooks/use-store-analytics";
import { isNotFound } from "@/lib/api";
import { formatNumber } from "@/lib/utils";

const TOP_REGIONS = 3;

export function StoreMetrics({ storeId }: { storeId: string }) {
    const { data, isPending, error } = useStoreAnalytics(storeId);

    if (isPending) return <Skeleton className="h-32" />;

    if (error) {
        return (
            <p className="p-5 font-mono text-xs text-muted-foreground">
                {isNotFound(error) ? "No metrics for this app yet." : "Metrics are unavailable right now."}
            </p>
        );
    }

    return (
        <div>
            <div className="grid grid-cols-2 divide-x-2 divide-border border-b-2 border-border">
                <div className="p-4">
                    <p className="font-heading text-3xl font-black">{formatNumber(data.totalInstalls)}</p>
                    <p className="mt-1 inline-flex items-center gap-1 font-mono text-xs text-muted-foreground">
                        <Download size={12} /> Installs
                    </p>
                </div>
                <div className="p-4">
                    <p className="font-heading text-3xl font-black">{data.topRegions.length}</p>
                    <p className="mt-1 inline-flex items-center gap-1 font-mono text-xs text-muted-foreground">
                        <Globe size={12} /> Markets
                    </p>
                </div>
            </div>

            {data.topRegions.length > 0 && (
                <div className="p-4">
                    <p className="mb-2 inline-flex items-center gap-1 font-mono text-xs text-muted-foreground">
                        <MapPin size={12} /> Top regions, last 5 years
                    </p>
                    <ul className="space-y-1.5 text-sm">
                        {data.topRegions.slice(0, TOP_REGIONS).map((r) => (
                            <li key={r.market} className="flex justify-between gap-3">
                                <span className="truncate font-semibold">{r.market}</span>
                                <span className="shrink-0 font-mono text-muted-foreground">
                                    {formatNumber(r.installCount)} ({r.percentage}%)
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
