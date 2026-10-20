import type { CvDocument } from "@/features/cv/schemas/cv.schema";

/** "Ghifari Ezra Ramadhan" -> "Ghifari-Ezra-Ramadhan-CV.pdf" (format nama file yang lazim dipakai rekruter/ATS). */
export function cvFileName(fullName: string): string {
    const base = fullName
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\p{L}\p{N}-]+/gu, "");
    return `${base || "CV"}-CV.pdf`;
}

/**
 * Render CV jadi PDF di browser lalu mengunduhnya.
 * @react-pdf/renderer (besar) di-import dinamis: baru diunduh saat tombol pertama kali diklik.
 */
export async function downloadCvPdf(cv: CvDocument): Promise<void> {
    const [{ pdf }, { CvPdfDocument }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/features/cv/components/cv-pdf-document"),
    ]);

    const blob = await pdf(<CvPdfDocument cv={cv} />).toBlob();

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = cvFileName(cv.basics.full_name);
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}
