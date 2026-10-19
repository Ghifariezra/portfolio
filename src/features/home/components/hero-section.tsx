import { GithubLogo, Globe, LinkedinLogo } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { brutalButtonClass } from "@/components/ui/button-styles";
import { IconLink } from "@/components/ui/icon-link";
import { Skeleton } from "@/components/ui/skeleton";
import { SITE } from "@/config/site";
import { useProfile } from "@/features/portfolio/hooks/use-portfolio";
import { joinParts } from "@/features/portfolio/lib/portfolio-helpers";
import { isHttpUrl } from "@/lib/utils";

export function HeroSection() {
    const { data, isPending } = useProfile();
    const location = data ? joinParts([data.city, data.region, data.country]) : "";

    return (
        <section aria-label="Introduction" className="flex flex-col gap-6 py-4 sm:flex-row sm:items-center">
            {data?.avatar_url && (
                <img
                    src={data.avatar_url}
                    alt={data.full_name}
                    className="size-36 shrink-0 border-2 border-border object-cover shadow-brutal"
                />
            )}

            <div className="min-w-0 flex-1">
                {location && <p className="font-mono text-xs text-muted-foreground">{location}</p>}
                <h1 className="mt-1 font-heading text-5xl font-bold md:text-6xl">{data?.full_name ?? SITE.fullName}</h1>

                {isPending ? (
                    <div className="mt-4 space-y-2">
                        <Skeleton className="h-6 w-1/3" />
                        <Skeleton className="h-4 w-full max-w-2xl" />
                        <Skeleton className="h-4 w-2/3 max-w-2xl" />
                    </div>
                ) : (
                    <>
                        {data?.headline && <p className="mt-3 text-xl font-semibold text-primary">{data.headline}</p>}
                        {data?.summary && (
                            <p className="mt-3 max-w-2xl whitespace-pre-line leading-relaxed text-muted-foreground">
                                {data.summary}
                            </p>
                        )}
                    </>
                )}

                <div className="mt-6 flex flex-wrap items-center gap-3">
                    <Link to="/projects" className={brutalButtonClass("primary")}>
                        View projects
                    </Link>
                    <Link to="/about" className={brutalButtonClass("card")}>
                        About me
                    </Link>

                    <div className="flex gap-2 sm:ml-2">
                        {isHttpUrl(data?.github_url) && (
                            <IconLink href={data.github_url} label="GitHub profile">
                                <GithubLogo size={18} weight="bold" />
                            </IconLink>
                        )}
                        {isHttpUrl(data?.linkedin_url) && (
                            <IconLink href={data.linkedin_url} label="LinkedIn profile">
                                <LinkedinLogo size={18} weight="bold" />
                            </IconLink>
                        )}
                        {isHttpUrl(data?.website_url) && (
                            <IconLink href={data.website_url} label="Website">
                                <Globe size={18} weight="bold" />
                            </IconLink>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}