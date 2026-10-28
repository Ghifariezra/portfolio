// Simpan DOM hasil render nyata ke HTML tiap route. Jalankan SETELAH prerender-seo.mjs.
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "@playwright/test";
import { loadEnv, preview } from "vite";

const DIST = "dist";
const PORT = 4174;
// Sama dengan yang dipakai build: env var VITE_API_URL menang atas .env.production.
const API = (loadEnv("production", process.cwd(), "VITE_").VITE_API_URL ?? "").replace(/\/+$/, "");
const ROUTES = [
    { path: "/", file: "index.html", ready: "section[aria-label='Introduction'] p.whitespace-pre-line" },
    { path: "/projects", file: "projects.html", ready: "article" },
];
const EMPTY_ROOT = /<div id="root">\s*<\/div>/;
// Di CI, snapshot yang dilewati harus menggagalkan build (REQUIRE_SNAPSHOT=1). Lokal tetap non-fatal.
const REQUIRED = !!process.env.REQUIRE_SNAPSHOT;

let failed = false;
let server;
let browser;
try {
    if (!/^https?:\/\//.test(API)) {
        throw new Error(`VITE_API_URL harus URL absolut saat build (sekarang: ${API || "kosong"})`);
    }

    server = await preview({ preview: { port: PORT, strictPort: true, open: false }, logLevel: "warn" });
    browser = await chromium.launch();

    for (const r of ROUTES) {
        const page = await browser.newPage();
        // Request API digantung: bagian yang belum ada di seed tetap skeleton, bukan state error.
        await page.route(`${API}/**`, () => {});
        await page.goto(`http://localhost:${PORT}${r.path}`, { waitUntil: "domcontentloaded" });
        await page.waitForSelector(r.ready, { timeout: 15000 });
        await page.waitForTimeout(300);
        const html = await page.$eval("#root", (el) => el.innerHTML);
        await page.close();

        const target = join(DIST, r.file);
        const doc = await readFile(target, "utf8");
        if (!EMPTY_ROOT.test(doc)) {
            console.warn(`[snapshot] ${r.file}: <div id="root"> tidak kosong/tidak ketemu, dilewati`);
            failed = true;
            continue;
        }
        await writeFile(
            target,
            doc.replace(EMPTY_ROOT, () => `<div id="root">${html}</div>`),
        );
        console.log(`[snapshot] ${r.path} -> ${r.file} (${(html.length / 1024).toFixed(1)} KB)`);
    }
} catch (err) {
    console.warn("[snapshot] dilewati:", err.message); // optimasi, jangan gagalkan build (kecuali REQUIRE_SNAPSHOT)
    failed = true;
} finally {
    await browser?.close();
    server?.httpServer.closeAllConnections?.();
    server?.httpServer.close();
}
process.exit(failed && REQUIRED ? 1 : 0);
