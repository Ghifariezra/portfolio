import { type BundledLanguage, bundledLanguages, createHighlighter, type Highlighter } from "shiki";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";

const THEMES = { light: "github-light", dark: "github-dark" } as const;

// Alias yang umum di README tapi belum dikenal shiki.
const LANG_ALIAS: Record<string, string> = { env: "dotenv", txt: "text", plaintext: "text" };

// Singleton: highlighter dibuat sekali, grammar dimuat lazy per bahasa saat pertama dipakai.
let highlighter: Promise<Highlighter> | null = null;
const getHighlighter = () =>
    (highlighter ??= createHighlighter({
        themes: Object.values(THEMES),
        langs: [],
        engine: createJavaScriptRegexEngine(),
    }));

function resolveLang(lang?: string): BundledLanguage | "text" {
    const key = (lang ?? "").toLowerCase();
    const id = LANG_ALIAS[key] ?? key;
    return id in bundledLanguages ? (id as BundledLanguage) : "text";
}

/**
 * Kode -> HTML berwarna. Dua tema sekaligus lewat CSS variable (--shiki-light / --shiki-dark),
 * jadi ganti tema tidak perlu highlight ulang. Isi kode di-escape oleh shiki.
 */
export async function highlightCode(code: string, lang?: string): Promise<string> {
    const hl = await getHighlighter();
    const id = resolveLang(lang);
    if (id !== "text") await hl.loadLanguage(id);
    return hl.codeToHtml(code, { lang: id, themes: THEMES, defaultColor: false });
}
