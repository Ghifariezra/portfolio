import { GithubLogo, Globe, LinkedinLogo } from "@phosphor-icons/react";
import { ErrorState } from "@/components/ui/error-state";
import { IconLink } from "@/components/ui/icon-link";
import { Skeleton } from "@/components/ui/skeleton";
import { DownloadCvButton } from "@/features/cv/components/download-cv-button";
import { useProfile } from "@/features/portfolio/hooks/use-portfolio";
import { joinParts } from "@/features/portfolio/lib/portfolio-helpers";
import { isHttpUrl } from "@/lib/utils";

export function ProfileHeader() {
    const { data, isPending, isError, refetch } = useProfile();

    if (isPending) return <Skeleton className="h-40 border-2 border-border" />;
    if (isError) return <ErrorState message="Could not load the profile right now." onRetry={() => refetch()} />;

    const location = joinParts([data.city, data.region, data.country]);

    return (
        <header className="flex flex-col gap-6 sm:flex-row sm:items-start">
            {data.avatar_url && (
                <img
                    src={data.avatar_url}
                    alt={data.full_name}
                    className="size-32 shrink-0 border-2 border-border object-cover shadow-brutal"
                />
            )}
            <div className="min-w-0 flex-1">
                <h1 className="font-heading text-4xl font-bold md:text-5xl">{data.full_name}</h1>
                {data.headline && <p className="mt-2 text-lg font-semibold text-primary">{data.headline}</p>}
                {location && <p className="mt-1 font-mono text-xs text-muted-foreground">{location}</p>}

                {data.summary && (
                    <p className="mt-4 max-w-2xl whitespace-pre-line leading-relaxed text-muted-foreground">
                        {data.summary}
                    </p>
                )}

                <div className="mt-5 flex flex-wrap items-center gap-3">
                    {isHttpUrl(data.github_url) && (
                        <IconLink href={data.github_url} label="GitHub profile">
                            <GithubLogo size={18} weight="bold" />
                        </IconLink>
                    )}
                    {isHttpUrl(data.linkedin_url) && (
                        <IconLink href={data.linkedin_url} label="LinkedIn profile">
                            <LinkedinLogo size={18} weight="bold" />
                        </IconLink>
                    )}
                    {isHttpUrl(data.website_url) && (
                        <IconLink href={data.website_url} label="Website">
                            <Globe size={18} weight="bold" />
                        </IconLink>
                    )}
                    <DownloadCvButton />
                </div>
            </div>
        </header>
    );
}
