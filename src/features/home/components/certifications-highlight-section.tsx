import { Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { useCertifications } from "@/features/portfolio/hooks/use-portfolio";
import { joinParts } from "@/features/portfolio/lib/portfolio-helpers";
import { formatMonth } from "@/lib/utils";
import { selectTopCertifications } from "../lib/home-helpers";
import { HOME_LINK_CLASS, HomeSection } from "./home-section";

export function CertificationsHighlightSection() {
    const { data, isPending, isError, refetch } = useCertifications();
    const certifications = useMemo(() => selectTopCertifications(data ?? []), [data]);

    return (
        <HomeSection
            title="Certifications"
            action={
                <Link to="/about" className={HOME_LINK_CLASS}>
                    All certifications →
                </Link>
            }
            isPending={isPending}
            isError={isError}
            onRetry={() => refetch()}
            isEmpty={certifications.length === 0}
        >
            <ul className="flex flex-col gap-3">
                {certifications.map((cert) => (
                    <li key={cert.id} className="flex flex-col gap-0.5 border-2 border-border bg-card p-4">
                        <h3 className="font-heading text-base font-semibold leading-snug">{cert.name}</h3>
                        <p className="font-mono text-xs text-muted-foreground">
                            {joinParts([cert.issuer, cert.issued_date ? formatMonth(cert.issued_date) : null], " · ")}
                        </p>
                    </li>
                ))}
            </ul>
        </HomeSection>
    );
}