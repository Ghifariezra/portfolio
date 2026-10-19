export interface TreeNode {
    name: string;
    comment?: string;
    isDir: boolean;
    children: TreeNode[];
}

// "├── x", "└── x", dan varian ASCII ("|-- x", "+-- x", "`-- x").
const BRANCH = /^([\s│|]*)(?:├──|└──|\|--|\+--|`--)\s?(.*)$/u;
const TREE_LANGS = new Set(["tree", "filetree", "files"]);
const UNTYPED_LANGS = new Set([undefined, "text", "txt", "plaintext"]);

/** Block dianggap file tree kalau diberi bahasa "tree", atau tanpa bahasa tapi berisi karakter cabang. */
export function isFileTree(lang: string | undefined, code: string): boolean {
    if (lang && TREE_LANGS.has(lang)) return true;
    return UNTYPED_LANGS.has(lang) && /^[\s│|]*(?:├──|└──)/mu.test(code);
}

function makeNode(text: string): TreeNode {
    const [rawName, ...rest] = text.split(/\s+#\s*/);
    const name = rawName.trim();
    const comment = rest.join(" # ").trim();
    return {
        name: name.replace(/\/$/, ""),
        comment: comment || undefined,
        isDir: name.endsWith("/"),
        children: [],
    };
}

/**
 * Teks pohon (output `tree`) -> struktur node. null kalau bentuknya bukan pohon valid,
 * supaya pemanggil bisa jatuh kembali ke code block biasa. Murni, tanpa I/O.
 */
export function parseFileTree(source: string): TreeNode[] | null {
    const lines = source.split("\n").filter((l) => l.trim() !== "");
    if (lines.length === 0) return null;

    // Baris pertama tanpa penanda cabang = nama root (mis. "my-repo/").
    const hasRoot = !BRANCH.test(lines[0]);
    const root = hasRoot ? makeNode(lines[0].trim()) : null;

    const matches = lines.slice(hasRoot ? 1 : 0).map((l) => BRANCH.exec(l));
    if (matches.length === 0 || matches.some((m) => m === null)) return null;

    const rows = matches.filter((m): m is RegExpExecArray => m !== null);

    // Lebar indentasi per level (biasanya 4, tapi ada yang pakai 2).
    const unit = Math.min(...rows.map((m) => m[1].length).filter((n) => n > 0)) || 4;

    const top: TreeNode = root ?? { name: "", isDir: true, children: [] };
    const stack: TreeNode[] = [top]; // stack[d] = induk dari node berkedalaman d

    for (const m of rows) {
        const depth = Math.min(Math.floor(m[1].length / unit), stack.length - 1);
        const node = makeNode(m[2]);
        const parent = stack[depth];
        parent.isDir = true;
        parent.children.push(node);
        stack.length = depth + 1;
        stack.push(node);
    }

    return root ? [root] : top.children;
}
