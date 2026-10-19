import { formatMonth, isHttpUrl } from "@/lib/utils";
import { useCertifications } from "../hooks/use-portfolio";
import { joinParts } from "../lib/portfolio-helpers";
import { AboutSection } from "./about-section";

export function CertificationsSection() {
    const { data, isPending, isError, refetch } = useCertifications();

    return (
        <AboutSection
            title="Certifications"
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
                            {isHttpUrl(cert.credential_url) && (
                                <a
                                    href={cert.credential_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-2 w-fit font-mono text-xs font-semibold text-muted-foreground underline underline-offset-4 hover:text-primary"
                                >
                                    View credential
                                </a>
                            )}
                        </li>
                    );
                })}
            </ul>
        </AboutSection>
    );
}
