/** "" / spasi saja -> null (API memakai null untuk "kosong", bukan string kosong). */
export const orNull = (value: string): string | null => {
    const trimmed = value.trim();
    return trimmed === "" ? null : trimmed;
};

export const parseSortOrder = (value: string): number => {
    const n = Number.parseInt(value, 10);
    return Number.isNaN(n) ? 0 : n;
};

/** Satu item per baris; baris kosong dibuang. */
export const parseLines = (raw: string): string[] =>
    raw
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

/** "2026-08-01" -> "2026-08" (format <input type="month">). */
export const toMonthInput = (date: string | null): string => date?.slice(0, 7) ?? "";

export const slugify = (value: string): string =>
    value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
