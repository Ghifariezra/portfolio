import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { EmptyState } from "@/components/ui/empty-state";
import { createReadmeUrlTransform } from "../lib/readme-url";
import type { GithubRepo } from "../schemas/github.schema";

export function ReadmeViewer({ repo }: { repo: GithubRepo }) {
    if (!repo.readme) return <EmptyState className="p-8">This repository has no README.</EmptyState>;

    return (
        <section aria-label="README" className="border-2 border-border bg-card p-6">
            <div className="readme">
                <Markdown
                    remarkPlugins={[remarkGfm]}
                    urlTransform={createReadmeUrlTransform(repo)}
                    // Tanpa rehype-raw, HTML mentah di README (mis. <p align="center">) dibuang, bukan dieksekusi.
                    skipHtml
                >
                    {repo.readme}
                </Markdown>
            </div>
        </section>
    );
}
