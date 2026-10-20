import { Children, isValidElement, type ReactNode } from "react";
import Markdown, { type Components, type UrlTransform } from "react-markdown";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { isFileTree, parseFileTree } from "@/lib/markdown/parse-file-tree";
import { CodeBlock } from "./code-block";
import { FileTree } from "./file-tree";
import { MermaidDiagram } from "./mermaid-diagram";

interface CodeElementProps {
    className?: string;
    children?: ReactNode;
}

const textOf = (children: ReactNode): string =>
    (Array.isArray(children) ? children.join("") : String(children ?? "")).replace(/\n$/, "");

// Block kode di markdown = <pre><code class="language-x">. Di sini kita putuskan mau dirender sebagai apa.
const components: Components = {
    pre({ children }) {
        const child = Children.toArray(children)[0];
        if (!isValidElement<CodeElementProps>(child)) return <pre>{children}</pre>;

        const lang = /language-([\w+-]+)/.exec(child.props.className ?? "")?.[1]?.toLowerCase();
        const code = textOf(child.props.children);

        if (lang === "mermaid") return <MermaidDiagram code={code} />;

        if (isFileTree(lang, code)) {
            const nodes = parseFileTree(code);
            if (nodes) return <FileTree nodes={nodes} />;
        }

        return <CodeBlock code={code} lang={lang} />;
    },
};

/** Renderer markdown bersama (README sekarang, halaman lain nanti): GFM, highlight, mermaid, file tree. */
export function MarkdownContent({ children, urlTransform }: { children: string; urlTransform?: UrlTransform }) {
    return (
        <div className="readme">
            <Markdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeSlug]}
                components={components}
                urlTransform={urlTransform}
                // Tanpa rehype-raw, HTML mentah di README (mis. <p align="center">) dibuang, bukan dieksekusi.
                skipHtml
            >
                {children}
            </Markdown>
        </div>
    );
}
