import { memo, useMemo, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { BlockNoteSchema, createCodeBlockSpec, defaultBlockSpecs } from "@blocknote/core";
import { codeBlockOptions } from "@blocknote/code-block";
import {
    BlockNoteView,
    darkDefaultTheme,
    lightDefaultTheme,
    type Theme,
} from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import jsonGrammar from "shiki/langs/json.mjs";
import { createHighlighter } from "shiki";
import { FileTreeBlock } from "@/components/shared/file-tree-block";
import { ReactFlowBlock } from "@/components/shared/react-flow-block";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import "@/components/ui/rich-text-editor.css";

const LANGS = [
    "typescript", "javascript", "tsx", "jsx", "json", "sql",
    "html", "css", "bash", "shell", "markdown", "python", "yaml",
    "xml", "java", "rust", "go", "php", "ruby", "c", "cpp",
    "csharp", "kotlin", "swift", "sass", "scss",
] as const;

const CUSTOM_LANGS = async (h: Awaited<ReturnType<typeof createHighlighter>>) => {
    const raw = Array.isArray(jsonGrammar) ? jsonGrammar[0] : jsonGrammar;
    await h.loadLanguage({ ...raw, name: "file-tree", aliases: ["filetree"] } as any);
    await h.loadLanguage({ ...raw, name: "react-flow", aliases: ["reactflow"] } as any);
    return h;
};

const lightHighlighterPromise = createHighlighter({ themes: ["github-light"], langs: [...LANGS] }).then(CUSTOM_LANGS);
const darkHighlighterPromise = createHighlighter({ themes: ["github-dark"], langs: [...LANGS] }).then(CUSTOM_LANGS);

const SUPPORTED_LANGUAGES = {
    ...codeBlockOptions.supportedLanguages,
    "file-tree": { name: "File Tree (JSON)", aliases: ["filetree"] },
    "react-flow": { name: "React Flow ERD (JSON)", aliases: ["reactflow"] },
};


// 2. Ubah fungsi makeSchema menjadi seperti ini:
function makeSchema(isDark: boolean) {
    // Kita menggunakan .create({ blockSpecs: ... }) daripada .extend()
    return BlockNoteSchema.create({
        blockSpecs: {
            // Masukkan semua block standar BlockNote (Heading, Paragraph, dll)
            ...defaultBlockSpecs,
            // Masukkan Block Custom kita!
            fileTree: FileTreeBlock(), 
            reactFlow: ReactFlowBlock(),
            // Masukkan konfigurasi Shiki Code Block
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
        editor: { text: "#1a1a1a", background: "transparent" },
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
        editor: { text: "#e0e3e5", background: "transparent" },
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

// Inner component — di-remount paksa via key setiap theme berubah
const BlockNoteReader = memo(function BlockNoteReader({
    initialContent,
    isDark,
}: {
    initialContent: unknown;
    isDark: boolean;
}) {
    // Schema dibuat fresh setiap mount (karena key berubah)
    const schema = useMemo(() => makeSchema(isDark), [isDark]);

    const editor = useCreateBlockNote({
        schema,
        initialContent: initialContent as any,
    });

    return (
        <BlockNoteView
            editor={editor}
            editable={false}
            theme={isDark ? darkTheme : lightTheme}
        />
    );
});

export const Reader = memo(function Reader({ content }: { content: string }) {
    const { resolvedTheme } = useTheme();

    // resolvedTheme bisa undefined saat SSR/hydration
    // Gunakan null sebagai "belum tahu" — beda dari false
    const [stableTheme, setStableTheme] = useState<"dark" | "light" | null>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        let mounted = true;
        Promise.all([lightHighlighterPromise, darkHighlighterPromise]).then(() => {
            if (mounted) setIsReady(true);
        });
        return () => { mounted = false; };
    }, []);

    useEffect(() => {
        if (resolvedTheme === "dark" || resolvedTheme === "light") {
            setStableTheme(resolvedTheme);
        }
    }, [resolvedTheme]);

    const initialContent = useMemo(() => {
        if (!content) return undefined;
        try {
            const parsedContent = JSON.parse(content);

            const transformBlocks = (blocks: any[]): any[] => {
                return blocks.map(block => {
                    if (block.type === "codeBlock") {
                        if (block.props?.language === "file-tree") {
                            return { ...block, type: "fileTree" };
                        }
                        if (block.props?.language === "react-flow") {
                            return { ...block, type: "reactFlow" };
                        }
                    }
                    if (block.children && Array.isArray(block.children)) {
                        return { ...block, children: transformBlocks(block.children) };
                    }
                    return block;
                });
            };

            // Jika JSON mentahnya berupa array, langsung transform
            if (Array.isArray(parsedContent)) {
                return transformBlocks(parsedContent);
            }

            return parsedContent;
        } catch {
            return undefined;
        }
    }, [content]);

    if (!isReady || stableTheme === null) {
        return (
            <div className="w-full h-20 animate-pulse bg-muted rounded-md flex items-center justify-center border-2 border-border">
                <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest font-bold">
                    Warming up code parser...
                </span>
            </div>
        );
    }

    const isDark = stableTheme === "dark";

    return (
        <section className="w-full">
            {/*
             * KEY = stableTheme: setiap kali theme berubah, React unmount
             * BlockNoteReader sepenuhnya dan mount instance baru.
             * useCreateBlockNote + Shiki akan init ulang dengan highlighter
             * yang benar. Ini reproduksi persis behavior hot-reload.
             */}
            <BlockNoteReader
                key={stableTheme}
                initialContent={initialContent}
                isDark={isDark}
            />
        </section>
    );
});
