import { defaultUrlTransform } from "react-markdown";
import type { GithubRepo } from "@/features/projects/schemas/github.schema";

const ABSOLUTE_URL = /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i;

/** Link dan gambar relatif di README ("./docs/a.png") diarahkan ke repo di GitHub, kalau tidak, semuanya rusak. */
export function createReadmeUrlTransform(repo: GithubRepo) {
    const [owner] = new URL(repo.url).pathname.split("/").filter(Boolean);
    return (value: string, key: string) => {
        if (!owner || ABSOLUTE_URL.test(value)) return defaultUrlTransform(value);
        const path = value.replace(/^\.?\//, "");
        return key === "src"
            ? `https://raw.githubusercontent.com/${owner}/${repo.name}/${repo.defaultBranch}/${path}`
            : `https://github.com/${owner}/${repo.name}/blob/${repo.defaultBranch}/${path}`;
    };
}
