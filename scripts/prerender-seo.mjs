import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const DIST = "dist";
const API = "https://api.ezdev.xyz";
const SITE = {
    url: "https://ezdev.xyz",
    fullName: "Ghifari Ezra Ramadhan",
    ogImage: "/og-image.png",
    locale: "en_US",
};

// Harus sama dengan head() di src/routes/*.
const PAGES = [
    {
        path: "/",
        file: "index.html",
        title: `${SITE.fullName} | Portfolio`,
        description: `Portfolio of ${SITE.fullName}: featured projects, testing skills, and certifications.`,
    },
    {
        path: "/about",
        file: "about.html",
        title: `About | ${SITE.fullName}`,
        description: `About ${SITE.fullName}: skills, experience, education, and certifications.`,
    },
    {
        path: "/projects",
        file: "projects.html",
        title: `Projects | ${SITE.fullName}`,
        description: `Projects by ${SITE.fullName}, with live details from GitHub.`,
    },
    {
        path: "/apps",
        file: "apps.html",
        title: `Apps | ${SITE.fullName}`,
        description: `Windows apps by ${SITE.fullName}, with install numbers straight from the Microsoft Store.`,
    },
];

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
const abs = (p) => new URL(p, SITE.url).href;
const meta = (attr, key, content) => `<meta ${attr}="${key}" content="${esc(content)}" data-prerender>`;

function tags({ title, description, path, image }) {
    const url = path ? abs(path) : null;
    const img = abs(image || SITE.ogImage);
    return [
        `<title data-prerender>${esc(title)}</title>`,
        description && meta("name", "description", description),
        url && `<link rel="canonical" href="${esc(url)}" data-prerender>`,
        meta("property", "og:site_name", SITE.fullName),
        meta("property", "og:type", "website"),
        meta("property", "og:locale", SITE.locale),
        meta("property", "og:title", title),
        description && meta("property", "og:description", description),
        url && meta("property", "og:url", url),
        meta("property", "og:image", img),
        meta("name", "twitter:card", "summary_large_image"),
        meta("name", "twitter:title", title),
        description && meta("name", "twitter:description", description),
        meta("name", "twitter:image", img),
    ]
        .filter(Boolean)
        .join("\n    ");
}

const template = await readFile(join(DIST, "index.html"), "utf8");

async function emit(file, page) {
    const html = template
        .replace(/<title>[\s\S]*?<\/title>/, "")
        .replace("</head>", () => `    ${tags(page)}\n  </head>`);
    const target = join(DIST, file);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, html);
}

// Data project dari API publik. Gagal -> build tetap jalan tanpa halaman project.
let projects = [];
try {
    const res = await fetch(`${API}/api/v1/public/projects`, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    projects = (await res.json()).data.filter((p) => /^[\w-]+$/.test(p.slug));
} catch (err) {
    console.warn(`[seo] gagal mengambil projects, halaman project dilewati: ${err.message}`);
}

for (const page of PAGES) await emit(page.file, page);

for (const p of projects) {
    await emit(`projects/${p.slug}.html`, {
        title: `${p.title} | ${SITE.fullName}`,
        description: p.description ?? undefined,
        path: `/projects/${p.slug}`,
        image: p.image_url,
    });
}

// Fallback GitHub Pages untuk path yang tidak punya file (mis. project baru): SPA tetap jalan.
await emit("404.html", { title: PAGES[0].title, description: PAGES[0].description });

const urls = [...PAGES.map((p) => p.path), ...projects.map((p) => `/projects/${p.slug}`)];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${esc(abs(u))}</loc></url>`).join("\n")}
</urlset>
`;
await writeFile(join(DIST, "sitemap.xml"), sitemap);

console.log(`[seo] ${PAGES.length} halaman + ${projects.length} project, sitemap.xml, 404.html`);
