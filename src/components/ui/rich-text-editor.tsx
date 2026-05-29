import "@blocknote/core/fonts/inter.css";
import { BlockNoteSchema, createCodeBlockSpec } from "@blocknote/core";
import { codeBlockOptions } from "@blocknote/code-block";
import {
    BlockNoteView,
    darkDefaultTheme,
    lightDefaultTheme,
    type Theme,
} from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { useTheme } from "next-themes";
import { projectService } from "@/lib/services/project.service";
import jsonGrammar from "shiki/langs/json.mjs";
import { createHighlighter } from "shiki";
import "@/components/ui/rich-text-editor.css";
import { useMemo } from "react";

interface RichTextEditorProps {
    initialContent?: string;
    onChange: (html: string) => void;
}

const LANGS = [
    "typescript", "javascript", "tsx", "jsx", "json", "sql",
    "html", "css", "bash", "shell", "markdown", "python", "yaml",
    "xml", "java", "rust", "go", "php", "ruby", "c", "cpp",
    "csharp", "kotlin", "swift", "sass", "scss",
] as const;

const CUSTOM_LANGS = async (h: Awaited<ReturnType<typeof createHighlighter>>) => {
    const raw = Array.isArray(jsonGrammar) ? jsonGrammar[0] : jsonGrammar;
    await h.loadLanguage({ ...raw, name: "file-tree", aliases: ["filetree", "folder-structure"] } as any);
    await h.loadLanguage({ ...raw, name: "react-flow", aliases: ["react-flow", "erd", "reactflow"] } as any);
    return h;
};

const lightHighlighterPromise = createHighlighter({ themes: ["github-light"], langs: [...LANGS] }).then(CUSTOM_LANGS);
const darkHighlighterPromise = createHighlighter({ themes: ["github-dark"], langs: [...LANGS] }).then(CUSTOM_LANGS);

const SUPPORTED_LANGUAGES = {
    ...codeBlockOptions.supportedLanguages,
    "file-tree": { name: "File Tree (JSON)", aliases: ["filetree", "folder-structure"] },
    "react-flow": { name: "React Flow ERD (JSON)", aliases: ["react-flow", "erd", "reactflow"] },
};

function makeSchema(isDark: boolean) {
    return BlockNoteSchema.create().extend({
        blockSpecs: {
            codeBlock: createCodeBlockSpec({
                ...codeBlockOptions,
                supportedLanguages: SUPPORTED_LANGUAGES,
                createHighlighter: () => isDark ? darkHighlighterPromise : lightHighlighterPromise,
            }),
        },
    });
}

const lightTheme = {
    colors: {
        ...(lightDefaultTheme.colors ?? {}),
        editor: { text: "#1a1a1a", background: "#f5f0e8" },
        menu: { text: "#1a1a1a", background: "#ffffff" },
        tooltip: { text: "#1a1a1a", background: "#ede8df" },
        hovered: { text: "#1a1a1a", background: "#ede8df" },
        selected: { text: "#ffffff", background: "#0055ff" },
        disabled: { text: "#5a5550", background: "#ede8df" },
        shadow: "#1a1a1a",
        border: "#1a1a1a",
        sideMenu: "#5a5550",
        highlights: lightDefaultTheme.colors?.highlights,
    },
    borderRadius: 4,
    fontFamily: "Inter Variable, ui-sans-serif, system-ui, sans-serif",
} satisfies Theme;

const darkTheme = {
    colors: {
        ...(darkDefaultTheme.colors ?? {}),
        editor: { text: "#e0e3e5", background: "#101415" },
        menu: { text: "#e0e3e5", background: "#191c1e" },
        tooltip: { text: "#e0e3e5", background: "#272a2c" },
        hovered: { text: "#e0e3e5", background: "#272a2c" },
        selected: { text: "#002e6a", background: "#adc6ff" },
        disabled: { text: "#8c909f", background: "#1d2022" },
        shadow: "#000000",
        border: "#323537",
        sideMenu: "#8c909f",
        highlights: darkDefaultTheme.colors?.highlights,
    },
    borderRadius: 4,
    fontFamily: "Inter Variable, ui-sans-serif, system-ui, sans-serif",
} satisfies Theme;

export function RichTextEditor({ initialContent, onChange }: RichTextEditorProps) {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";

    // Schema dibuat fresh berdasarkan theme saat pertama render
    // useMemo dengan [isDark] agar schema sesuai theme aktif
    const schema = useMemo(() => makeSchema(isDark), [isDark]);

    const editor = useCreateBlockNote({
        schema,
        initialContent: initialContent ? JSON.parse(initialContent) : undefined,
        uploadFile: async (file: File) => {
            const response = await projectService.uploadProjectImage(file);
            const data = response.data as { url: string };
            return data.url;
        },
    });

    return (
        <div className="neo-brutalist-editor-wrapper group border-2 dark:border border-border rounded-md overflow-hidden bg-background shadow-brutal-sm dark:shadow-none transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/50 focus-within:shadow-none focus-within:translate-x-0.5 focus-within:translate-y-0.5 min-h-75 flex flex-col">
            <div className="bg-card border-b-2 dark:border-b border-border p-2 flex items-center justify-between text-xs font-mono text-muted-foreground uppercase tracking-widest">
                <span>Rich Text Content</span>
                <span className="opacity-50">Type '/' for commands</span>
            </div>
            <div className="flex-1 p-2 md:p-4 bg-background">
                <BlockNoteView
                    editor={editor}
                    theme={isDark ? darkTheme : lightTheme}
                    onChange={() => onChange(JSON.stringify(editor.document))}
                    className="h-full"
                />
            </div>
        </div>
    );
}