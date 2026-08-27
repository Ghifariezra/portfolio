import { useState, useMemo } from "react";
import { Certificate, CaretDown } from "@phosphor-icons/react";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { CertificateItem } from "@/lib/services/public.service";

interface CollapsCertificatedProps {
    certificates: CertificateItem[];
}

export function CollapsCertificated({ certificates }: CollapsCertificatedProps) {
    // Grouping sertifikat berdasarkan type_certified
    const groupedCertificates = useMemo(() => {
        if (!certificates || certificates.length === 0) return {};
        return certificates.reduce<Record<string, CertificateItem[]>>((acc, cert) => {
            const key = cert.type_certified || "Uncategorized";
            if (!acc[key]) acc[key] = [];
            acc[key].push(cert);
            return acc;
        }, {});
    }, [certificates]);

    const groupKeys = Object.keys(groupedCertificates);

    if (!certificates || certificates.length === 0) {
        return (
            <section className="mb-20" id="certificates">
                <h2 className="font-heading text-2xl md:text-3xl font-semibold text-foreground mb-8 flex items-center gap-4">
                    <span className="w-8 h-0.5 bg-border block"></span>
                    Certifications
                </h2>
                <div className="p-8 border-2 border-dashed border-border rounded-lg text-center bg-muted/50">
                    <p className="font-mono text-sm text-muted-foreground uppercase tracking-widest">
                        No certifications yet.
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="mb-20" id="certificates">
            <h2 className="font-heading text-2xl md:text-3xl font-semibold text-foreground mb-8 flex items-center gap-4">
                <span className="w-8 h-0.5 bg-border block"></span>
                Certifications
            </h2>

            <div className="space-y-4">
                {groupKeys.map((type) => (
                    <CertificateGroup
                        key={type}
                        title={type}
                        items={groupedCertificates[type]}
                    />
                ))}
            </div>
        </section>
    );
}

function CertificateGroup({ title, items }: { title: string; items: CertificateItem[] }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className="border-2 border-border rounded-lg bg-card overflow-hidden"
        >
            <CollapsibleTrigger className="w-full p-4 flex items-center justify-between font-heading font-bold text-lg text-foreground hover:bg-muted/50 transition-colors group cursor-pointer">
                <div className="flex items-center gap-3">
                    <span>{title}</span>
                    <span className="text-xs font-mono font-medium px-2.5 py-0.5 rounded-full bg-muted border border-border text-muted-foreground">
                        {items.length}
                    </span>
                </div>
                <CaretDown
                    className={`w-5 h-5 text-muted-foreground group-hover:text-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                        }`}
                />
            </CollapsibleTrigger>

            <CollapsibleContent className="p-4 pt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                    {items.map((cert) => (
                        <div
                            key={cert.id}
                            className="bg-card border-2 border-border rounded-lg flex flex-col overflow-hidden hover:border-foreground transition-all group hover:shadow-brutal dark:hover:shadow-none dark:hover:border-primary/50"
                        >
                            {cert.image && (
                                <div className="aspect-4/3 w-full border-b-2 border-border overflow-hidden relative bg-muted flex items-center justify-center">
                                    <div className="absolute inset-0 bg-foreground/10 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                                    <img
                                        src={cert.image}
                                        alt={cert.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                            )}

                            <div className="p-4 flex flex-col grow">
                                <h3 className="font-heading text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-2">
                                    {cert.name}
                                </h3>
                                <p className="font-mono text-xs font-semibold text-muted-foreground mt-auto pt-2 flex items-center gap-1.5">
                                    <Certificate
                                        weight="fill"
                                        className="w-4 h-4 text-primary shrink-0"
                                    />
                                    <span className="truncate">{cert.type_certified}</span>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
}