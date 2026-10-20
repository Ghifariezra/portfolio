import type { GithubRepo } from "@/features/projects/schemas/github.schema";

export function LanguageBar({ languages }: { languages: GithubRepo["languages"] }) {
    if (languages.length === 0) return null;
    return (
        <section aria-label="Languages">
            <div className="flex h-3 w-full overflow-hidden border-2 border-border">
                {languages.map((l, i) => (
                    <div
                        key={l.name}
                        title={`${l.name} ${l.percent}%`}
                        className="h-full bg-primary"
                        style={{ width: `${l.percent}%`, opacity: Math.max(1 - i * 0.18, 0.25) }}
                    />
                ))}
            </div>
            <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-muted-foreground">
                {languages.map((l) => (
                    <li key={l.name}>
                        <span className="text-foreground">{l.name}</span> {l.percent}%
                    </li>
                ))}
            </ul>
        </section>
    );
}
