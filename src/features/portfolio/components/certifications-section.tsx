import { formatMonth, isHttpUrl } from "@/lib/utils";
import { useCertifications } from "../hooks/use-portfolio";
import { joinParts } from "../lib/portfolio-helpers";
import { AboutSection } from "./about-section";

const LINK_CLASS =
    "font-mono text-xs font-semibold text-muted-foreground underline underline-offset-4 hover:text-primary";

export function CertificationsSection() {
    const { data, isPending, isError, refetch } = useCertifications();

    return (
        <AboutSection
            title="Certifications"
            id="certifications"
            isPending={isPending}
            isError={isError}
            onRetry={() => refetch()}
            isEmpty={!data?.length}
        >
            <ul className="grid gap-4 sm:grid-cols-2">
                {data?.map((cert) => {
                    const dates = joinParts(
                        [
                            cert.issued_date ? `Issued ${formatMonth(cert.issued_date)}` : null,
                            cert.expires_date ? `Expires ${formatMonth(cert.expires_date)}` : null,
                        ],
                        " · ",
                    );

                    return (
                        <li key={cert.id} className="flex flex-col gap-1 border-2 border-border bg-card p-4">
                            <h3 className="font-heading text-base font-semibold leading-snug">{cert.name}</h3>
                            <p className="text-sm font-semibold">{cert.issuer}</p>
                            {dates && <p className="font-mono text-xs text-muted-foreground">{dates}</p>}
                            {cert.credential_id && (
                                <p className="font-mono text-xs text-muted-foreground">ID: {cert.credential_id}</p>
                            )}
                            {cert.summary && (
                                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{cert.summary}</p>
                            )}
                            {(isHttpUrl(cert.credential_url) || isHttpUrl(cert.report_url)) && (
                                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                                    {isHttpUrl(cert.credential_url) && (
                                        <a
                                            href={cert.credential_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className={LINK_CLASS}
                                        >
                                            View credential
                                        </a>
                                    )}
                                    {isHttpUrl(cert.report_url) && (
                                        <a
                                            href={cert.report_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className={LINK_CLASS}
                                        >
                                            Learning report
                                        </a>
                                    )}
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>
        </AboutSection>
    );
}
