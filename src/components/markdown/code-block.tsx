import { useHighlightedCode } from "@/hooks/use-highlighted-code";
import { CopyButton } from "./copy-button";

const PRE_CLASS = "m-0 overflow-x-auto border-0 bg-transparent p-4 text-[13px] leading-relaxed";

export function CodeBlock({ code, lang }: { code: string; lang?: string }) {
    const html = useHighlightedCode(code, lang);

    return (
        <div className="overflow-hidden border-2 border-border bg-muted">
            <div className="flex items-center justify-between border-b-2 border-border px-3 py-1.5 font-mono text-[11px] text-muted-foreground">
                <span>{lang ?? "text"}</span>
                <CopyButton text={code} />
            </div>

            {html ? (
                <div
                    className="[&_pre]:m-0 [&_pre]:overflow-x-auto [&_pre]:border-0 [&_pre]:bg-transparent [&_pre]:p-4 [&_pre]:text-[13px] [&_pre]:leading-relaxed"
                    // biome-ignore lint/security/noDangerouslySetInnerHtml: output shiki, isi kode sudah di-escape
                    dangerouslySetInnerHTML={{ __html: html }}
                />
            ) : (
                <pre className={PRE_CLASS}>
                    <code>{code}</code>
                </pre>
            )}
        </div>
    );
}
