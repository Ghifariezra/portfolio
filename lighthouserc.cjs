/**
 * Lighthouse CI. Default-nya mobile + slow 4G terSimulasi (sama seperti PageSpeed Insights / report lu).
 *
 * Dua mode:
 *   - Lokal  : LHCI_BASE_URL kosong -> `vite preview` (hasil `pnpm build`) di localhost:4173.
 *              Catatan: API Worker harus mengizinkan origin http://localhost:4173 di CORS,
 *              kalau tidak halaman render state error dan skornya menyesatkan.
 *   - Live   : LHCI_BASE_URL=https://ezdev.xyz -> test situs production (dipakai setelah deploy).
 *
 * Jalankan manual: `pnpm build && pnpm exec lhci autorun`
 */
const base = process.env.LHCI_BASE_URL || "";
const live = base !== "";
const origin = live ? base.replace(/\/+$/, "") : "http://localhost:4173";

// Selalu pakai origin kanonis (tanpa www) supaya redirect www -> apex (+283 ms) tidak ikut terukur.
const PATHS = ["/", "/projects", "/about", "/contribute"];

module.exports = {
    ci: {
        collect: {
            url: PATHS.map((p) => `${origin}${p}`),
            numberOfRuns: 3, // diambil median-nya, 1 run terlalu berisik
            ...(live
                ? {}
                : {
                      startServerCommand: "pnpm exec serve dist -l 4173 --no-clipboard",
                      startServerReadyPattern: "Accepting connections",
                      startServerReadyTimeout: 30000,
                  }),
            settings: {
                chromeFlags: "--no-sandbox --headless=new",
            },
        },
        assert: {
            assertions: {
                // Mulai dari 'warn' untuk yang belum lolos; naikkan jadi 'error' setelah skor stabil.
                "categories:performance": ["warn", { minScore: 0.9, aggregationMethod: "median-run" }],
                "categories:accessibility": ["error", { minScore: 0.95 }],
                "categories:best-practices": ["error", { minScore: 0.95 }],
                "categories:seo": ["error", { minScore: 0.95 }],

                "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
                "total-blocking-time": ["warn", { maxNumericValue: 300 }],
                "largest-contentful-paint": ["warn", { maxNumericValue: 3500 }],
                "first-contentful-paint": ["warn", { maxNumericValue: 3000 }],
                "total-byte-weight": ["warn", { maxNumericValue: 1500000 }], // 1,5 MB; sekarang ~0,9 MB
            },
        },
        upload: {
            target: "temporary-public-storage", // laporan bisa dibuka lewat link, tanpa server sendiri
        },
    },
};
