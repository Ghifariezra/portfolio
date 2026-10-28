// Menghasilkan src/components/ui/icons.tsx dari ikon yang benar-benar diimport di src/.
// Jalankan ulang (pnpm gen:icons) setiap menambah ikon baru.
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(root, "src");
const OUT = join(SRC, "components", "ui", "icons.tsx");
const ASSETS = join(root, "node_modules", "@phosphor-icons", "core", "assets");
const WEIGHTS = ["regular", "bold", "fill"];
const SKIP = new Set(["Icon", "IconProps", "IconWeight"]);
const NEW_MODULE = "@/components/ui/icons";

const IMPORT_RE = /import\s+(type\s+)?\{([^}]*)\}\s*from\s*["'](@phosphor-icons\/react|@\/components\/ui\/icons)["']/g;

function* walk(dir) {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
        const p = join(dir, e.name);
        if (e.isDirectory()) yield* walk(p);
        else if (/\.(ts|tsx)$/.test(e.name) && p !== OUT) yield p;
    }
}

const names = new Set();
const toRewrite = [];

for (const file of walk(SRC)) {
    const text = readFileSync(file, "utf8");
    let usesPhosphor = false;
    for (const m of text.matchAll(IMPORT_RE)) {
        if (m[3] === "@phosphor-icons/react") usesPhosphor = true;
        if (m[1]) continue; // import type { ... }
        for (const raw of m[2].split(",")) {
            const spec = raw.trim();
            if (!spec || spec.startsWith("type ")) continue;
            const name = spec.split(/\s+as\s+/)[0].trim();
            if (!SKIP.has(name)) names.add(name);
        }
    }
    if (usesPhosphor) toRewrite.push([file, text]);
}

const kebab = (n) => n.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

function pathsOf(name, weight) {
    const suffix = weight === "regular" ? "" : `-${weight}`;
    const file = join(ASSETS, weight, `${kebab(name)}${suffix}.svg`);
    if (!existsSync(file)) throw new Error(`SVG tidak ditemukan: ${file}`);
    const svg = readFileSync(file, "utf8");
    const inner = svg.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
    if (/<(?!path\b)\w/.test(inner) || /(fill-rule|clip-rule|opacity|transform)/.test(inner)) {
        throw new Error(`${name}/${weight}: SVG tidak sederhana (bukan <path> polos), perlu penanganan khusus`);
    }
    return [...inner.matchAll(/\sd="([^"]+)"/g)].map((m) => m[1]);
}

const sorted = [...names].sort();
const body = sorted
    .map((n) => {
        const set = Object.fromEntries(WEIGHTS.map((w) => [w, pathsOf(n, w)]));
        return `const ${n}Paths: PathSet = ${JSON.stringify(set)};\nexport const ${n}: Icon = (props) => <IconBase paths={${n}Paths} {...props} />;`;
    })
    .join("\n\n");

const header = `// GENERATED oleh scripts/gen-icons.mjs, jangan diedit manual. Sumber: @phosphor-icons/core
import type { ComponentType, SVGProps } from "react";

export type IconWeight = "regular" | "bold" | "fill";

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "ref"> {
    size?: number | string;
    weight?: IconWeight;
}

export type Icon = ComponentType<IconProps>;

type PathSet = Record<IconWeight, string[]>;

function IconBase({ paths, size = "1em", weight = "regular", ...rest }: IconProps & { paths: PathSet }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 256 256"
            width={size}
            height={size}
            fill="currentColor"
            aria-hidden="true"
            {...rest}
        >
            {(paths[weight] ?? paths.regular).map((d) => (
                <path key={d} d={d} />
            ))}
        </svg>
    );
}

`;

writeFileSync(OUT, `${header}${body}\n`, "utf8");

let changed = 0;
for (const [file, text] of toRewrite) {
    const next = text.replace(/["']@phosphor-icons\/react["']/g, `"${NEW_MODULE}"`);
    if (next !== text) {
        writeFileSync(file, next, "utf8");
        changed++;
    }
}

console.log(`[icons] ${sorted.length} ikon -> ${OUT}`);
console.log(`[icons] ${changed} file import diganti ke ${NEW_MODULE}`);
console.log(`[icons] ${sorted.join(", ")}`);
