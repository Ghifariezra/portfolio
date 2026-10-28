import { useEffect, useState } from "react";
import { Check, Copy } from "@/components/ui/icons";

export function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!copied) return;
        const timer = setTimeout(() => setCopied(false), 1500);
        return () => clearTimeout(timer);
    }, [copied]);

    async function copy() {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
        } catch {
            // Clipboard tidak tersedia (mis. konteks non-HTTPS): abaikan saja.
        }
    }

    return (
        <button
            type="button"
            onClick={copy}
            aria-label={copied ? "Copied" : "Copy code"}
            className="inline-flex cursor-pointer items-center gap-1 hover:text-foreground"
        >
            {copied ? <Check size={12} weight="bold" /> : <Copy size={12} />}
            {copied ? "Copied" : "Copy"}
        </button>
    );
}
