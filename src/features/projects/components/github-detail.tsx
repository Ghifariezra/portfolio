import { SectionHeading } from "@/components/ui/section-heading";
import { TagList } from "@/components/ui/tag-list";
import type { GithubRepo } from "../schemas/github.schema";
import { ContributorList } from "./contributor-list";
import { LanguageBar } from "./language-bar";
import { ReadmeViewer } from "./readme-viewer";
import { RepoStats } from "./repo-stats";

/** Bagian live dari GitHub: stats, topics, bahasa, kontributor, README. */
export function GithubDetail({ repo }: { repo: GithubRepo }) {
    return (
        <div className="space-y-8">
            <RepoStats repo={repo} />

            {repo.topics.length > 0 && (
                <section aria-label="Topics">
                    <SectionHeading>Topics</SectionHeading>
                    <TagList tags={repo.topics.map((t) => ({ key: t, label: t }))} />
                </section>
            )}

            <LanguageBar languages={repo.languages} />
            <ContributorList contributors={repo.contributors} />
            <ReadmeViewer repo={repo} />
        </div>
    );
}
