import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { CodeBlock } from "./code-block";

type State = { status: "loading" } | { status: "ready"; svg: string } | { status: "error"; message: string };

// Mermaid butuh id unik per render. Counter modul menghindari tabrakan saat StrictMode menjalankan efek dua kali.
let renderCount = 0;

export function MermaidDiagram({ code }: { code: string }) {
    const { resolvedTheme } = useTheme();
    const [state, setState] = useState<State>({ status: "loading" });

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                // Lazy: chunk mermaid (besar) hanya diunduh kalau ada README yang berisi diagram.
                const { default: mermaid } = await import("mermaid");
                mermaid.initialize({
                    startOnLoad: false,
                    securityLevel: "strict",
                    theme: resolvedTheme === "dark" ? "dark" : "neutral",
                    fontFamily: '"Inter Variable", ui-sans-serif, system-ui, sans-serif',
                });
                await mermaid.parse(code); // melempar error sebelum render, jadi tidak ada sisa elemen di DOM
                const { svg } = await mermaid.render(`mermaid-${++renderCount}`, code);
                if (!cancelled) setState({ status: "ready", svg });
            } catch (err) {
                if (!cancelled) {
                    setState({ status: "error", message: err instanceof Error ? err.message : "Invalid diagram" });
                }
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [code, resolvedTheme]);

    if (state.status === "loading") return <Skeleton className="h-32 border-2 border-border" />;

    if (state.status === "error") {
        return (
            <div className="space-y-2">
                <p className="font-mono text-xs text-destructive">Could not render this diagram.</p>
                <CodeBlock code={code} lang="mermaid" />
            </div>
        );
    }

    return (
        <figure className="m-0 overflow-x-auto border-2 border-border bg-card p-4">
            <div
                className="[&_svg]:mx-auto [&_svg]:h-auto [&_svg]:max-w-full"
                // biome-ignore lint/security/noDangerouslySetInnerHtml: SVG dari mermaid dengan securityLevel "strict"
                dangerouslySetInnerHTML={{ __html: state.svg }}
            />
        </figure>
    );
}
