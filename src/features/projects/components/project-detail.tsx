import { TagList } from "@/components/ui/tag-list";
import type { ProjectItem } from "../schemas/project.schema";
import { GithubSection } from "./github-section";
import { ProjectHeader } from "./project-header";

export function ProjectDetail({ project }: { project: ProjectItem }) {
    return (
        <>
            <ProjectHeader project={project} />

            <div className="space-y-8">
                {project.image_url && (
                    <img
                        src={project.image_url}
                        alt=""
                        className="max-h-96 w-full border-2 border-border object-cover"
                    />
                )}

                {project.bullets.length > 0 && (
                    <section aria-label="Highlights">
                        <ul className="list-disc space-y-2 pl-5 leading-relaxed">
                            {project.bullets.map((b) => (
                                <li key={b}>{b}</li>
                            ))}
                        </ul>
                    </section>
                )}

                {project.skills.length > 0 && (
                    <section aria-label="Stack">
                        <TagList tags={project.skills.map((s) => ({ key: s.id, label: s.name }))} />
                    </section>
                )}

                {project.github_repo && <GithubSection repo={project.github_repo} />}
            </div>
        </>
    );
}
