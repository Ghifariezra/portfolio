import { SITE } from "@/config/site";

/** Bentuk `head()` untuk route: judul "<title> | Nama Situs" + meta description opsional. */
export function pageHead(title: string, description?: string) {
    return {
        meta: [
            { title: `${title} | ${SITE.fullName}` },
            ...(description ? [{ name: "description", content: description }] : []),
        ],
    };
}

/** Home tidak punya judul halaman sendiri, jadi judulnya "<Nama Lengkap> | Portfolio". */
export function homeHead(description: string) {
    return {
        meta: [{ title: `${SITE.fullName} | Portfolio` }, { name: "description", content: description }],
    };
}