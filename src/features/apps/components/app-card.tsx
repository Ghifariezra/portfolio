import { Globe, WindowsLogo } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { IconLink } from "@/components/ui/icon-link";
import { Tag } from "@/components/ui/tag-list";
import { formatMonth } from "@/lib/utils";
import { APP_STATUS_LABEL, getStoreId } from "../lib/app-helpers";
import type { AppItem } from "../schemas/app.schema";
import { StoreMetrics } from "./store-metrics";

export function AppCard({ app }: { app: AppItem }) {
    const storeId = getStoreId(app);

    return (
        <article className="flex flex-col border-2 border-border bg-card">
            <div className="flex flex-col gap-3 p-5">
                <div className="flex items-start gap-4">
                    {app.icon_url && (
                        <img
                            src={app.icon_url}
                            alt=""
                            loading="lazy"
                            className="size-14 shrink-0 border-2 border-border bg-background object-cover p-1.5"
                        />
                    )}
                    <div className="min-w-0 flex-1">
                        <h2 className="font-heading text-xl font-bold">{app.name}</h2>
                        {app.description && (
                            <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                                {app.description}
                            </p>
                        )}
                    </div>
                    <div className="flex shrink-0 gap-2">
                        {app.website_url && (
                            <IconLink href={app.website_url} label={`${app.name} website`}>
                                <Globe size={16} />
                            </IconLink>
                        )}
                        {app.store_url && (
                            <IconLink href={app.store_url} label={`${app.name} on the Microsoft Store`}>
                                <WindowsLogo size={16} weight="fill" />
                            </IconLink>
                        )}
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                    <span className="border-2 border-border px-2 py-0.5 font-mono text-[11px] font-semibold">
                        {APP_STATUS_LABEL[app.status]}
                    </span>
                    {app.released_at && (
                        <span className="font-mono text-[11px] text-muted-foreground">
                            Released {formatMonth(app.released_at)}
                        </span>
                    )}
                    {app.skills.map((skill) => (
                        <Tag key={skill.id} label={skill.name} size="sm" />
                    ))}
                </div>

                {app.project && (
                    <Link
                        to="/projects/$slug"
                        params={{ slug: app.project.slug }}
                        className="w-fit font-mono text-xs font-semibold text-muted-foreground underline underline-offset-4 hover:text-primary"
                    >
                        Project: {app.project.title}
                    </Link>
                )}
            </div>

            <div className="mt-auto border-t-2 border-border">
                {storeId ? (
                    <StoreMetrics storeId={storeId} />
                ) : (
                    <p className="p-5 font-mono text-xs text-muted-foreground">
                        Metrics appear once the app is published.
                    </p>
                )}
            </div>
        </article>
    );
}
