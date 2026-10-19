import { useEffect, useState } from "react";
import { highlightCode } from "@/lib/markdown/highlight";

/** HTML hasil highlight, atau null selagi shiki dan grammar-nya dimuat (pemanggil menampilkan teks polos dulu). */
export function useHighlightedCode(code: string, lang?: string): string | null {
    const [html, setHtml] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        highlightCode(code, lang)
            .then((result) => !cancelled && setHtml(result))
            .catch(() => !cancelled && setHtml(null)); // gagal memuat: tetap tampil sebagai teks polos
        return () => {
            cancelled = true;
        };
    }, [code, lang]);

    return html;
}
