export const formatNumber = (n: number) => n.toLocaleString("en-US");

/**
 * "2026-08-01" -> "Aug 2026". Dikunci ke UTC: tanggal dari DB selalu "YYYY-MM-01" (tengah malam UTC),
 * tanpa ini browser di zona waktu negatif menampilkan bulan sebelumnya.
 */
export function formatMonth(iso: string): string {
    const d = new Date(iso);
    return Number.isNaN(d.getTime())
        ? "-"
        : d.toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });
}

/**
 * "Aug 2026 – Present" / "Aug 2026 – Oct 2026". Kalau awal dan akhir jatuh di bulan yang sama
 * (kursus satu bulan), cukup satu bulan: "Oct 2022". null kalau tanggal mulai tidak ada.
 */
export function formatRange(start: string | null, end: string | null): string | null {
    if (!start) return null;

    const from = formatMonth(start);
    if (!end) return `${from} – Present`;

    const to = formatMonth(end);
    return from === to ? from : `${from} – ${to}`;
}