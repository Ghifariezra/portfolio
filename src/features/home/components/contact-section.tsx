import { brutalButtonClass } from "@/components/ui/button-styles";
import { useProfile } from "@/features/portfolio/hooks/use-portfolio";
import { isHttpUrl } from "@/lib/utils";

export function ContactSection() {
    const { data } = useProfile();

    const links = [
        { label: "LinkedIn", href: data?.linkedin_url },
        { label: "GitHub", href: data?.github_url },
    ].flatMap(({ label, href }) => (isHttpUrl(href) ? [{ label, href }] : []));

    if (links.length === 0) return null;

    return (
        <section
            aria-label="Contact"
            className="flex flex-col gap-5 border-2 border-border bg-card p-6 shadow-brutal sm:flex-row sm:items-center sm:justify-between"
        >
            <div>
                <h2 className="font-heading text-2xl font-bold">Get in touch</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    Have a role or a project in mind? Reach me on LinkedIn or take a look at my code on GitHub.
                </p>
            </div>

            <div className="flex shrink-0 flex-wrap gap-3">
                {links.map((link, index) => (
                    <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className={brutalButtonClass(index === 0 ? "primary" : "card")}
                    >
                        {link.label}
                    </a>
                ))}
            </div>
        </section>
    );
}