import type { ReactNode } from "react";

interface IconLinkProps {
    href: string;
    /** Wajib: tombol ikon tidak punya teks, jadi label dibaca screen reader. */
    label: string;
    children: ReactNode;
}

/** Tombol ikon persegi yang membuka link eksternal di tab baru. */
export function IconLink({ href, label, children }: IconLinkProps) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={label}
            className="border-2 border-border bg-background p-1.5 text-muted-foreground hover:text-primary"
        >
            {children}
        </a>
    );
}
