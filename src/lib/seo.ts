import { SITE } from "@/config/site";

export const absoluteUrl = (path = "/") => new URL(path, SITE.url).href;

interface SeoInput {
    /** Judul final, sudah lengkap. */
    title: string;
    description?: string;
    /** Path route, mis. "/about". Tanpa path, canonical dan og:url tidak dibuat. */
    path?: string;
    /** URL gambar share (boleh relatif atau absolut). Default: SITE.ogImage. */
    image?: string | null;
}

export function seoHead({ title, description, path, image }: SeoInput) {
    const url = path ? absoluteUrl(path) : undefined;
    const img = absoluteUrl(image || SITE.ogImage);

    return {
        meta: [
            { title },
            ...(description ? [{ name: "description", content: description }] : []),
            { property: "og:site_name", content: SITE.fullName },
            { property: "og:type", content: "website" },
            { property: "og:locale", content: SITE.locale },
            { property: "og:title", content: title },
            ...(description ? [{ property: "og:description", content: description }] : []),
            ...(url ? [{ property: "og:url", content: url }] : []),
            { property: "og:image", content: img },
            { name: "twitter:card", content: "summary_large_image" },
            { name: "twitter:title", content: title },
            ...(description ? [{ name: "twitter:description", content: description }] : []),
            { name: "twitter:image", content: img },
        ],
        links: url ? [{ rel: "canonical", href: url }] : [],
    };
}

/** Judul "<title> | Nama Lengkap". `path` mengisi canonical dan og:url. */
export function pageHead(title: string, description?: string, path?: string) {
    return seoHead({ title: `${title} | ${SITE.fullName}`, description, path });
}

/** Home tidak punya judul halaman sendiri, jadi judulnya "<Nama Lengkap> | Portfolio". */
export function homeHead(description: string) {
    return {
        ...seoHead({ title: `${SITE.fullName} | Portfolio`, description, path: "/" }),
        scripts: [
            {
                type: "application/ld+json",
                children: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Person",
                    name: SITE.fullName,
                    url: SITE.url,
                    jobTitle: "Full-Stack Developer",
                    sameAs: [SITE.github],
                }),
            },
        ],
    };
}
