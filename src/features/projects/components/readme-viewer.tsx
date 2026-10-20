import { useEffect } from "react";
import { MarkdownContent } from "@/components/markdown/markdown-content";
import { EmptyState } from "@/components/ui/empty-state";
import { createReadmeUrlTransform } from "@/features/projects/lib/readme-url";
import type { GithubRepo } from "@/features/projects/schemas/github.schema";

export function ReadmeViewer({ repo }: { repo: GithubRepo }) {
    // README dirender setelah data dimuat, jadi hash di URL (/projects/x#overview) harus digulung manual.
    useEffect(() => {
        if (!repo.readme) return;
        const id = decodeURIComponent(window.location.hash.slice(1));
        if (id) document.getElementById(id)?.scrollIntoView({ behavior: "instant" });
    }, [repo.readme]);

    if (!repo.readme) return <EmptyState className="p-8">This repository has no README.</EmptyState>;

    return (
        <section aria-label="README" className="border-2 border-border bg-card p-6">
            <MarkdownContent urlTransform={createReadmeUrlTransform(repo)}>{repo.readme}</MarkdownContent>
        </section>
    );
}
