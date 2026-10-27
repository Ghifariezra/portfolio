import { defaultUrlTransform } from "react-markdown";
import type { GithubRepo } from "@/features/projects/schemas/github.schema";
import { ABSOLUTE_URL } from "./readme-url";

/** Link ke file markdown di folder docs/, mis. "[API](docs/api.md#api-endpoints)" atau "(./docs/api.md)". */
const DOC_LINK = /\]\(\s*<?(?:\.\/)?(docs\/[^)\s#?>]+?\.md)(?:[#?][^)\s>]*)?>?\s*\)/gi;

/** Path file docs/*.md yang dirujuk README, unik dan diurutkan alfabetis. Dipakai hanya untuk menentukan tab Docs tampil. */
export function extractDocPaths(readme: string | null): string[] {
    if (!readme) return [];

    const paths = new Set<string>();
    for (const match of readme.matchAll(DOC_LINK)) {
        let path = match[1];
        try {
            path = decodeURIComponent(path);
        } catch {
            // percent-encoding rusak, pakai path apa adanya
        }
        if (path.split("/").includes("..")) continue;
        paths.add(path);
    }

    return [...paths].sort((a, b) => a.localeCompare(b));
}

/** "docs/api.md" -> "api", "docs/guide/setup.md" -> "guide/setup". */
export const docLabel = (path: string): string => path.replace(/^docs\//i, "").replace(/\.md$/i, "");

/**
 * Link dan gambar relatif di dalam dokumen ("../README.md", "testing.md#x", "./img/a.png") dihitung terhadap
 * folder dokumen itu sendiri, lalu diarahkan ke repo di GitHub. Beda dengan README yang relatif ke root repo.
 */
export function createDocUrlTransform(repo: GithubRepo, docPath: string) {
    const [owner] = new URL(repo.url).pathname.split("/").filter(Boolean);
    return (value: string, key: string) => {
        if (!owner || ABSOLUTE_URL.test(value)) return defaultUrlTransform(value);

        // Origin palsu hanya dipakai untuk menormalkan "../" terhadap lokasi dokumen.
        const { pathname, search, hash } = new URL(value, `https://repo.invalid/${docPath}`);
        const path = pathname.slice(1);

        return key === "src"
            ? `https://raw.githubusercontent.com/${owner}/${repo.name}/${repo.defaultBranch}/${path}`
            : `https://github.com/${owner}/${repo.name}/blob/${repo.defaultBranch}/${path}${search}${hash}`;
    };
}

const FENCED_CODE = /```[\s\S]*?```/g;
const WORDS_PER_MINUTE = 200;

/** Judul dari heading level 1 pertama (di luar blok kode). Fallback ke label dari path. */
export function docTitle(content: string, path: string): string {
    const match = /^#\s+(.+)$/m.exec(content.replace(FENCED_CODE, ""));
    if (!match) return docLabel(path);

    const title = match[1]
        .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // [teks](url) -> teks
        .replace(/[`*_]/g, "")
        .trim();
    return title || docLabel(path);
}

export function readingMinutes(content: string): number {
    const words = content.trim().split(/\s+/).length;
    return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}
