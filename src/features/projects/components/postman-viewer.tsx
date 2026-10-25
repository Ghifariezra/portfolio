import { ArrowSquareOut, CaretRight, FolderSimple } from "@phosphor-icons/react";
import { CodeBlock } from "@/components/markdown/code-block";
import { MarkdownContent } from "@/components/markdown/markdown-content";
import type { PostmanNode, PostmanRequest, PostmanSource } from "@/features/projects/schemas/postman.schema";

const METHOD_STYLES: Record<string, string> = {
    GET: "border-emerald-500/50 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
    POST: "border-amber-500/50 bg-amber-500/15 text-amber-700 dark:text-amber-300",
    PUT: "border-sky-500/50 bg-sky-500/15 text-sky-700 dark:text-sky-300",
    PATCH: "border-violet-500/50 bg-violet-500/15 text-violet-700 dark:text-violet-300",
    DELETE: "border-red-500/50 bg-red-500/15 text-red-700 dark:text-red-300",
};

const summaryClass =
    "flex cursor-pointer list-none items-center gap-3 px-3 py-2.5 hover:bg-muted focus-visible:bg-muted focus-visible:outline-none [&::-webkit-details-marker]:hidden";

function MethodBadge({ method }: { method: string }) {
    return (
        <span
            className={`inline-block w-16 shrink-0 border px-2 py-0.5 text-center font-mono text-[11px] font-bold ${
                METHOD_STYLES[method] ?? "border-border bg-muted text-muted-foreground"
            }`}
        >
            {method}
        </span>
    );
}

function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="space-y-1.5">
            <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">{label}</p>
            {children}
        </div>
    );
}

function RequestItem({ request }: { request: PostmanRequest }) {
    const hasDetails =
        request.description || request.headers.length > 0 || request.body || request.tests || request.prerequest;

    return (
        <details className="group border-2 border-border bg-card">
            <summary className={summaryClass}>
                <CaretRight size={14} className="shrink-0 transition-transform group-open:rotate-90" />
                <MethodBadge method={request.method} />
                <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{request.name}</span>
                    <span className="block truncate font-mono text-xs text-muted-foreground">{request.url}</span>
                </span>
            </summary>

            <div className="space-y-4 border-t-2 border-border p-4">
                {!hasDetails && <p className="text-sm text-muted-foreground">No extra details.</p>}

                {request.description && <MarkdownContent>{request.description}</MarkdownContent>}

                {request.headers.length > 0 && (
                    <Labeled label="Headers">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <tbody>
                                    {request.headers.map((h) => (
                                        <tr key={h.key}>
                                            <td className="border border-border px-3 py-1.5 font-mono text-xs">
                                                {h.key}
                                            </td>
                                            <td className="border border-border px-3 py-1.5 font-mono text-xs text-muted-foreground">
                                                {h.value}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Labeled>
                )}

                {request.body && (
                    <Labeled label="Body">
                        <CodeBlock code={request.body.code} lang={request.body.lang} />
                    </Labeled>
                )}

                {request.prerequest && (
                    <Labeled label="Pre-request script">
                        <CodeBlock code={request.prerequest} lang="javascript" />
                    </Labeled>
                )}

                {request.tests && (
                    <Labeled label="Tests">
                        <CodeBlock code={request.tests} lang="javascript" />
                    </Labeled>
                )}
            </div>
        </details>
    );
}

function NodeItem({ node }: { node: PostmanNode }) {
    if (node.kind === "request") return <RequestItem request={node} />;

    return (
        <details open className="group border-2 border-border">
            <summary className={`${summaryClass} bg-muted/40`}>
                <CaretRight size={14} className="shrink-0 transition-transform group-open:rotate-90" />
                <FolderSimple size={18} weight="bold" className="shrink-0" />
                <span className="min-w-0 flex-1 truncate text-sm font-semibold">{node.name}</span>
                <span className="shrink-0 text-xs text-muted-foreground tabular-nums">{node.requestCount}</span>
            </summary>
            <div className="space-y-2 border-t-2 border-border p-3">
                {node.description && <MarkdownContent>{node.description}</MarkdownContent>}
                {node.items.map((child, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: urutan item collection tetap, nama bisa kembar
                    <NodeItem key={i} node={child} />
                ))}
            </div>
        </details>
    );
}

const clip = (s: string, max = 80) => (s.length > max ? `${s.slice(0, max)}…` : s);

export function PostmanViewer({ source }: { source: PostmanSource }) {
    const { collection, path, blobUrl } = source;

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <h2 className="text-xl font-bold wrap-break-word">{collection.name}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {collection.requestCount} {collection.requestCount === 1 ? "request" : "requests"}
                        {collection.variables.length > 0 && ` · ${collection.variables.length} variables`}
                    </p>
                    <p className="mt-0.5 font-mono text-xs break-all text-muted-foreground">{path}</p>
                </div>
                <a
                    href={blobUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center gap-1.5 border-2 border-border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
                >
                    View JSON
                    <ArrowSquareOut size={14} />
                </a>
            </div>

            {collection.description && <MarkdownContent>{collection.description}</MarkdownContent>}

            {collection.variables.length > 0 && (
                <details className="group border-2 border-border">
                    <summary className={summaryClass}>
                        <CaretRight size={14} className="shrink-0 transition-transform group-open:rotate-90" />
                        <span className="text-sm font-semibold">Collection variables</span>
                        <span className="text-xs text-muted-foreground tabular-nums">
                            {collection.variables.length}
                        </span>
                    </summary>
                    <div className="overflow-x-auto border-t-2 border-border">
                        <table className="w-full text-left text-sm">
                            <tbody>
                                {collection.variables.map((v) => (
                                    <tr key={v.key}>
                                        <td className="border-b border-border px-3 py-1.5 font-mono text-xs whitespace-nowrap">
                                            {v.key}
                                        </td>
                                        <td
                                            className="border-b border-border px-3 py-1.5 font-mono text-xs break-all text-muted-foreground"
                                            title={v.value}
                                        >
                                            {clip(v.value)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </details>
            )}

            <div className="space-y-2">
                {collection.items.map((node, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: urutan item collection tetap, nama bisa kembar
                    <NodeItem key={i} node={node} />
                ))}
            </div>
        </div>
    );
}
