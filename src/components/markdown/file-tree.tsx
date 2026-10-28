import { useState } from "react";
import {
    CaretRight,
    File,
    FileCode,
    FileCss,
    FileHtml,
    FileImage,
    FileJs,
    FileJsx,
    FileText,
    FileTs,
    FileTsx,
    Folder,
    FolderOpen,
    type Icon,
} from "@/components/ui/icons";
import type { TreeNode } from "@/lib/markdown/parse-file-tree";
import { cn } from "@/lib/utils";

const FILE_ICONS: Record<string, Icon> = {
    ts: FileTs,
    tsx: FileTsx,
    js: FileJs,
    mjs: FileJs,
    cjs: FileJs,
    jsx: FileJsx,
    css: FileCss,
    html: FileHtml,
    json: FileCode,
    yaml: FileCode,
    yml: FileCode,
    toml: FileCode,
    xml: FileCode,
    sql: FileCode,
    sh: FileCode,
    md: FileText,
    txt: FileText,
    env: FileText,
    example: FileText,
    png: FileImage,
    jpg: FileImage,
    jpeg: FileImage,
    gif: FileImage,
    svg: FileImage,
    webp: FileImage,
    ico: FileImage,
};

const iconFor = (name: string): Icon => FILE_ICONS[name.split(".").pop()?.toLowerCase() ?? ""] ?? File;

function Comment({ text }: { text?: string }) {
    if (!text) return null;
    return <span className="ml-auto shrink-0 pl-6 text-xs text-muted-foreground"># {text}</span>;
}

function TreeItem({ node }: { node: TreeNode }) {
    const [open, setOpen] = useState(true);

    if (!node.isDir) {
        const FileIcon = iconFor(node.name);
        return (
            <li className="flex items-center gap-2 whitespace-nowrap py-0.5">
                <span className="w-3 shrink-0" aria-hidden="true" />
                <FileIcon size={16} className="shrink-0 text-muted-foreground" />
                <span>{node.name}</span>
                <Comment text={node.comment} />
            </li>
        );
    }

    const FolderIcon = open ? FolderOpen : Folder;
    return (
        <li>
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
                className="flex w-full cursor-pointer items-center gap-2 whitespace-nowrap py-0.5 text-left hover:text-primary"
            >
                <CaretRight
                    size={12}
                    weight="bold"
                    className={cn("shrink-0 transition-transform", open && "rotate-90")}
                />
                <FolderIcon size={16} weight="fill" className="shrink-0 text-primary" />
                <span className="font-semibold">{node.name}</span>
                <Comment text={node.comment} />
            </button>
            {open && node.children.length > 0 && <TreeList nodes={node.children} nested />}
        </li>
    );
}

function TreeList({ nodes, nested = false }: { nodes: TreeNode[]; nested?: boolean }) {
    return (
        <ul className={cn("m-0 list-none space-y-0.5 p-0", nested && "ml-1.5 border-l-2 border-border pl-4")}>
            {nodes.map((node, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: pohon statis, nama bisa kembar antar folder
                <TreeItem key={`${node.name}-${i}`} node={node} />
            ))}
        </ul>
    );
}

export function FileTree({ nodes }: { nodes: TreeNode[] }) {
    return (
        <div className="overflow-x-auto border-2 border-border bg-card p-3 font-mono text-[13px]">
            <TreeList nodes={nodes} />
        </div>
    );
}
